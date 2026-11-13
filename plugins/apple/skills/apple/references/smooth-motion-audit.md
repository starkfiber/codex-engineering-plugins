# Smooth motion audit — alpha.6

## Observable experience, not decorative load
For each transition specify start/end geometry, ownership, interruption, reversal, focus destination and Reduce Motion fallback. Keep content readable throughout. Use transforms/opacity when appropriate, but measure masks, blur, shadows and offscreen passes rather than assuming compositor effects are free. Stop effects when hidden; avoid endlessly animating an idle control panel. Do not add fake FPS labels or claim Metal acceleration from visual appearance.

## GPU / CPU attribution
Core Image contexts should be reused. A CIContext-backed preview does not prove zero-copy or a measured GPU speedup: pixel-buffer conversion, image allocation, AppKit drawing and presentation remain costs. Capture delivery counts are not rendered/presented frame counts. Record allocations, frame age, CPU, GPU and hitch events separately. Prefer supported system animation pacing to arbitrary timers for visual transitions.

## Queue audit
LatestFrame keeps one pending value and one scheduled drain. New frames replace pending frames. Pause changes generation and clears the pending value; stale queued work cannot display a pre-pause frame. The sink must be short and must not synchronously wait on the producer. Input events use a separate ordered queue; never drop text/taps as if they were disposable video.

Our local Swift tests cover a blocked-consumer 100000-frame burst, pause invalidation, resume before stale drain, disabled offers and 10000 concurrent producers followed by a sentinel. They establish mailbox behavior, not physical rendering FPS. Integration compiles and signature verification passes. Phone rotation, unplug/reconnect, thermal behavior and live latency remain pending.

## Acceptance matrix
- Host-only: bounded queue, stale-generation rejection, compile, signature, routing/reference integrity.
- Visible Mac UI: controls, resizing/letterboxing, accessible labels, keyboard focus, pause/resume state. Recheck after any display-path change.
- Physical phone: input mapping, app-switcher transitions, capture recovery, sustained thermal state, native frame times without preview and with preview.
- Release: document remaining gates; no universal flawless/smoothness guarantee from a successful build.

Primary background: rendering-performance.md and performance-qualification.md contain Apple/Appium sources and distinguish observed facts from proposed checks.
