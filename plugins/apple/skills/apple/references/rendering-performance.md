# Native rendering, smooth motion and remote-control evidence

## Three independent pipelines
1. Native input → application update/layout → Core Animation commit → render preparation → GPU execution → display presentation.
2. Remote input → transport → WDA/XCTest execution → native input. Measure command completion separately from touch-to-visible latency.
3. Screen capture → encoding/USB delivery → Mac preview. Capture FPS and delivery latency are not device rendering FPS or a native benchmark.

Never diagnose the phone's animation performance from screenshot polling. QuickTime-style USB video is an appropriate preview architecture; it still does not replace Instruments. A remote preview can stutter while native UI is smooth, or conceal native hitches through frame dropping.

## What produces smoothness
At 60 Hz each refresh interval is about 16.67 ms; at 120 Hz about 8.33 ms. These are intervals, not an allowance to spend that entire duration on every pipeline stage. Keep main-thread work bounded, prepare assets ahead of interaction, avoid decoding/network/database work during a gesture, and inspect render-server/GPU costs as well as app CPU.

Core Animation submits a layer tree. The render server prepares GPU operations and executes composition. Changes such as opacity and transforms can be composed without repeatedly rebuilding the whole interface; complex masks, blur, shadows and offscreen passes can still be expensive. Use Instruments to distinguish commit hitches from render hitches.

Apple silicon provides graphics compute and efficient memory access, but chip branding alone does not guarantee smooth UI. M-series Mac hardware, A-series iPhones and A Pro models have different budgets and capabilities. The tested iPhone X is an older device; it cannot validate modern ProMotion or M-series behavior.

For UIKit/SwiftUI/Core Animation use the system's animation pacing. For custom Metal rendering consider CAMetalDisplayLink where supported; use CADisplayLink for other custom display-synchronized work. Do not animate by counting arbitrary timer ticks. Progress follows elapsed time, adapts to refresh-rate changes, and stops when hidden. Requested frame rates are preferences, affected by hardware, thermal and power policy.

## Dock / launcher / app-switcher design principles
Observed spatial continuity is a design lesson, not recovered SpringBoard source. Preserve an object's origin, scale and destination; make gestures interruptible; support reversal and cancellation; avoid changing the layout beneath the user's finger. Finite spring/easing transitions are preferable to constant decorative animation. Use native focus, Reduce Motion and accessibility behavior. Test your own implementation instead of claiming Apple's private implementation was reproduced.

## Android comparison
Android also supports smooth, high-refresh interfaces. Diagnose main/UI thread work, RenderThread, GPU completion and missed frame deadlines using system traces and frame timelines. Compare the same workload, device class, thermal state and refresh rate. Do not claim Android inherently or universally fails: workload, implementation, scheduling, hardware and capture transport all matter.

## Measurement protocol
- Establish physical model/OS/build, exact app builds, display capability and charging/ambient conditions.
- Separate idle, sustained navigation and cooldown phases with timestamps.
- Collect native frame/hitch metrics through Instruments; device-wide Core Animation FPS counters are aggregate samples, not per-frame latency percentiles. Zero/low FPS on an unchanged screen is not necessarily jank.
- Record CPU/GPU counter provenance and units; monitor overhead is a confounder. Run with and without preview/capture when attributing costs.
- Measure thermal state through supported device instrumentation or an instrumented app. Host ProcessInfo.thermalState is the Mac, not the connected phone. Battery charging state is not temperature. Do not induce a simulated thermal state and report it as a physical measurement.
- If unavailable, state temperature/throttling unknown. No zero-heat or zero-lag certification from a short run.

## Primary sources checked 2026-11-13
- https://developer.apple.com/videos/play/tech-talks/10855/ — render loop
- https://developer.apple.com/videos/play/tech-talks/10856/ — commit hitches
- https://developer.apple.com/videos/play/tech-talks/10857/ — render preparation, GPU and offscreen passes
- https://developer.apple.com/documentation/quartzcore/cametaldisplaylink — custom Metal pacing
- https://developer.apple.com/documentation/quartzcore/cadisplaylink/preferredframeraterange — power/thermal constraints
- https://developer.apple.com/documentation/quartzcore/optimizing-iphone-and-ipad-apps-to-support-promotion-displays — framework pacing and variable rates
- https://developer.android.com/studio/profile/jank-detection — UI thread, RenderThread and GPU analysis
