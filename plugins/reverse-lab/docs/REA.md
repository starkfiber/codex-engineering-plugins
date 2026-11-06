# Optional upstream REA integration

[REA](https://github.com/morluto/rea) is the independently maintained MIT-licensed analysis engine by its upstream contributors. Reverse Lab supplies original evidence/workflow helpers and optional integration; this repository does not contain the REA engine, its dependencies or native providers. It is not a fork claiming authorship of REA.

The workflow skills and case/coverage/compare/replay helpers can be installed without any MCP engine. No engine server is automatically registered by the public Reverse Lab manifest. This avoids machine-specific paths and duplicate servers.

For actual artifact analysis, install and review the upstream package separately using its documentation. The optional bridge here qualifies **rea-agents6.8.0**, which requires Node `^22.23.4 || ^24.22.1 || >=26.12.1`. Do not confuse those engine requirements with the simpler workflow helpers' Node22+ requirement. Native decompilers and providers have separate setup and availability constraints.

Set `REVERSE_LAB_REA_DIRECTORY` to the absolute directory containing that package's package.json and scripts/rea.mjs, then configure a local stdio MCP command using your existing compatible Node executable and `/absolute/repository/plugins/reverse-lab/bridge.mjs`. Configure this environment value in your MCP client or before launching it; the bridge does not guess a package under someone's home directory.

For Codex, after setting the environment as required by your setup:

```sh
codex mcp add rea -- /absolute/compatible/node /absolute/codex-engineering-plugins/plugins/reverse-lab/bridge.mjs
```

Use only one registration for the intended engine. Check your current `codex mcp list --json` and discovered tools first; do not add a duplicate over an existing working REA plugin. The server may expose tools that execute code or affect targets: unlike Apple Blueprint's read-only helpers, REA is not described here as read-only. Discover current schemas and match the user's authorization to the exact operation.

The community suite tests helpers using synthetic local fixtures. A separate maintainer probe initializes the real selected engine, lists tools and verifies the owned child exits; this does not prove every native provider or full artifact analysis. Never claim engine coverage from a replay plan or schema fixture.
