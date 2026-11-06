# Shared SwiftUI blueprint

Inspect deployment targets and language isolation first. Preserve architecture that already works. A shared package should own domain models/services; platform app targets own scenes, capabilities, input and presentation.

| Concern | Implementation decision | Acceptance evidence |
| --- | --- | --- |
| State | View-local values in State; observable shared UI models isolated to MainActor; actors for isolated services | Ownership survives expected scene transitions; no stale task updates |
| Navigation | Typed routes and explicit selection; use appropriate stack/split/tab presentation | Back, deep link, restoration and collapse preserve context |
| Layout | Container-driven adaptation, semantic text styles, wrapping content | Long text, largest supported text sizes, compact and wide widths |
| Persistence | Existing SwiftData/Core Data stack, deliberate save/error policy and migrations | Disposable-store migration and recovery tests |
| Networking | Cancellation, status validation, bounded retry and stable identities | Offline, timeout, duplicate request and interrupted transfer fixtures |
| Concurrency | Explicit ownership, Sendable boundaries and task lifecycle | Compile in project concurrency mode; reproduce cancellation/race defects |
| Appearance | Semantic colors and project tokens with availability gates | Supported appearances and increased contrast checked |
| Accessibility | Semantic controls, meaningful labels, focus and non-color state cues | Actual VoiceOver/keyboard interaction where relevant |

Do not use a detached task merely to make asynchronous work run. Do not buffer large downloads into Data. Model unknown progress explicitly; bytes written do not establish total size or completion. Refresh metadata without erasing user input or resetting navigation. Use preview fixtures outside production services.

SwiftUI availability is per platform and SDK. Validate newly introduced APIs against the installed SDK and current Apple docs. Do not automatically migrate all targets to the latest OS to accommodate an API.
