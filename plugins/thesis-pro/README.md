# Thesis Pro · 0.2.0

A local academic project notebook for Codex: research foundations, chapter budgets, drafts, source/claim links, structural audits and Markdown export. The host model supplies reasoning and writing. The plugin does not contain a model, verify scholarship automatically, perform statistical analysis or guarantee academic acceptance.

## Install and use

```sh
codex plugin marketplace add /absolute/codex-engineering-plugins --json
codex plugin add thesis-pro@engineering-plugins --json
```

Refresh the chat and ask: “Use $thesis-pro to plan a study of library accessibility. Keep it a proposal until real data and checked literature are available.” A [synthetic example](examples/synthetic-study.md) supplies a safe starting point.

Python 3.10+ and its standard library are sufficient. The portable launcher uses python3; set THESIS_PRO_PYTHON to select another compatible interpreter. No cloud API key or dependency download is required by the server.

Standalone MCP clients can run `python3 /absolute/plugin/scripts/thesis_pro_mcp.py` using stdio. Set THESIS_PRO_HOME to an explicit workspace if desired; the default is ~/Documents/ThesisPRO. Twelve tools cover create/list/dashboard, research design, section read/write, sources/claims and their corrections, audit and export. Discover exact schemas with tools/list. These tools write local project data; they are not read-only.

## Data and verification

Only projects in the configured workspace are addressed. Exports accept plain filenames; project and export symlink escapes are rejected. Project saves use atomic replacement. Back up important work; atomic writes do not supply version history, multi-process edit conflict resolution or a filesystem sandbox. Run only one writing server per workspace. Corrupt individual projects are skipped by listing and fail when opened; they are not silently repaired.

The audit checks recorded structure, source verification flags and unsupported claims. A source marked verified is a user/agent assertion, not an external verification service. The notebook can contain sensitive research: the connected AI host may receive retrieved text under its own settings. Keep credentials and participant data out of public issues/examples.

```sh
python3 -m unittest discover -s plugins/thesis-pro/tests -v
```

Run that command from the repository root. Ten synthetic tests cover persistence/budgets/export, traversal/symlink/identity rejection, interrupted-save preservation, evidence audit, argument types and actual stdio startup. Tests use temporary workspaces, never the user's real thesis library. Original code/instructions are MIT licensed. The local notebook workflow is qualified as described in [the walkthrough](docs/WALKTHROUGH.md); independent institutional and accessibility review remain outside this package's test scope.

The [worked example](examples/worked-proposal.md) is an actual synthetic export. Run the repeatable real-server flow with `node plugins/thesis-pro/scripts/study-flow.mjs` from repository root; it creates a disposable workspace and verifies audit correction, export and restart persistence without accessing real research.
