# V3 qualification — 2026-11-06

**Stable ready: false. Full contract retained.** Alpha.4 repairs the Swift Testing blocker and improves native accessibility semantics; it does not rename incomplete acceptance as V3 stable.

## Verified on the maintainer Mac

Apple M5, Swift6.3.3, selected Command Line Tools and macOS SDK26.5. No full Xcode or other platform SDKs were available for this run.

- Two actual Swift Testing tests pass using `scripts/test-swift.mjs`. Both framework lookup and the Testing interop runtime path are necessary; a framework-only attempt compiled then failed to load the runtime.
- Synthetic sample builds; BehaviorCheck passes61checks. These are behavioral assertions, not61UI scenarios.
- An isolated native app was launched from the rebuilt sample. Receipt routing retains unknown/unverified execution, keyboard search reaches empty results and recovers, sidebar arrows change selection, and labelled settings open from the keyboard.
- Light and Dark views were visually inspected. App Reduce Motion disables the decorative motion control. This does not establish system Reduce Motion precedence or a complete accessibility/performance matrix.
- AX inspection exposed missing semantic headings. The corrected build exposes overview/detail headings and combined label/value fields. AX structure is not proof of screen-reader announcements.
- VoiceOver first-run Quickstart launched, but persistent screen-reader feedback was not obtained. VoiceOver was returned to its original off state. The VoiceOver gate remains open.

The local test recorder initially asserted against a diff that omitted an unchanged setting. A complete-state recheck confirmed Dark and app Reduce Motion. The failed recorder assertion is retained in local evidence rather than treated as a product failure or silently erased.

## Remaining release gates

| Required gate | Current state | Required next proof |
| --- | --- | --- |
| Platform interactions | Partial: bounded macOS only | Build, launch and interact on macOS, iOS, iPadOS, watchOS, tvOS and visionOS; retain target/SDK/source identity |
| Runtime adapter | Open | Real authorized runtime connection and receipt/error/restart behavior; synthetic fixtures do not qualify |
| Clean host/plugin | Partial: public CI and relocation helpers | Independent clean-host installation and complete workflow from current release |
| Independent evaluation | Open | Separate reviewer, held-out tasks and predefined thresholds |
| Accessibility/performance | Partial | Real VoiceOver, keyboard/focus matrix, text/layout adaptation, system Reduce Motion and recorded performance thresholds |
| Recovery integration | Open | Real cancellation, interruptions, persistence/migration/corruption and reconnection outcomes |
| Distribution/upgrade/rollback | Partial | Reproducible packaging plus actual upgrade and rollback; signing/distribution results where authorized credentials exist |

No fixture acceptance, manifest hash, successful compile or MCP tools/list result substitutes for these gates. The release-gate code continues requiring all seven workflow gates and all six platform build records with source-bound evidence. Full Xcode/SDK installation or an explicitly authorized Xcode test host is the next environment prerequisite; SDK installation alone will not close the runtime/reviewer gates.

See [the unchanged V3 exit contract](V3-EXIT-CONTRACT.md). Local raw test material is excluded from distribution; community contributors should submit reproducible source-bound checks without personal data.
