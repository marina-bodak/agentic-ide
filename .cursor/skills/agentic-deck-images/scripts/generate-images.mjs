import fs from 'node:fs/promises'
import path from 'node:path'
import zlib from 'node:zlib'

function getEnv(name) {
  return process.env[name] || ''
}

async function fileExists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function writePngFromBase64(base64, outPath) {
  const buf = Buffer.from(base64, 'base64')
  await fs.writeFile(outPath, buf)
}

// Minimal PNG writer for deterministic placeholders (no external deps).
function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      const mask = -(crc & 1)
      crc = (crc >>> 1) ^ (0xedb88320 & mask)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length, 0)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

function makePlaceholderPng({ width, height, seedLabel }) {
  // Deterministic colors derived from filename.
  let h = 2166136261
  for (const c of seedLabel) h = (h ^ c.charCodeAt(0)) * 16777619 >>> 0

  const c1 = [(h & 0xff), (h >>> 8) & 0xff, (h >>> 16) & 0xff, 255]
  const c2 = [((h >>> 5) & 0xff), ((h >>> 13) & 0xff), ((h >>> 21) & 0xff), 255]
  const c3 = [((h >>> 11) & 0xff), ((h >>> 19) & 0xff), ((h >>> 27) & 0xff), 255]

  // Keep colors in a readable range (avoid too dark).
  for (const c of [c1, c2, c3]) {
    c[0] = 64 + (c[0] % 160)
    c[1] = 64 + (c[1] % 160)
    c[2] = 64 + (c[2] % 160)
  }

  const bytesPerPixel = 4
  const rowSize = 1 + width * bytesPerPixel // filter byte + pixels
  const raw = Buffer.alloc(rowSize * height)

  const third = Math.floor(width / 3)
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize
    raw[rowStart] = 0 // filter type 0
    for (let x = 0; x < width; x++) {
      const px = rowStart + 1 + x * bytesPerPixel
      const band = x < third ? c1 : x < third * 2 ? c2 : c3
      raw[px + 0] = band[0]
      raw[px + 1] = band[1]
      raw[px + 2] = band[2]
      raw[px + 3] = 255
    }
  }

  // Add a subtle top bar.
  const barH = Math.max(8, Math.floor(height * 0.06))
  for (let y = 0; y < barH; y++) {
    const rowStart = y * rowSize
    for (let x = 0; x < width; x++) {
      const px = rowStart + 1 + x * bytesPerPixel
      raw[px + 0] = 28
      raw[px + 1] = 28
      raw[px + 2] = 32
      raw[px + 3] = 255
    }
  }

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  const compressed = zlib.deflateSync(raw, { level: 6 })
  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0))
  ])
}

async function writePlaceholderPng(outPath, seedLabel) {
  const png = makePlaceholderPng({ width: 1024, height: 1024, seedLabel })
  await fs.writeFile(outPath, png)
}

async function generateOne({ apiKey, baseUrl, model, prompt, size }) {
  const res = await fetch(`${baseUrl}/v1/images/generations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      prompt,
      size,
      // Prefer base64 so we can write directly to disk.
      response_format: 'b64_json'
    })
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`OpenAI images API failed: ${res.status} ${res.statusText}\n${text}`)
  }

  const json = await res.json()
  const first = json?.data?.[0]
  const b64 = first?.b64_json
  if (!b64) {
    throw new Error(`Unexpected OpenAI images response; missing data[0].b64_json`)
  }
  return b64
}

async function main() {
  const apiKey = getEnv('OPENAI_API_KEY')
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com'

  const configPath = path.resolve('.cursor/skills/agentic-deck-images/assets/image-prompts.json')
  const raw = await fs.readFile(configPath, 'utf8')
  const cfg = JSON.parse(raw)

  const model = process.env.OPENAI_IMAGE_MODEL || cfg.model || 'gpt-image-1'
  const size = process.env.OPENAI_IMAGE_SIZE || cfg.size || '1024x1024'
  const outDir = path.resolve(cfg.outputDir || 'public/generated')

  await ensureDir(outDir)

  if (!apiKey) {
    console.warn('OPENAI_API_KEY is not set; generating placeholder images instead of calling the OpenAI API.')
  }

  for (const img of cfg.images || []) {
    const outPath = path.join(outDir, img.filename)
    if (await fileExists(outPath)) {
      // Don’t regenerate unless explicitly requested.
      console.log(`skip (exists): ${path.relative(process.cwd(), outPath)}`)
      continue
    }

    if (!apiKey) {
      console.log(`placeholder: ${img.filename}`)
      await writePlaceholderPng(outPath, img.filename)
      console.log(`wrote: ${path.relative(process.cwd(), outPath)}`)
      continue
    }

    console.log(`generate: ${img.filename}`)
    const b64 = await generateOne({ apiKey, baseUrl, model, prompt: img.prompt, size })
    await writePngFromBase64(b64, outPath)
    console.log(`wrote: ${path.relative(process.cwd(), outPath)}`)
  }
}

main().catch((err) => {
  console.error(err?.stack || String(err))
  process.exitCode = 1
})

