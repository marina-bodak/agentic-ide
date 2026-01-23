---
name: agentic-deck-images
description: Generate Slidev slide images via the OpenAI Images API and wire them into slides for the Agentic IDE (rules/commands/skills) talk.
disable-model-invocation: true
---

# Agentic deck images

This skill generates a small set of slide images for this repo’s talk topic (**rules / commands / skills**) and updates/validates slides to reference them.

## When to use
- You are preparing the deck and want consistent visual slides without hand-design.
- You want to refresh visuals while keeping the content structure the same.

## Requirements
- Set `OPENAI_API_KEY` in your environment.
- Network access is required to call the OpenAI API.

## What this skill does
1. Generates images defined in `assets/image-prompts.json` using the **OpenAI Images API**.
2. Saves outputs to `public/generated/` (so Slidev can reference them as `/generated/<file>.png`).
3. Ensures `slides.md` includes slides that reference these images (Rules / Commands / Skills).

## How to run (scripts)
- Generate images:
  - `node scripts/generate-images.mjs`

## Notes / constraints
- Keep prompts aligned to the talk: **Agentic IDE — Rules, Commands, Skills**.
- Do not generate images that contain secrets, private code, or internal identifiers.
- Prefer simple diagrams/illustrations that read well on a projector.

