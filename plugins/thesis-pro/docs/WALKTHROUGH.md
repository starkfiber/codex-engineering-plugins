# Install → study → audit → export

Version 0.2.0 qualifies a local academic notebook workflow. It does not qualify a completed thesis, independent source review, institutional approval or a model's research quality.

## 1. Install one provider

Use the repository installation instructions, then install thesis-pro@engineering-plugins. If an older personal copy already supplies the same skill/server names, deliberately update that copy or choose one provider; do not enable two writing servers against the same workspace. Python 3.10+ is the server dependency. The optional demonstration client also requires Node 22+ and a POSIX shell.

Keep real research and private academic instructions separate from public examples. Upgrading plugin code does not require opening, importing or migrating research projects. The default workspace remains ~/Documents/ThesisPRO; THESIS_PRO_HOME selects an explicit alternate workspace per server process. Existing chapter budgets are preserved on read; legacy budget mismatches are reported, not silently rewritten.

## 2. Run a disposable real-server demonstration

From the repository root:

```sh
node plugins/thesis-pro/scripts/study-flow.mjs
```

The client creates a fresh temporary workspace, starts the actual packaged MCP launcher, discovers all 12 tools, and sends real requests. It never uses the default research directory. For a retained demonstration, use --workspace with a new/empty directory. Nonempty directories and symlink workspaces are refused. --plugin-root selects a separately installed package for the same check.

The default source-verification note explicitly marks a synthetic assertion. To record your own actual check, pass --source-check-note with what you checked and its limitations. That note is not independent verification by the server. The maintainer run inspected the official [WCAG2.2 recommendation and Keyboard criterion](https://www.w3.org/TR/2024/REC-WCAG22-20241212/#keyboard); the sample is a proposal with no participants or empirical findings.

## 3. Observe failures before fixing them

create_project and get_dashboard establish the provisional study and main-text budget. audit_project initially reports missing research foundations and literature. update_research_design records provisional problem/gap/aim/objectives/questions/method/contribution.

add_source records an unverified citation. add_claim initially records an unsupported external claim. A second audit reports both problems. update_source records the later check and retains previous values; update_claim attaches the existing claim to its source. Changing a source citation/URL invalidates the old verification flag unless explicitly reverified. Unknown source IDs are rejected.

## 4. Draft and export

save_section writes proposal prose, planned methodology and a reference. get_section reads the exact saved text. Chapter 6 references/appendices are counted separately; they do not satisfy the main-text target. New project budgets allocate the target across the five main chapters. Counts use the documented regex, not an institution's word-processor rules.

The final sample audit passes only its structural/recorded-flag scope. word_budget_met remains false. This is expected: a short proposal is not a completed5,000 word study. export_markdown writes the drafted sections and recorded source ledger. It does not invent findings, populate empty chapters or format an automatically verified bibliography.

## 5. Restart and reopen

The client closes the server, starts another process with the same disposable workspace, rediscovers the project and reads back the same prose/counts. A second export must match the first byte for byte. An attempted parent-directory export must fail. The result records the export hash and transcript in the demonstration directory.

The maintainer source run produced124 main-text words and29 reference words. Source IDs/project IDs vary per run. [Worked proposal](../examples/worked-proposal.md) is the actual synthetic exported text. Ten Python regression tests additionally cover interrupted saves, path/symlink/identity rejection, source/claim corrections, counts and legacy reads without modification. CI runs these and the real-server flow on Linux/macOS.

This is a protocol-client and persistence qualification. It does not prove every Codex desktop/model interaction, screen-reader behavior, scholarship assertion or multi-process edit scenario. Refresh the host after installing an updated plugin; do not infer that an already running server changed versions.
