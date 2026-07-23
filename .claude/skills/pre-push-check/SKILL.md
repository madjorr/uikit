---
name: pre-push-check
description: >
  Manual, local pre-push gate for packages/ui-react and packages/ui-spec
  changes of any size — a one-line fix or a multi-file feature. Auto-discovers
  which components changed versus a base ref (default origin/main), covering
  both committed commits and uncommitted working-tree edits, so nothing needs
  naming by hand. Reuses component-readiness's audit.sh per touched component
  (TOKENS/IMPORTS/IMPL/SPEC/TESTS/FIGMA plus hardcoded-label, physical-RTL, and
  docs-page advisories), then runs the dynamic checks (vitest scoped to
  touched components, typecheck, lint, ui-spec test) and a changeset-presence
  check — all in one command. Also documents the agent-judgment steps a script
  can't do (implementation conformance, spec/docs content accuracy) and when
  to reach for /figma-component --update instead (design-relevant changes).
  Read-only — never edits files, never runs git push itself. Invoke with
  /pre-push-check [base-ref].
argument-hint: '[base-ref]'
---

# Skill: /pre-push-check

A **manual, local, read-only gate** you run yourself before `git push` — not a
hook, not automatic. It exists because the mandatory checklist enforced by
`/figma-component`/`/legacy-component` on a component's _first_ build tends to
get silently skipped on _follow-up_ fixes, since those don't necessarily go
through the same skill again. This is the single command to re-assert it,
sized for a small or medium change — not a full build recipe.

Read the workspace contracts first — they override anything here on conflict:

- [packages/ui-react/AGENTS.md](../../../packages/ui-react/AGENTS.md) +
  [context/conventions.md](../../../packages/ui-react/context/conventions.md)
- [.claude/skills/component-readiness/SKILL.md](../component-readiness/SKILL.md)
  (reused directly for the per-component static audit — don't reinvent it)

---

## When this is the right tool — and when it isn't

**Use this** for a design-irrelevant change: a logic fix, an a11y attribute
tweak, an i18n/RTL fix, a perf change, a type fix, a refactor. None of that
needs a Figma re-read.

**Use `/figma-component <Name> <url> --update` instead** (or `/legacy-component
--update`) when the change is design-relevant: a new/changed variant, a prop
that maps to a Figma property, a visual restyle. That forces the full recipe
to re-run — re-read the Figma node, re-check token mapping, re-verify
tests/stories/VR/spec/changeset — which is the only way to catch _design
drift_ (Figma changed and code didn't, or vice versa). This gate cannot see
that; it only checks what's already in the code.

Rule of thumb: **if you'd have to open the Figma file to explain the change,
use `--update`; if you wouldn't, use this gate.**

---

## Invocation

```
/pre-push-check [base-ref]
```

`base-ref` defaults to `origin/main` (falling back to local `main`). Pass an
explicit ref to compare against something else (e.g. a stacked branch).

---

## Steps

1. **Run the script**:

   ```bash
   bash .claude/skills/pre-push-check/scripts/pre-push-audit.sh
   ```

   It diffs `base-ref` against `HEAD` **and** the working tree (so uncommitted
   edits are covered too — this runs before you've even committed, let alone
   pushed), derives the touched components automatically, and prints:
   - `CHANGED` — every file that differs from `base-ref`.
   - `COMPONENT_AUDIT` — `component-readiness`'s `audit.sh` output per touched
     component: `TOKENS`/`IMPORTS`/`IMPL`/`SPEC`/`TESTS`/`FIGMA` plus the
     hardcoded-label, physical-directional-utility, and docs-page advisories.
   - `DYNAMIC` — `vitest` scoped to the touched components, then `typecheck`,
     `lint`, and (if `packages/ui-spec` changed) `ui-spec test`.
   - `CHANGESET` — `PRESENT`/`MISSING` for a `packages/ui-react` change.

   If it short-circuits with `RESULT: PUSH-READY — no packages/ui-react or
packages/ui-spec changes`, stop here — nothing else in this skill applies.

2. **Fix anything the script flags** — a `DRIFT` row (dangling token, missing
   import, Radix/`asChild`), a failing dynamic check, or a missing changeset —
   then re-run. Treat `INCOMPLETE` rows and advisory notes (i18n/RTL/docs) as
   judgment calls, not automatic fails; see `component-readiness`'s SKILL.md
   for the false-positive shapes for each.

3. **Walk the agent-judgment steps** — a script can't read for you. Do this by
   hand for each touched component, reusing
   [`component-readiness`'s "Implementation conformance & spec/docs content
   accuracy"](../component-readiness/SKILL.md#implementation-conformance--specdocs-content-accuracy-agent-step)
   section directly rather than re-deriving a checklist here:
   - **Implementation conformance** — right primitive/composition, `forwardRef`
     where actually warranted, `cva`/`cn()` usage.
   - **Spec content accuracy** — does `behavior.md`/`accessibility.md` still
     describe what the component actually does after this change.
   - **Docs content accuracy** — if a docs page exists, do its examples still
     compile against the real prop names.

4. **Decide**: if the script's `RESULT` is `FIX-FIRST`, don't push yet. If it's
   clear and step 3 raised nothing, you're done — push.

---

## Discipline

- **Read-only.** Never edits files, never stages, never commits, never pushes.
  Fixes are applied by hand or via `/figma-component`/`/legacy-component`.
- **Not a substitute for `--update` on a design-relevant change** — see above.
  Running this gate on a change that actually needed a Figma re-sync will
  report clean while the design and code silently diverge.
- **Covers uncommitted changes.** Unlike `review-ui-react` (which needs an
  open PR) this reads the working tree directly — run it as early as "did I
  just break something," not only right before `git push`.
