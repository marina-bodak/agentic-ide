# /pr-ready — PR summary + test plan (no commit/push)

## Objective
Turn the current working tree into a reviewable PR: concise summary, rationale, and a repo-appropriate test plan checklist.

## Hard constraints
- **Do not commit or push** unless the user explicitly asks.
- Keep scope tight: no drive-by refactors.

## Steps
1. Run:
   - `git status`
   - `git diff`
   - `git log -5 --oneline`
2. Produce a PR-ready output:
   - **Title**: short and specific
   - **Summary**: 2–4 bullets describing what changed and why
   - **Test plan**: checklist (see below)
   - **Risks/notes**: anything reviewers should watch for
3. If changes touch Slidev output or demo flow, recommend a quick verification run.

## Test plan checklist (this repo)
- [ ] `npm run dev` (slides load; navigation works)
- [ ] `npm run build` (build succeeds)
- [ ] (Optional) `npm run export` (if exporting is relevant to the change)
- [ ] Reviewed `git diff` for scope + correctness

## Stop conditions
- If any command output indicates risk (auth prompts, secrets, large diffs), stop and ask the user before proceeding.

