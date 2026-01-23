# PRD: Agentic IDE — Rules, Commands, Skills (20-minute Engineer Talk)

## Summary
Create a 20-minute presentation (Slidev deck in this repo) for software engineers on **how to operationalize an Agentic IDE using rules, commands, and skills**—how they fit together, how to author them, and how to use them safely. Include a **light demo (2–4 minutes)**.

## Background / Problem Statement
Most engineers have used autocomplete and chat assistants, but are still unclear on:
- How to make agent behavior **repeatable and team-friendly** (beyond one-off prompts).
- How to use **rules** to encode constraints/standards, **commands** to run repeatable workflows, and **skills** to standardize higher-level tasks.
- How to keep these mechanisms safe (secrets, scope, verification) and maintainable (ownership, versioning, review).

This talk should give an accurate mental model and a practical workflow engineers can try immediately.

## Audience
- **Primary**: Software engineers (ICs), full-stack/FE/BE, comfortable with Git, code review, and basic CI.
- **Assumed knowledge**: IDE usage, PR workflow, reading diffs, basic testing/linting.
- **Not required**: Deep ML knowledge.

## Goals (what attendees should be able to do after)
1. **Explain** the role of rules, commands, and skills in making agentic workflows consistent.
2. **Write** a small rule that encodes repo-specific constraints (style, safety, scope).
3. **Define/use** a command that runs a repeatable workflow (plan → implement → verify).
4. **Create/use** a skill to standardize a recurring task (e.g., PRD creation, refactor checklist).
5. **Apply** safety practices: least privilege, secret hygiene, deterministic verification, and review discipline.

## Non-goals
- Building custom LLM tooling / training / fine-tuning.
- Deep dive into model architectures, tokenization, or benchmarking.
- Vendor comparison shootout or “which model is best.”
- Replacing engineering practices (tests, reviews, CI) with “trust the agent.”

## Key Messages (3–5)
1. **Rules make agents consistent**: encode constraints once, reuse everywhere.
2. **Commands make workflows repeatable**: turn “prompt recipes” into muscle memory.
3. **Skills make teams scalable**: share best practices as reusable, reviewable building blocks.
4. **Diffs and checks are the contract**: review + verify like any other change.
5. **Safety is designed, not hoped for**: explicit boundaries for data, tools, and scope.

## Narrative Arc
1. Hook: “One-off prompts don’t scale—how do we make agent output consistent?”
2. Mental model: agent loop + where rules/commands/skills plug in.
3. Rules: constraints, guardrails, repo conventions.
4. Commands: repeatable workflows (plan → implement → verify).
5. Skills: packaged know-how for recurring tasks.
6. Light demo + safety/ops + next steps.

## Timeboxed Outline (20 minutes total)
### 0:00–1:30 — Hook / motivation
- Why agentic IDE now, and why **repeatability** is the bottleneck (teams, onboarding, quality).
- What success looks like: predictable diffs, fewer “agent surprises,” faster drafts with guardrails.

### 1:30–4:30 — Mental model: agent loop + “where structure lives”
- Agent loop: **Plan → Act (tools) → Observe → Verify → Iterate**.
- Where structure lives:
  - Rules = constraints/standards
  - Commands = repeatable workflows
  - Skills = reusable task playbooks
- Failure modes: scope creep, wrong assumptions, missing verification.

### 4:30–7:30 — Rules: guardrails that prevent bad outcomes
- What belongs in a rule: constraints, file boundaries, security hygiene, style conventions.
- Anti-patterns: overly broad rules, conflicting rules, “policy by prompt”.
- How rules evolve: ownership, review, versioning.

### 7:30–10:30 — Commands: turn a good workflow into a button
- A standard command flow: ask for plan → implement → summarize diff → run checks.
- What “good command output” looks like: explicit steps, checkpoints, stop conditions.

### 10:30–13:00 — Skills: reusable task playbooks
- What belongs in a skill: when to use it, inputs required, steps, verification.
- Examples: “Create PRD”, “Refactor with tests”, “Dependency upgrade”.

### 13:00–17:00 — Light demo (2–4 minutes) + debrief
- Show: applying a rule + running a command + using a skill on a small repo change.
- Debrief: what prevented drift; where verification happened.

### 17:00–20:00 — Pitfalls, safety, and next steps
- Security/privacy checklist and “what never to paste”.
- Team process: where rules/skills live, review flow, CI gates.
- “Try tomorrow”: 1 rule + 1 command + 1 skill starter kit.

## Light Demo Spec (2–4 minutes)
### Demo goal
Demonstrate a disciplined agent workflow that is **repeatable** via rules/commands/skills and produces a clean diff.

### Recommended scenario (low risk, high clarity)
- **Scenario**: “Use a PRD-writing skill + a ‘plan→implement→verify’ command to update the repo docs for this talk, while a rule enforces scope/safety.”
- **Why**: small surface area, instant diff, shows all three primitives working together.

### Demo steps (scriptable)
1. Provide a short spec to the agent: objective + constraints + files to touch + acceptance criteria.
2. Ask the agent for a plan, then approve.
3. Let it implement, then show verification: `git diff`, quick preview/build if desired.

### Success criteria
- Produces a minimal diff in the intended files only.
- The result matches timebox (duration set to 20 minutes) and contains clear outline.
- No “drive-by” changes to unrelated files.

### Failure fallback (important)
- Have a prepared branch/commit or copied diff to paste/apply.
- If tooling fails, switch to “demo as walkthrough” of the diff and the workflow checkpoints.

## Content Requirements (for the eventual deck)
- **Required slides/sections**
  - Definitions slide: agent loop + rules vs commands vs skills
  - Agent loop diagram (Plan/Act/Observe/Verify)
  - Rules slide: what to encode + examples
  - Commands slide: workflow/checkpoints template
  - Skills slide: structure + examples
  - Safety checklist slide
  - Demo slide: goal + steps + what to look for in the diff
  - Closing: next steps + resources
- **Diagrams**
  - One simple flow diagram of the agent loop
  - Optional: “verification ladder” visual
- **Code snippets policy**
  - Only show small, readable snippets; prefer diffs and check outputs.
  - Avoid long live-coding segments; keep changes scoped.

## Constraints / Assumptions
- 20-minute hard cap; prioritize clarity over breadth.
- Demo must be resilient to: no internet, flaky auth, slow installs.
- Avoid exposing secrets or private code in prompts/screenshare.
- Accessibility: high contrast, readable font size, minimal dense text.

## Success Metrics
- **Immediate** (end of talk): attendees can articulate one workflow step (constraints/checkpoints) they’ll adopt.
- **Follow-up** (1–2 weeks): at least one team/attendee reports using a repeatable “prompt as spec” template on a real task.
- **Quality**: talk feedback indicates the mental model and safety guidance were clear (≥4/5).

## Acceptance Criteria (Definition of Done)
### PRD is “done” when
- It targets **software engineers** explicitly (assumptions/prereqs stated).
- It timeboxes to **20 minutes** with an outline that sums to 20 minutes.
- It specifies a **light demo (2–4 minutes)** including scenario, steps, success criteria, and fallback.
- It includes explicit **non-goals**, **constraints/assumptions**, and **risks/mitigations**.
- It includes **success metrics** and **milestones**.

### Deck is “done” when (resulting Slidev deck)
- Deck metadata matches the PRD (title/topic, duration \(20min\)).
- Slides cover every required section listed in “Content Requirements”.
- Demo slide(s) include: goal, exact steps, and what to verify in the diff/checks.
- A full run-through fits in 20 minutes with a 1-minute buffer.
- Speaker can complete demo within 4 minutes **offline** or can switch to the fallback smoothly.

## Milestones
1. PRD written (this doc).
2. Deck outline implemented in `slides.md`.
3. Demo rehearsed with a timed run (2–4 min).
4. Full dry run (20 min) with notes and pacing.
5. Final polish (visuals, links, speaker notes).

## Risks & Mitigations
- **Hallucinated or unsafe changes**: emphasize verification and least privilege; keep demo scoped.
- **Demo flakiness**: pre-prepare fallback; practice offline.
- **Over-promising**: include “bad fits” and failure modes explicitly.
- **Security/privacy**: include a “do not paste” guidance and local-only options.

