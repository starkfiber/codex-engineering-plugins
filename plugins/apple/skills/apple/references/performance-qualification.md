# Performance qualification and device release

Reviewed 2026-11-13. This procedure supplements rendering-performance.md; it does not certify flawless performance.

## Release a borrowed phone first
When the owner needs the device, stop capture, profiler and owned WDA/USB forwarding processes. Verify those exact processes exited. Never kill unrelated developer sessions or uninstall the trusted helper without a request. Stop reconnect loops. Keep device-required acceptance pending; continue source review, documentation and host-only tests. No unattended restart while the owner is using the phone.

## Preview pipeline: bounded work at every boundary
Apple TN2445 documents dropping late frames at the capture-output boundary. That does not bound a separate queue created by your own callback. If every frame creates a main-queue task, an overloaded UI can still show old frames long after capture.

Use a latest-frame mailbox: replace the pending frame, schedule at most one UI drain, release replaced buffers promptly, and discard stale work on pause/disconnect using a generation token. Count captured, delivered, replaced and dropped frames separately. Keep input commands ordered; do not apply video's drop policy to taps or text. Test slow rendering, rapid pause/resume, unplug/reconnect and shutdown. These are architectural acceptance requirements, not a claim the current controller already implements all of them.

Reuse CIContext. Avoid allocating render infrastructure per frame. Keep capture-session configuration/start/stop on an owned serial queue. Check output addition and surface failures instead of silently declaring a working session. Use the actual display aspect ratio for input coordinate mapping; test rotation and letterboxing. Do not infer visible output merely from an increasing frame counter: the first AV preview layer in our test remained black despite received frames.

## Native measurement contract
Use Release builds where appropriate. Record model, OS, app/build, refresh capability, charging state and instrumentation enabled. Compare equivalent workloads, not screenshot transport speeds. Capture baseline without controller, a repeated interaction phase, controller-enabled phase and cooldown; avoid mixing phases in one average. Identify instrumentation overhead explicitly.

Report per-frame missed deadlines/hitch duration only when the trace contains those events. Device-wide FPS samples include idle intervals and are not p95 frame latency. Empty tables are inconclusive until trace support and expected event capture are verified. Flush or continuously consume profiler output before termination; our first buffered run lost its tail, invalidating the idle comparison.

A proposed repeatable acceptance run is two minutes baseline, ten minutes repeated transitions and two minutes cooldown. This duration is a project protocol, not an Apple guarantee. Stop for a system thermal warning, instability or owner's request. Prefer a controlled external surface-temperature measurement alongside on-device thermal state if heat attribution is needed; record measurement method and ambient conditions.

ProcessInfo.thermalState observed inside an iOS app describes its host device's thermal pressure, not degrees Celsius. Running it on the Mac measures the Mac. It cannot automatically read another app's phone telemetry. Do not simulate thermal conditions and report them as real heat. Do not clear user data or disable protections to improve benchmark scores.

## SwiftUI and motion review
Use stable identity for collection rows, narrow dependencies and inexpensive body evaluation. Precompute costly formatting/asset work where measurements justify it. Keep gesture-driven transitions interruptible and reversible; support Reduce Motion. A decorative perpetual animation must have a purpose and stop when hidden. Optimize measured bottlenecks before replacing system components.

## Research provenance
- Apple TN2445: https://developer.apple.com/library/archive/technotes/tn2445/_index.html — output frame drops, buffer ownership and callback cost. Archived guidance; verify API availability against SDK.
- Apple WWDC23: https://developer.apple.com/videos/play/wwdc2023/10160/ — SwiftUI dependency, update and identity performance.
- Apple responsiveness: https://developer.apple.com/documentation/xcode/improving-app-responsiveness — hangs and hitches require different measurements.
- Apple thermal state: https://developer.apple.com/documentation/foundation/processinfo/thermalstate-swift.property — qualitative host-device state; no remote thermometer implied.
- Appium upstream guide: https://github.com/appium/appium-xcuitest-driver/blob/master/docs/guides/mjpeg.md — WDA MJPEG is a screenshot stream, not native frame-time instrumentation. Moving master reference, not vendored/pinned source or executed upstream code.

These are selective primary-source notes and our own observed lessons. No book has been read or private Apple implementation recovered by this research pass. No Android, A Pro or M-series comparative benchmark has been completed.
