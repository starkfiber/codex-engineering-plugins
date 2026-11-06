# Reverse Lab · 3.3.2

Original evidence discipline and executable helpers for investigations that can be resumed and checked. Invoke `$reverse-lab` after installing from this repository's marketplace. Ordinary source navigation does not need reverse-engineering tools.

Use it to identify an artifact/version, form testable explanations, keep observations separate from inference, retain failed attempts and require reconstruction/runtime proof appropriate to the claim. Optional engineering councils are available when the user requests delegation; the skill does not spawn agents merely because it exists.

| Helper | Purpose | Boundary |
| --- | --- | --- |
| case.mjs | Create a project-local case; fingerprint and verify evidence files | Hash agreement is not truth or complete coverage |
| coverage.mjs | Assess supported REA evidence schemas at application/semantic/runtime gates | Static evidence cannot pass a runtime gate; unsupported schemas fail |
| compare.mjs | Invalidate claims whose declared artifact dependencies changed | Unchanged dependencies are not proof of correctness |
| jobs.mjs | Run explicit local commands with retained state and owned-child cleanup | This executes processes; authorization and reviewed code are required |
| replay.mjs | Run a reviewed hash-pinned pack and recheck artifact identity | No automatic redispatch or arbitrary-shell field |
| multiboot-lab | File-backed image/catalog planning helpers and scoped boot lessons | No physical device writer or universal boot guarantee |

All paths above are under skills/reverse-lab/scripts, except the multiboot helpers under skills/multiboot-lab/scripts. Use an existing Node22+ for helpers.

```sh
node skills/reverse-lab/scripts/case.mjs init /absolute/project/.reverse-lab/case 'Explain this feature'
node skills/reverse-lab/scripts/case.mjs record /absolute/project/.reverse-lab/case /absolute/evidence.json 'Scoped observation'
node skills/reverse-lab/scripts/case.mjs verify /absolute/project/.reverse-lab/case
```

The optional [upstream REA integration](docs/REA.md) is deliberately separate. This public plugin does not auto-copy an engine or migrate unrelated Codex configuration. REA itself is already published at morluto/rea; its contributors retain authorship and license. No native provider, APK, firmware, private investigation, credential or personal absolute path is bundled.

Community tests use owned synthetic fixtures. Prior real-application and macOS installer findings are historical, not implied to be reproduced by this public package. POSIX process-group behavior is tested on supported hosts; Windows replay cleanup is not qualified. Read the relevant skill references before executing a pack or interpreting a gate.

Original code and documentation are MIT licensed. See the repository README, CONTRIBUTING.md, SECURITY.md and THIRD_PARTY_NOTICES.md.
