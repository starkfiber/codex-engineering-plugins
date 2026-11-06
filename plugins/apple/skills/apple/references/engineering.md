# Swift engineering

Inspect Package.swift / project.pbxproj, entitlements, target membership and build configuration. Keep minimum versions and Swift isolation settings explicit. Validate SDK-sensitive APIs against https://developer.apple.com/documentation/ and the active toolchain.

Use small domain types, service boundaries where substitution is useful, and platform adapters. Share data and business behavior through Swift packages; keep platform scenes and capability handling in their targets. Avoid a universal screen with scattered platform conditionals.

Choose ownership deliberately: transient local state in the view, shared observable UI state with explicit main-actor isolation, isolated mutable services with actors when appropriate. Do not treat Observation as a persistence or synchronization system. Cancel work when its owner ends; avoid detached tasks capturing view state. Make Sendable boundaries explicit and build with the project's concurrency settings.

For downloads use streamed file transfers / URLSessionDownloadTask, delegate progress, expected length when known, error visibility, cancellation and bounded retries. Do not buffer multi-gigabyte firmware in Data. Resume only when server range semantics and validators match; handle a 200 response to Range without appending duplicate content. Persist resumable jobs and use atomic finalization after validation. ETA is unknown until size and meaningful speed are known; a growing file is not proof of completion.

Use SwiftData/Core Data according to existing stack and target availability. Test migrations and interruption recovery on a disposable store. Keep secrets in Keychain; inject configuration without committing credentials. Model permission-denied, offline, empty and recoverable failure states where they affect the task.

For defects reproduce the exact target/build, inspect the smallest relevant evidence, fix the cause and repeat the failing interaction. For a Mac utility, compile, bundle, launch and inspect the status item and popover; process existence alone is insufficient. Never claim support for every app's downloads from a Downloads folder scan: browsers, direct HTTP jobs, background sessions and network flows require distinct integrations. Encrypted network traffic does not reliably reveal destination filenames or total size.
