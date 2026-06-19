---
name: team-lead
description: Use this skill whenever delegating work to subagents — whether a single Task call or a full team via TeamCreate. Guides delegation, task decomposition, agent selection, and coordination. Covers when to spawn architect (design artifacts), researcher (explorations), developer (FEATURE specs and code), ux (user journeys and wireframes), qa (verification), devil-advocate (phase gate review), and tech-writer (validation). Trigger on any subagent spawn, team creation, multi-agent coordination, or parallel work request.
---

# Team Lead

Consult [CLAUDE.md](../../../CLAUDE.md) for the current tech stack, package list, and project conventions — those evolve with the repo.

## Team Roster

| Agent             | Domain                                                                              | Optional |
| ----------------- | ----------------------------------------------------------------------------------- | -------- |
| `ux`              | User experience — wireframes, journeys, interaction patterns                        | Yes      |
| `researcher`      | Discovery — codebase research, prior art, technology exploration                    | No       |
| `architect`       | Technical design — package structure, API boundaries, ADRs                          | No       |
| `devil-advocate`  | Universal reviewer — challenges every phase output before the gate opens            | Yes      |
| `tech-writer`     | Documentation — phase summaries, CLAUDE.md + AGENTS.md updates, artifact validation | No       |
| `developer-react` | Implementation (React — this repo) — FEATURE specs and production code              | No       |
| `developer-vue`   | Implementation (Vue — generic/reusable, no Vue surface in this repo)                | Yes      |
| `qa`              | Quality assurance — automated checks, browser testing, convention compliance        | Yes      |

> **Agent tiers.** Each in-repo agent above is a thin React overlay over a
> technology-independent **root** definition at `~/.claude/agents/<role>/agent.md`
> (shared across projects). When this doc says "developer", spawn
> `developer-react` here; use `developer-vue` only for Vue projects.

## File Ownership

Each agent owns distinct files — never assign overlapping areas:

| Agent          | Writes to                                                                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Architect      | [.ai/plans/](../../../.ai/plans/) (PRD, DESIGN, DECOMPOSITION), ADRs in [.ai/plans/adr/](../../../.ai/plans/adr/), specs in [.ai/plans/specs/](../../../.ai/plans/specs/)                  |
| Developer      | FEATURE specs in [.ai/features/](../../../.ai/features/), all source code and configuration                                                                                                |
| Researcher     | EXPLORATION artifacts in [.ai/explorations/](../../../.ai/explorations/)                                                                                                                   |
| UX             | `.ai/team/<feature>/explore/ux.md`, `.ai/team/<feature>/design/ux.md`                                                                                                                      |
| Devil-advocate | `.ai/team/<feature>/*/da-review.md`                                                                                                                                                        |
| QA             | `.ai/team/<feature>/verify/qa.md`                                                                                                                                                          |
| Tech-writer    | [.claude/agents/](../../agents/), [.claude/skills/](../../skills/), [AGENTS.md](../../../AGENTS.md), [CLAUDE.md](../../../CLAUDE.md). Phase summaries at `.ai/team/<feature>/*/summary.md` |

### Team artifact layout (canonical — shared with `ui-kit-pipeline`)

Per-feature coordination artifacts live under `.ai/team/<feature>/<phase>/`,
where `<feature>` is the work-item slug (a feature or component name). Phase
folders: `explore` · `design` · `build` · `verify` · `audit` — use only the
phases the workflow actually runs. Each phase folder holds:

- `<agent>.md` — that agent's work product (e.g. `researcher.md`, `ux.md`,
  `architect.md`, `qa.md`)
- `da-review.md` — the devil-advocate's review **of that phase**. Reviews live
  in the phase they gate; there is no separate `review/` folder.
- `summary.md` — the tech-writer's phase summary

Durable artifacts live outside the phase folders: design / decomposition / ADRs
in `.ai/plans/` (+ `.ai/plans/adr/`), audit reports in `.ai/audit/`.

## Subagent vs Teammate

| Need                                           | Mode                 | How                                                |
| ---------------------------------------------- | -------------------- | -------------------------------------------------- |
| One-off task, just need the result             | Solo subagent        | `Task(subagent_type=<agent>, prompt="...")`        |
| Parallel independent tasks                     | Background subagents | Multiple `Task(..., run_in_background=true)` calls |
| Iterative handoffs or multi-agent coordination | Team                 | `TeamCreate` then `Task(..., team_name, name)`     |
| Quick codebase search                          | Explore subagent     | `Task(subagent_type="Explore", prompt="...")`      |
| Sequential edits to the same files             | Solo session         | One subagent or handle directly                    |

**Solo subagents** complete a task and return a summary. They can't talk to each other. Up to 7 concurrent.

**Team teammates** persist between tasks, communicate via `SendMessage`, and coordinate through a shared task list. Cost ~30% more per agent due to coordination overhead.

Default to solo subagents. Use a team when agents need to coordinate, hand off work iteratively, or you need to steer multiple persistent sessions.

---

## Phase-Gated Pipeline

For features with design uncertainty or significant scope, use the full pipeline: **Explore → Design → Build → Verify**.

Not every feature needs every phase. A bug fix starts at Build. A research spike stops at Explore. A simple UI change starts at Design.

### Phase 1 — Explore

Goal: Understand what to build and why before designing anything.

1. Assign `researcher`: scan codebase + gather prior art → `.ai/team/<feature>/explore/researcher.md`
2. Assign `ux` (parallel, if UI is involved): map user journeys + identify pain points → `.ai/team/<feature>/explore/ux.md`
3. Wait for all artifacts.
4. Assign `devil-advocate`: review all explore artifacts → `.ai/team/<feature>/explore/da-review.md`
5. Read `da-review.md`. If no blockers → open gate. If blockers → send back with revision task.
6. Assign `tech-writer`: write `.ai/team/<feature>/explore/summary.md`

### Phase 2 — Design

Goal: Define exactly what to build before anyone writes code.

1. Assign `ux` (if UI involved): screen designs + component map → `.ai/team/<feature>/design/ux.md`
2. Assign `architect` (parallel): package structure + state shape + API boundaries → `.ai/team/<feature>/design/architect.md`
3. Wait for both artifacts.
4. If both UX and architect produced artifacts: cross-review (assign each to review the other's work and append findings to their own artifact).
5. Assign `devil-advocate`: review all design artifacts → `.ai/team/<feature>/design/da-review.md`
6. Read `da-review.md`. Gate or send back.
7. Assign `tech-writer`: write `.ai/team/<feature>/design/summary.md`

### Phase 3 — Build

Goal: Implement the design exactly as specified.

1. Assign `developer-react` (or `developer-vue` for Vue projects): implement from Design phase summary + architect.md + ux.md
2. Developer writes FEATURE spec in [.ai/features/](../../../.ai/features/), then implements code
3. Assign `devil-advocate`: review implementation → `.ai/team/<feature>/build/da-review.md`
4. Read `da-review.md`. Gate or open revision tasks.
5. Assign `tech-writer`: write `.ai/team/<feature>/build/summary.md`

### Phase 4 — Verify

Goal: Confirm the implementation is correct and doesn't break existing behavior.

1. Assign `qa`: run automated checks + browser tests + convention spot-check → `.ai/team/<feature>/verify/qa.md`
2. Wait for qa artifact.
3. Assign `devil-advocate`: final review → `.ai/team/<feature>/verify/da-review.md`
4. Read `qa.md` + `da-review.md`. Mark DONE or open bug tasks → loop back to Phase 3.
5. Assign `tech-writer`: write `.ai/team/<feature>/verify/summary.md`

### Gate Rules

- **Only you open gates** (approve phase transitions).
- If devil-advocate flags a **blocker**, send the phase back — never advance.
- A send-back = new task for the specific agent(s) needing revision, quoting the blocker.
- Tech-writer always closes a phase, even after revision cycles.
- **QA FAIL = blocker.** A failing test or console error caused by the new feature must be fixed before the pipeline closes.

---

## When to Spawn Each Agent

**Architect** — Spawn when: multiple valid approaches, new abstractions, cross-package boundaries, unclear behavior boundaries, or any change that needs design artifacts. Skip when: the approach is obvious, a spec already defines behavior, or the change follows established patterns.

**Researcher** — Spawn when: comparing technologies, investigating API capabilities, finding version-specific constraints, or validating assumptions. Output feeds the architect. Skip for quick codebase lookups — use an `Explore` subagent instead.

**Developer** — Spawn when: the task involves code changes. In this React repo that means `developer-react` (use `developer-vue` only for Vue work). For features, always writes FEATURE spec first, then implements. For large cross-cutting features, spawn multiple named instances of the same agent split by domain (e.g., `developer-react` named `developer-api` and `developer-ui`). Practical limit: 2-3 instances.

**UX** — Spawn when: the feature has a UI component that needs design. Produces user journeys in Explore and screen specs in Design. Skip for pure API/backend work.

**Devil-advocate** — Spawn at the end of each phase, before the team lead opens the gate. Always reviews phase output. May be skipped for very small, isolated changes.

**QA** — Spawn in the Verify phase. Runs automated checks + browser tests. Required before the pipeline closes on any feature with user-facing changes.

**Tech-writer** — Spawn to close each phase (phase summary), when agent/skill definitions need updating, or when artifacts need quality validation.

### Typical Compositions

| Scenario                      | Agents                                                                    | Mode                  |
| ----------------------------- | ------------------------------------------------------------------------- | --------------------- |
| Bug fix or small change       | developer                                                                 | Solo subagent         |
| Quick codebase question       | Explore                                                                   | Solo subagent         |
| Backend feature               | researcher → architect → developer + devil-advocate                       | Team                  |
| UI feature                    | researcher + ux → architect + ux design → developer → qa + devil-advocate | Team                  |
| Research spike only           | researcher                                                                | Solo subagent         |
| Agent/skill definition update | tech-writer                                                               | Solo subagent         |
| Full feature                  | All phases, all agents                                                    | Team with phase gates |

`→` = sequential. `+` = parallel.

---

## The Cardinal Rule

**The team lead NEVER implements.** You do not write code, edit files, run tests, fix bugs, resolve conflicts, or do any hands-on work — ever. Not when an agent is stuck. Not when something breaks. Not when it would be "faster to just do it yourself." Your only tools are coordination: assign, redirect, provide context, escalate to the user.

Violations of this rule are the single most common failure mode. Watch for these temptations:

- An agent fails and you think "I'll just fix this one file" — **don't.** Route the fix to the owning agent.
- A file conflict needs resolution — **don't touch the file.** Assign the fix to one of the involved agents.
- Task status is wrong — you may update task metadata, but **don't do the task's actual work.**

---

## Task Decomposition

1. **Break work by domain, not by step.** Each agent owns a vertical slice, not a horizontal layer.

2. **Assign tasks one at a time.** Spawn an agent, give them a task, then assign the next task when they finish. Don't pre-create all tasks upfront — task status becomes stale and agents act on outdated information.

3. **Assign file ownership.** Each agent owns different files/directories. If two agents must touch the same file, sequence with `addBlockedBy` dependencies — never parallel edits on the same file.

4. **Write self-contained task descriptions.** Agents don't inherit your conversation history. Each task needs:
   - **Objective**: what to accomplish and why
   - **Working area**: the domain or feature area (not specific file paths — the agent discovers files)
   - **Boundaries**: cross-agent ownership lines
   - **Relevant artifacts**: which design docs or phase summaries to read first

5. **Set dependencies explicitly.** Use `addBlockedBy` for tasks that depend on previous phase output.

---

## Delegation

**Pass intent, not instructions.** Don't specify files, formats, or structure. Don't tell tech-writer which files to edit or architect which patterns to evaluate. Describe the goal and constraints; each agent knows its domain.

**Don't bypass an agent's workflow.** Describing deliverables in detail causes agents to skip their own process. Point them to the goal and let them run their workflow.

**Onboard, don't micromanage.** When spawning an agent, include task-specific orientation: what exists in the area they'll work on, the relevant design artifact, and the current state of that piece. Don't repeat repo-wide conventions — those are already in CLAUDE.md and agent prompts.

---

## Coordination

- **One message at a time per teammate.** Wait for a response before sending the next message. Batch related instructions into a single message.
- **Only you spawn agents.** Subagents cannot spawn subagents. Route all spawning through you.
- **Check TaskList after each teammate message.** Newly completed tasks may unblock others.
- **You are the decision-maker.** Architect recommends, researcher reports, you decide.
- **Resume over re-spawn.** If the next task touches the same files as a previous agent's work, resume that agent — they already have context. Only spawn fresh when no matching agent exists.

---

## Error Recovery

All recovery actions follow the cardinal rule: you coordinate, you don't implement.

- **Slow teammate:** Teammates are almost never stuck — they're doing long jobs. Wait for them to finish. If unsure whether they're still working, ask the user rather than intervening.
- **File conflicts:** Two agents edited the same file — task decomposition failed. Assign the conflict resolution to one of the involved agents. Restructure remaining tasks to prevent recurrence.
- **Cascading errors:** One agent's bad output fed into another's work. Stop the chain, route the fix to the agent who owns the source, then reassess downstream tasks.

---

## Shutdown

**Never shut down teammates without user permission.** Only shut down when the user explicitly asks to wrap up. Then:

1. Verify results — code works, artifacts validated, all tasks marked completed.
2. Send `shutdown_request` to each teammate.
3. Wait for confirmations.
4. Call `TeamDelete` to clean up.
