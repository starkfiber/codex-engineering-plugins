# Public-alpha scope

2.0.0-alpha.4 packages the reviewed Apple workflow, three read-only local MCP helpers, selected MIT specialists, tests and a synthetic Swift example. Prior private review logs, raw upstream checkouts, machine paths and release-evidence records are excluded. Source-bound historical acceptance does not transfer automatically to this public copy.

Routing, local inspection, SHA-256, firmware archive preflight, evidence/release gates and relocation are covered by the community Node suite. Runtime, accessibility, signing, App Review and physical-device checks remain separate. A macOS compile/test is a compiler/test outcome, not a visual acceptance result; other platform builds require their SDKs. Stable V3 acceptance remains unestablished.

Vendor sources:

- [tn/ios-interface-design](https://github.com/tn/ios-interface-design), pinned revision in registry: focused iPhone/iPad craft guidance, MIT.
- [eworthing/agent-skills](https://github.com/eworthing/agent-skills), pinned revision in registry: selected tvOS focus and design-token guidance, MIT.

Their specialist directories and LICENSE files are retained intact. They are loaded only when relevant; external instructions do not override user scope or authorize installation/execution. Apple framework availability must be checked against current Apple documentation and the selected SDK.

Alpha.4 adds a tested Swift Testing launcher and native sample heading semantics. Bounded macOS UI checks are documented in [V3 qualification](V3-QUALIFICATION.md); the [full contract](V3-EXIT-CONTRACT.md) is retained. Real VoiceOver and the complete six-platform/runtime acceptance remain open.
