# Executed physical-iPhone controller lessons

Recorded 2026-11-13. Evidence scope: native AppKit My iPhone controller, existing trusted WDA 17.0.2, iPhone X/iPhone10,6 on iOS 16.7.16, USB. These are hardware observations, not guarantees for all iPhones or an A–Z certification.

## Behaviors and corrections

- Home, launcher taps, Clock World Clock → Stopwatch, Watch first launch, Calculator resume, Settings launch, and App Switcher were observed on the physical phone. Earlier same-day evidence includes App Library search typing `Calculator` exactly and horizontal launcher swipes.
- Input requests must be serialized FIFO. Concurrent per-keystroke requests previously reordered text. Keep screenshot requests from competing with input.
- Resume must force one preview request even if the automation surface does not make NSApp active. Otherwise the button can appear ineffective while showing a stale frame.
- A successful gesture response can precede the end of iOS animation. A single immediate capture froze blurred Home/app transitions when background polling paused. Add a bounded settled capture after the action (650 ms used here); do not use continuous offscreen polling as the fix. For slow apps use observed readiness, not this fixed delay as universal proof.
- A screenshot of an app switcher card is not proof the app was activated. Observe the selected application's actual screen after tapping.
- First launch may introduce permission prompts. Inspect before further coordinate actions; never continue with stale Home coordinates. Prefer a fresh screenshot after every navigation change.
- Source stores normalized coordinates within the aspect-fit image, mapping to logical device points. Retest rotation before claiming landscape compatibility.

## Performance evidence and interpretation

Eight screenshot requests on this setup took 235–265 ms, median 251.5 ms; each response was 905,514 bytes. This measures WDA screenshot encoding/transport, not animation FPS or touch-to-photon latency. The controller polls no faster than once per 700 ms; it cannot establish smooth 60 Hz animation by observation alone.

A Mac process snapshot reported My iPhone at 0.0% CPU and 106,432 KiB RSS, forwarding at 0.0% and 1,056 KiB. This is a single snapshot, not a sustained peak or idle benchmark. Device sysmon returned CPU_TotalLoad 121.71, CPUCount 6, and unavailable user/system load (-1). Do not present that raw aggregate as a validated normalized percentage. Page counters need their units verified before converting to memory pressure.

Battery diagnostics reported 100%, external connection present, charging false. No battery/SoC/case temperature measurement was collected. Heat reduction is unproven. Fifteen-second idle/hidden-window pause stops screen polling, not all iOS background work or the installed helper. Quit owned runners when finished; do not kill unrelated apps or delete stock apps as a heat treatment.

## Reusable design acceptance

Use Clock's clear large primary state and stable bottom tabs as a hierarchy reference, and the app switcher's spatial continuity as a transition reference. They are examples, not a theme to copy. Verify your own app's interrupted transitions, keyboard dismissal, long names, Dynamic Type, Reduce Motion and VoiceOver separately. Native screenshot sharpness depends on settled capture, source resolution and scaling; never infer poor device rendering solely from a low-rate remote preview.

## Remaining proof

Landscape mapping, long press, clipboard paste, disconnection recovery, sustained thermal baseline, frame-time percentiles, broad third-party app coverage and full accessibility remain separate acceptance gates. No payment flow or financial correctness is proven by this navigation run.

Project evidence resides under `iphone-controller/evidence-20261113` and its Reverse Lab case in the project workspace. Keep raw device identifiers and private screenshots local; distribute only reviewed general lessons.

## USB preview revision, 2026-11-13
Use [rendering-performance.md](rendering-performance.md) for native FPS/GPU/thermal measurements. The controller now has a pinned USB AVFoundation preview plus WDA input; screenshots are a fallback. A 10-second capture probe delivered 430 frames. This is preview delivery, not native FPS. Fifteen foreground app transitions passed; aggregate device counters reached 60 FPS, but the run lost its buffered tail and cannot support idle comparisons or sustained FPS claims. Animation Hitches exported no interval rows; that is inconclusive, not zero hitches. Physical temperature/throttling remains unverified.

Final controller verification: visible app-switcher image rendered from USB video, status frame count 274. AV preview layer appeared black despite arriving frames; replaced its display with Core Image conversion of video buffers. Capture is still USB video, not WDA screenshots. Focus gating removed because it stopped capture prematurely during automated control; pause/minimize/15-second inactivity remain. Native rerun: 9/9 foreground checks, 57 counter samples over 56.92 seconds, peak 60 FPS; final ten GPU samples median 4%. Not a sustained frame-time or temperature proof.
