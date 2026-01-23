# /demo-runbook — 2–4 minute demo script (+ fallback)

## Objective
Produce a tight, rehearsable **2–4 minute** demo script for this talk and an explicit fallback that works if live actions fail.

## Topic constraint (must)
Keep the demo anchored to: **rules**, **commands**, **skills** (avoid generic LLM talk).

## Inputs (ask if missing)
- Are we demoing in this repo (`agentic-ide`)?
- Will we have internet during the demo? (If unsure, assume **no**.)

## Demo plan (live) — target 3 minutes
### 0:00–0:20 — Setup line
- “We’re going to make agent behavior repeatable using rules, commands, and skills.”

### 0:20–1:20 — Rules (show the guardrails)
- Open `.cursor/rules/00-project-context.mdc` and point out:
  - topic focus (rules/commands/skills)
  - npm workflow
- Open `.cursor/rules/10-safety-and-verification.mdc` and point out:
  - scope control + verification

### 1:20–2:10 — Commands (show the workflow as a button)
- Type `/dev-deck` and run it.
- Narrate: “This is a reusable workflow prompt in `.cursor/commands/dev-deck.md`.”

### 2:10–2:50 — Skills (show the playbook concept)
- Show `docs/PRD.md` and the section structure (outline + demo + acceptance criteria).
- Explain: “Skills are reusable playbooks; we keep the canonical structure here and reference it.”

### 2:50–3:10 — Verification (close the loop)
- Show `git diff` (or state: “we verify via diff + build”).

## Fallback (if live demo fails): “demo as diff walkthrough”
1. Do **not** troubleshoot live.
2. Open and explain these files in order:
   - `.cursor/rules/00-project-context.mdc`
   - `.cursor/rules/10-safety-and-verification.mdc`
   - `.cursor/commands/dev-deck.md`
   - `docs/PRD.md`
3. Explain what each artifact standardizes:
   - rules = constraints
   - commands = workflows
   - skills/playbooks = repeatable task structure
4. End with: “The diff is the interface; we keep it small and reviewable.”

## Stop conditions
- If running `/dev-deck` would require a long install or approvals, switch to fallback immediately.

