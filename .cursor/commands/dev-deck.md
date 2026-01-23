# /dev-deck — run Slidev locally

## Objective
Start the Slidev dev server reliably for this repo using **npm**, and provide a quick validation checklist.

## When to use
- You want to preview `slides.md` changes quickly.
- You’re about to demo and want to confirm everything works.

## Steps (safe auto-run)
1. Confirm you’re in the repo root (where `package.json` is).
2. If dependencies are missing (no `node_modules/` or install errors), run:
   - `npm install`
3. Start the dev server:
   - `npm run dev`
4. If the terminal asks for permissions/network access, stop and ask the user to approve.

## Quick validation checklist
- Slides load and navigation works.
- Topic is correct: **Agentic IDE — rules, commands, skills**.
- No obvious console errors.

## Stop conditions
- If `npm install` fails: paste the error output and stop; propose the smallest fix.
- If `npm run dev` fails: capture logs; do not “guess-fix” unrelated files.

