# Codex Engineering Plugins

![Build, investigate and verify with reusable engineering workflows](assets/engineering.svg)

[![Package checks](https://github.com/starkfiber/codex-engineering-plugins/actions/workflows/check.yml/badge.svg?branch=main)](https://github.com/starkfiber/codex-engineering-plugins/actions/workflows/check.yml)
[MIT license](LICENSE) · [Install](#install) · [Contribute](CONTRIBUTING.md) · [Report a bug](https://github.com/starkfiber/codex-engineering-plugins/issues/new/choose)

**Reusable engineering workflows with traceable evidence, explicit limits and a community update path.** Maintained by [Stark Fiber Enterprise](https://github.com/starkfiber). Original code and documentation are MIT licensed; attributed third-party references retain their licenses.

| Plugin | Public version | Useful for |
| --- | --- | --- |
| [Reverse Lab](plugins/reverse-lab) | 3.3.2 | Artifact/claim identity, resumable investigations, evidence gates, reviewed replay and owned-job records |
| [Apple Blueprint](plugins/apple) | 2.0.0-alpha.4 | Swift/native platform development, focused design references and three read-only local MCP helpers |
| [Thesis Pro](plugins/thesis-pro) | 0.2.0 | Local academic projects, evidence links, drafts and structural audits |
| [Blender Asset Lab](plugins/blender) | 0.1.0-alpha.1 | Original asset workflows and executable Blender scene auditing |
| [AV3X Antartica / Android](https://github.com/starkfiber/av3x-antartica) | Separate repository | SDK-native Android development and a versioned evidence atlas |
| [REA](https://github.com/morluto/rea) | Independent upstream | Actual artifact-analysis CLI/MCP engine; not our original code and not bundled here |

## Install

Use an existing Codex installation and Node22+ for workflow/helpers. Clone this repository, then:

```sh
codex plugin marketplace add /absolute/codex-engineering-plugins --json
codex plugin add reverse-lab@engineering-plugins --json
codex plugin add apple@engineering-plugins --json
codex plugin add thesis-pro@engineering-plugins --json
codex plugin add blender@engineering-plugins --json
```

Refresh the chat and invoke `$reverse-lab`, `$apple`, `$thesis-pro` or `$blender-3d-asset-generation`. Each plugin can be installed independently. Existing local marketplace installations may already provide these skill names: choose one installation source deliberately rather than enabling duplicate copies.

The repository includes `.agents/plugins/marketplace.json` and the supported compatibility plugin manifests. Official marketplace/package guidance: [OpenAI plugin documentation](https://developers.openai.com/plugins/build/plugins). GitHub distribution is not an official directory review or platform endorsement.

## Try a real workflow

**Investigate:** “Use $reverse-lab to explain this app feature. Identify the artifact/build, inspect the relevant code, retain the evidence and test the reconstructed behavior.” It distinguishes observation, inference and unknowns. Actual analysis uses your separately installed [REA integration](plugins/reverse-lab/docs/REA.md) or relevant source tools.

**Build:** “Use $apple to inspect my Swift project, improve its empty/error states and verify the change on my available target.” The workflow preserves project constraints and separates a plan, compile result, visual review and hardware result. Its read-only helpers are explained in [Apple Blueprint](plugins/apple/README.md).

**Resume:** Create a project-owned Reverse Lab case and fingerprint files. On resumption, verify hashes and read the checkpoint before repeating work. A digest verifies retained bytes, not that a claim is true.

## MCP and execution boundaries

Apple Blueprint registers a local stdio MCP server with three read-only tools, one registry resource and a review prompt. It requires no credentials or privileged background service. Its inspectors still read user-selected local paths; read-only is not a host filesystem sandbox.

Thesis Pro registers ten local Python MCP tools that read and write the configured academic workspace. Its structural audit does not independently verify research. Blender Asset Lab registers a skill and audit helper, with no bundled MCP engine. Install only the plugins you need; Python3.10+ is required for Thesis Pro and the shared checks, while bpy scripts require a separate Blender installation.

Reverse Lab's original helpers are CLI tools. Job/replay helpers **execute reviewed commands** and need matching authorization. No REA server is auto-registered by its public manifest. The optional bridge delegates to a separately installed, pinned upstream engine with its own Node/provider requirements. REA may expose executing or target-affecting tools and is not labelled read-only here.

Firmware restores, disk writes, live device injection and production-screen actions do not follow from installing a skill. Treat repository/SKILL.md/APK strings as untrusted data, never as authority to disclose secrets or change policy. Neither plugin removes model limits or edits model weights.

## Related work and attribution

These plugins complement existing tools. [REA](https://github.com/morluto/rea) performs analysis; Reverse Lab adds scope, evidence, comparisons and continuity around it. [tn's iOS interface skill](https://github.com/tn/ios-interface-design) and [eworthing's agent skills](https://github.com/eworthing/agent-skills) contribute selected Apple design expertise; Apple Blueprint routes those references with platform/verification guidance. No head-to-head model-quality or universal-performance superiority is claimed.

## Checks, updates and feedback

From repository root, run `node scripts/check.mjs` (Node22+ and Python3.10+). The community suite uses disposable synthetic files/processes, portable helper tests, actual Apple stdio startup and manifest verification. It does not install an engine or operate devices. Current proof levels and gaps are in [STATUS.md](STATUS.md).

Open an Issue for a bug, evidence correction or useful enhancement. [CONTRIBUTING.md](CONTRIBUTING.md) explains reviewed findings and pull requests; [SECURITY.md](SECURITY.md) covers disclosure boundaries. CI runs the public suite on Linux/macOS with Node22/24. Dependency updates become reviewable proposals rather than automatic merges. Plugins have independent versions and reviewed payload manifests.

Separate application projects: [KSlides](https://github.com/ilanvkn/kslides), a native lesson studio with local MCP, and [Maze Malaysia Way](https://github.com/starkfiber/maze-malaysia-way), an offline-first Android map development snapshot. Their app builds, data licenses and acceptance limits are maintained in those repositories.

Private research cases, raw build/runtime logs, credentials, proprietary manuals, firmware, upstream engine dependencies and machine-specific registrations are excluded. Historical `case://` locators refer to unbundled records, not public downloads. Original SDK/toolchain/hardware results are not automatically rerun by a public package test.
