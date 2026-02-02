---
theme: seriph
background: https://cover.sli.dev
colorSchema: dark
title: "Agentic IDEs: rules, commands, skills"
info: |
  ## Agentic IDEs: rules, commands, skills
  How to make agent behavior repeatable for developers: guardrails, workflows, playbooks.

  20-minute talk for software engineers.
class: text-center
transition: slide-left
mdc: true
duration: 20min
---

## Agentic IDEs

# Rules, Commands, Skills

<!--
Opening: this is about making agent behavior repeatable (not hype, not model internals).
-->

<style>
/* Dark, non-black background for all slides */
:root {
  --slidev-theme-background: transparent;
}
.slidev-page {
  background: radial-gradient(1200px 700px at 20% 20%, rgba(78, 197, 212, 0.18), rgba(78, 197, 212, 0) 60%),
              radial-gradient(1100px 700px at 80% 75%, rgba(124, 92, 255, 0.14), rgba(124, 92, 255, 0) 60%),
              linear-gradient(135deg, #0b1220 0%, #0e2a3a 55%, #112d4e 100%);
}
.slidev-layout {
  color: #e8f3ff;
}

h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---

# The problem: prompts don’t scale

- Everyone writes prompts differently
- Agents drift without guardrails
- Teams need repeatable behavior and reviewable diffs

**Thesis**: encode behavior as repo artifacts.

---

# Agentic IDE vs “not agentic”

| | Not agentic (chat only) | Agentic IDE (structured) |
|---|---|---|
| **Inputs** | ad-hoc prompts | rules + commands + skills |
| **Consistency** | per-person | team-wide defaults |
| **Quality control** | “trust the response” | diffs + checks + stop conditions |
| **Repeatability** | low | high |
| **Onboarding** | tribal knowledge | version-controlled artifacts |

---

# Mental model: the agent loop

<div class="mt-8 flex items-stretch gap-3 text-left">
  <div class="flex-1 rounded-xl border border-white/10 bg-white/5 p-4">
    <div class="text-sm opacity-70">1</div>
    <div class="text-xl font-semibold mt-1">Plan</div>
    <div class="text-sm opacity-80 mt-2">Clarify goal, constraints, definition of done.</div>
  </div>
  <div class="flex items-center text-3xl opacity-60 px-1">→</div>
  <div class="flex-1 rounded-xl border border-white/10 bg-white/5 p-4">
    <div class="text-sm opacity-70">2</div>
    <div class="text-xl font-semibold mt-1">Act</div>
    <div class="text-sm opacity-80 mt-2">Edit files, run tools, draft changes.</div>
  </div>
  <div class="flex items-center text-3xl opacity-60 px-1">→</div>
  <div class="flex-1 rounded-xl border border-white/10 bg-white/5 p-4">
    <div class="text-sm opacity-70">3</div>
    <div class="text-xl font-semibold mt-1">Observe</div>
    <div class="text-sm opacity-80 mt-2">Read outputs: diffs, logs, errors, results.</div>
  </div>
  <div class="flex items-center text-3xl opacity-60 px-1">→</div>
  <div class="flex-1 rounded-xl border border-white/10 bg-white/5 p-4">
    <div class="text-sm opacity-70">4</div>
    <div class="text-xl font-semibold mt-1">Verify</div>
    <div class="text-sm opacity-80 mt-2">Run checks; decide: done vs iterate.</div>
  </div>
</div>

<div class="mt-6 text-sm opacity-80">
Rules <span class="opacity-60">= constraints</span> • Commands <span class="opacity-60">= workflows</span> • Skills <span class="opacity-60">= playbooks</span>
</div>

<!--
Keep this short; everything else maps to this loop.
-->

---

# Cursor artifacts (the building blocks)

What you can ship in a repo to make agent behavior repeatable:

- **Rules**: persistent instructions that get included in context  
  - Project: `.cursor/rules/` (optionally `.mdc` with `description` / `globs`)
  - Alternative: `AGENTS.md` in the repo root for simple instructions
- **Commands**: reusable `/` prompts  
  - Project: `.cursor/commands/<command>.md`
- **Skills**: packaged playbooks (+ optional scripts/assets)  
  - Project: `.cursor/skills/<skill>/SKILL.md` (+ `scripts/`, `assets/`, `references/`)

<!--
This slide is intentionally “generic”: artifacts and where they live.
-->

---

# Rules = guardrails

<div class="mt-6 grid grid-cols-2 gap-8 items-center text-left">
  <div>
    <ul>
      <li>Encode constraints once (scope, safety, style)</li>
      <li>Apply always / by glob / intelligently / manually</li>
      <li>Make “good behavior” the default for everyone</li>
    </ul>
  </div>
  <div class="rounded-xl border border-white/10 bg-white/5 p-3">
    <img src="/diagrams/cursor-rules-settings.png" class="w-full rounded-lg" alt="Cursor Rules settings screenshot" />
  </div>
</div>

---

## Rules (Cursor): what they are

From Cursor’s docs, rules are **system-level instructions** included in context to give the agent persistent guidance across sessions. Types include:
- Project Rules (repo) + User Rules + Team Rules + `AGENTS.md`

Use cases:
- encode domain knowledge
- standardize style/architecture decisions
- automate templates/workflows

<!--
Source: Cursor Rules docs.
-->

---

## Rules: how to structure them

- Store **Project Rules** in `.cursor/rules/` (version-controlled)
- Rule files can be `.md` (simple) or `.mdc` (with frontmatter metadata)
- Use `.mdc` when you want better control via `description` / `globs` / `alwaysApply`

Rule “types” you can choose (conceptually):
- **Always Apply**: included in every chat
- **Apply Intelligently**: agent includes it when relevant
- **Apply to Specific Files**: based on a file pattern match
- **Apply Manually**: only when you @-mention it

Example `.mdc` metadata (shown without the `---` separators):

```yaml
description: Guardrails for backend changes
globs:
  - backend/**/*.ts
alwaysApply: false
```

<!--
Source: Cursor Rules docs. Emphasize: small, composable rules.
-->

---

## Rules: what to put in them (practical)

- Repo context (purpose, key paths)
- Safety boundaries (no secrets, no drive-by changes)
- “Definition of done” for common tasks
- File boundaries (what can/can’t be touched)

**Avoid**: pasting huge style guides or duplicating linters.

---

# Commands = workflows

<div class="mt-6 grid grid-cols-2 gap-8 items-center text-left">
  <div>
    <ul>
      <li>Reusable <code>/</code> actions</li>
      <li>Great for “plan → implement → verify”</li>
      <li>Reduces omissions and context switching</li>
    </ul>
  </div>
  <div class="rounded-xl border border-white/10 bg-white/5 p-3">
    <img src="/diagrams/cursor-commands-input.png" class="w-full rounded-lg" alt="Cursor Commands input screenshot" />
  </div>
</div>

---

## Commands (Cursor): what they are

Cursor Commands are **custom slash commands** that show up when you type `/` in Agent chat.

Think of them as **reusable prompt + checklist templates** for common workflows:
- repeatable “do the same thing every time” tasks
- consistent checklists (review, security, release, onboarding)
- guardrails (“don’t commit”, “stop and ask if tests fail”, etc.)

Where they live:
- **Project**: `.cursor/commands/<command>.md`
- **Global**: `~/.cursor/commands/<command>.md`
- **Team**: managed in the Cursor Dashboard (auto-available to the team)

Bonus: **parameters** work like this — anything after the command name is included as extra context (e.g. `/pr-ready DX-123`).

<!--
Source: Cursor changelog 1.6 (commands stored in .cursor/commands/*.md).
-->

---

## Commands: design pattern

**A good command contains**:
- Objective + when to use
- Steps (including what to run)
- Validation checklist
- Stop conditions (when to ask a human)

Default: never commit/push unless explicitly requested.

---

# Skills = playbooks (+ scripts)

<div class="mt-6 grid grid-cols-2 gap-8 items-center text-left">
  <div>
    <ul>
      <li>Portable package: instructions + references + scripts</li>
      <li>Agent loads skills on demand (keeps context lean)</li>
      <li>Can behave like a command with <code>disable-model-invocation: true</code></li>
    </ul>
  </div>
  <div class="rounded-xl border border-white/10 bg-white/5 p-3">
    <img src="/diagrams/dynamic-context-discovery.png" class="w-full rounded-lg" alt="Dynamic context discovery diagram (tools loaded on demand)" />
  </div>
</div>

---

## Skills (Cursor): what they are

Skills are a **portable, version-controlled package** that teaches agents how to do domain-specific tasks. Cursor discovers skills from skill directories and the agent decides when they’re relevant (or you can make them manual).

Project-level skill directories (Cursor docs):
- `.cursor/skills/`
- `.claude/skills/` (compat)
- `.codex/skills/` (compat)

Each skill is a folder containing `SKILL.md` with YAML frontmatter.

<!--
Source: Cursor Agent Skills docs.
-->

---

# Skills: what to include

- `SKILL.md` instructions (when to use, steps, verification)
- `scripts/` for automation the agent can run
- `references/` for deeper docs loaded on demand
- `assets/` for templates/resources

Use `disable-model-invocation: true` when you want a skill to behave like an explicit command.

---

# Pitfalls + guardrails

- Secrets/private data: never paste, never commit
- Scope creep: keep diffs small, file-bound
- Hallucinations: trust checks and diffs, not confident text
- Team consistency: review rules/commands/skills like code

---

# Adoption checklist (start tomorrow)

Start with:
- 1 always-apply rule (safety + workflow)
- 1 scoped rule (domain conventions)
- 1 command (your most repetitive workflow)
- 1 skill (a playbook you keep re-explaining)

Measure:
- fewer prompt re-writes
- smaller diffs
- faster “first draft” PRs

---

# Useful links

- [Cursor Rules](https://cursor.com/docs/context/rules)
- [Cursor Agent Skills](https://cursor.com/docs/context/skills)
- [Slash commands announcement (storage path)](https://cursor.com/changelog/1-6)
- [Agent Skills standard](https://agentskills.io)

---
layout: center
class: text-center
---

# Wrap-up

Rules make behavior consistent.  
Commands make workflows repeatable.  
Skills make teams scalable.

Q&A

