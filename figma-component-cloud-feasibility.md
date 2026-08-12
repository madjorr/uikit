# Running `/figma-component` in the cloud — feasibility analysis

Status: **analysis only**, no implementation. Scope: `acronis/uikit`
(public repo: https://github.com/acronis/uikit).

**Decision: Option A (GitHub Actions).** Option B is dropped — see §3.
**Update:** the Figma read is not blocked after all — the
selection-bound restriction only applies to the official hosted
`mcp__figma__*` Dev Mode server (OAuth); the **figma-console Desktop
Bridge is token-based (`FIGMA_ACCESS_TOKEN`) and is not selection-bound**,
so it works headless. See §1/§4.

## 1. The flow today (as-is)

1. A Figma node is created/updated and marked "ready for dev".
2. A dev, locally on their Mac, opens Claude Code in the repo and runs
   `/figma-component <ComponentName> <figma-url>`.
3. The skill (`.claude/skills/figma-component/SKILL.md`) drives:
   - Phase 0: readiness gate (`component-readiness` audit script) + rebuild
     `tokens-pd` if stale.
   - Phase 1: reads the Figma node via MCP (`get_design_context`,
     `get_variable_defs`, `get_context_for_code_connect`).
   - Phase 2: maps Figma variables → existing `--ui-*` tokens in
     `tokens-pd` (hard-stops if a token is missing — no hex fallback).
   - Phase 3: implements the component in `packages/ui-react` (Base UI +
     Tailwind + Code Connect).
   - Phase 4: writes/refreshes the framework-agnostic spec in
     `packages/ui-spec`.
   - Phase 5: test/typecheck/lint/build, **Docker-based** visual-regression
     baseline generation (light + dark), changeset.
   - Phase 6: docs page in `apps/docs` (Fumadocs), build-verified.
4. The dev reviews the diff locally, checks Storybook, then commits/pushes.

Everything happens on the dev's own machine today. Every later phase
(pnpm build/test/lint, Docker-based VR baselines, docs build, PR
creation) is already ordinary CI-shaped work with no blocker identified
(see §4).

**On Phase 1 (the Figma read):** `.claude/skills/figma-component/
SKILL.md` calls out that reads can be rejected with "You currently have
nothing selected" — but this only describes the **official hosted
`mcp__figma__*` Dev Mode server**, which authenticates via per-user
browser OAuth and is selection-bound to whatever's open in the Figma
desktop app. The **figma-console Desktop Bridge is a different, separate
MCP server** (`figma-console-mcp`, configured in `.mcp.json` with a
static `FIGMA_ACCESS_TOKEN`) — it authenticates with a personal access
token, not OAuth, and is **not selection-bound**. It's the same
token-based access pattern `figma-code-connect.yml` and `icons-fetch.yml`
already use headless in CI today. So the desktop bridge itself is not a
blocker; the open question is narrower: does the `figma-component` skill
still get everything it needs (`get_design_context`, `get_variable_defs`,
`get_context_for_code_connect`-equivalent data) through figma-console's
tool surface, or does some of that only exist on the OAuth-gated
`mcp__figma__*` server. See §4.

## 2. Cloud execution options

### Option A — GitHub Actions (`workflow_dispatch`) + Claude Code

- A manually-triggered workflow (`workflow_dispatch`, inputs:
  `componentName`, `figmaUrl`, `update` flag) checks out the repo, sets
  up pnpm/Node, and runs Claude Code headless
  (`claude -p "/figma-component <name> <url>"` or via the Claude Agent
  SDK) with the Figma MCP server configured to the **hosted** Dev Mode
  endpoint (not the desktop bridge).
- On completion, the workflow pushes a branch and opens a PR, then the
  dev is notified the normal GitHub way (PR-opened notification,
  assignee, or a Slack/Teams webhook step at the end of the job).
- The dev's "pull and check locally" step becomes `gh pr checkout <n>` —
  functionally identical to what they do today with a local branch,
  just skipping the parts they currently have to do by hand.
- **Pros:** uses infra the team already has (Actions, `gh`), keeps repo
  history + PR review as the review surface, no new platform to trust.
- **Cons:** needs the skill's Figma reads pointed at the token-based
  figma-console MCP instead of the OAuth-gated hosted server (see §1/§4)
  — a config/verification task, not a hard blocker. Everything else
  (Claude Code auth, PR creation, Docker VR, notifications) is solvable
  with patterns the repo's other workflows already use.

### Option B — Claude Code's own cloud/background execution (rejected)

Claude Code exposes cloud-side constructs relevant here: a **remote
agent isolation mode** ("launches the agent in a remote cloud
environment, always runs in background"), and a **push-notification**
primitive. The idea was to kick off the flow from Claude Code
(CLI/desktop/claude.ai/code) targeting remote/cloud execution instead of
a local agent, with the dev pulling the resulting branch/PR locally on
completion.

**Rejected because it is not covered by our license.** Checked via
`/status` in this session: our Claude Code org (Acronis International
GmbH) authenticates with `API key: /login managed key` — an
**Anthropic Console / API-usage-billed** account, not a Claude
subscription (Pro/Max/Team/Enterprise). Internal onboarding docs
(Confluence pages 285745458, 285758376) confirm this is the standard
provisioning path at Acronis, explicitly instructing `/login` →
"Anthropic Console account · API usage billing" over the subscription
option. Cloud/background execution is a bundled feature of the
**subscription** tiers; on a Console/API-billed account it's just more
metered token spend layered on top of normal usage, not something
"included in the price." That removes Option B's main selling point
(no new infra, reuses what we already pay for) — it would need a
separate commercial decision (e.g. moving to a Team/Enterprise
subscription), which is out of scope here.

## 3. Recommendation — Option A, GitHub Actions

Build Option A (`workflow_dispatch`) as the cloud path: smallest delta
from current tooling, keeps review in PRs (the team's existing review
surface), and the "pull and check locally" step is just
`gh pr checkout`. Option B is parked unless the org later moves to a
Claude subscription plan that bundles cloud execution.

**Draft implementation:** `.github/workflows/figma-component-cloud.yml`.
Untested end to end — it inline-documents its missing secrets
(`FIGMA_ACCESS_TOKEN_ACRONIS`, `ANTHROPIC_API_KEY`) and its unverified
CLI-flag assumptions. Treat a first `workflow_dispatch` run as the way
to settle §5's open questions, not as a working pipeline yet.

## 4. Option A — step-by-step blocker evaluation

Checked against the repo's existing workflows (`ci.yml`,
`figma-code-connect.yml`, `icons-fetch.yml`, `visual-regression.yml`),
which already run comparable steps on GitHub-hosted `ubuntu-latest`
runners today:

1. **Network reachability to Figma — not a blocker.** Unlike the
   Atlassian MCP servers (which Confluence docs say require corporate
   VPN/ZTA), `mcp.figma.com` and the Figma REST API are public internet
   endpoints. GitHub-hosted runners already reach Figma successfully in
   `figma-code-connect.yml` and `icons-fetch.yml`.

2. **Reading the Figma design (`get_design_context` /
   `get_variable_defs`) — not a blocker, needs the right MCP server
   selected.** There are two distinct Figma MCP servers in play, with
   different auth models:
   - **Official hosted `mcp__figma__*` (`mcp.figma.com/mcp`):** per-user
     browser OAuth. This is the one that's selection-bound — it rejects
     reads with "You currently have nothing selected" unless a human has
     the node open and selected in the Figma desktop app. **Not usable
     headless.**
   - **figma-console Desktop Bridge (`figma-console-mcp`, configured in
     `.mcp.json`):** authenticates with a static `FIGMA_ACCESS_TOKEN`
     personal access token, the same credential type
     `figma-code-connect.yml` and `icons-fetch.yml` already use headless
     in CI today. It is **not selection-bound** — no desktop app or
     human required.
   - **Consequence:** Option A doesn't need a skill rewrite to a raw
     REST path. It needs the CI invocation of `/figma-component` to run
     with `figma-console` as the configured Figma MCP server (with
     `FIGMA_ACCESS_TOKEN` as a repo secret) instead of the hosted
     `mcp__figma__*` server. Remaining verification: confirm
     figma-console's tool surface covers everything the skill's Phase 1
     needs (`get_design_context`, `get_variable_defs`, and the
     Code-Connect-property read) — the skill currently calls the
     `mcp__figma__*`-namespaced tools by name, so those call sites may
     need to target figma-console's equivalents instead.

3. **Claude Code auth in the runner — solvable.** Our account is
   Console/API-billed (see §2), so a headless `claude -p "..."` run just
   needs `ANTHROPIC_API_KEY` as a repo secret, same pattern as
   `FIGMA_ACCESS_TOKEN`. Needs an owner for the key and spend
   visibility, but no technical blocker.

4. **Pushing a branch / opening a PR — solvable, pattern exists.**
   `main` is branch-protected (per `icons-fetch.yml`), so the workflow
   can't push directly. `icons-fetch.yml` already solves this with a
   separate PAT (`ACV_TOKEN`) + `peter-evans/create-pull-request`; reuse
   as-is.

5. **Docker/Storybook/VR steps — not blocked.** `visual-regression.yml`
   already runs `docker compose ... up --build` successfully on
   `ubuntu-latest`. No self-hosted runner needed for this part alone.

6. **Forks / secret exposure — solvable, pattern exists.** Existing
   workflows gate on `if: github.repository == 'acronis/uikit'` so
   secrets never reach fork PRs (relevant since this repo is public).
   Same guard needed on the new workflow.

7. **Job duration — watch, not yet blocked.** GitHub-hosted runners
   default to a 360-minute job timeout. A full `/figma-component` run
   (design read + implement + tests + Storybook + VR) is plausibly long
   but likely under that ceiling — untested; time a manual run before
   committing to a runner size.

8. **Completion notification — minor gap, not blocking.** No existing
   Slack/Teams webhook step in these workflows. GitHub's native
   "PR opened" notification covers the baseline ask; a proactive push
   notification would need a new webhook secret + step.

## 5. Open questions to settle before implementing

- Confirm figma-console's tool surface can satisfy everything the
  skill's Phase 1 needs today (`get_design_context`, `get_variable_defs`,
  and the property/variant read used for Code Connect) so the skill's
  `mcp__figma__*` call sites can be pointed at `mcp__figma-console__*`
  for CI runs without losing information.
- Decide whether CI always uses figma-console (token-based, works
  headless) while local/interactive use keeps the option of the hosted
  OAuth server, or whether to standardize the skill on figma-console
  everywhere for consistency.
- Confirm the `FIGMA_ACCESS_TOKEN` already used by
  `figma-code-connect.yml`/`icons-fetch.yml` has read scope over the
  same files/nodes `/figma-component` will need, or whether it needs
  broader scope.
- Owner for the `ANTHROPIC_API_KEY` CI secret and its spend budget,
  given the Console/API-billing model means every headless run is
  metered.
- Whether a GitHub-hosted runner is fast/big enough for the Docker VR
  step at real component-generation scale, or this needs a self-hosted
  runner regardless of which Figma-read path is chosen.
