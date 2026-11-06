# Haptic feedback

Read this file when designing or changing tactile interactions. Haptic feedback is a physical signal that the user can feel. Use it to clarify an event or reinforce a result.

## Choose the event before the signal

Use short signals for discrete events. Keep the meaning consistent across the app. Check whether the native control already provides feedback before adding another signal. Avoid decorative vibration during ordinary scrolling, screen appearance, or background refreshes.

Apple's [haptic guidance](https://developer.apple.com/design/human-interface-guidelines/playing-haptics) recommends consistent meanings, restraint, and optional feedback.

| Event | Possible signal | Condition |
| --- | --- | --- |
| The user changes a discrete selection. | Selection feedback. | The selected value actually changes. |
| A visible object collides or snaps into place. | Impact feedback. | The interaction includes a physical metaphor. |
| A meaningful task completes successfully. | Success feedback. | The operation reaches its defined success state. |
| An operation produces a warning. | Warning feedback. | The interface also explains the warning. |
| An attempted operation fails. | Error feedback. | The interface also explains the failure and available recovery. |
| The user performs routine navigation. | Usually no additional signal. | Preserve useful native feedback. |

These mappings describe possible uses. They do not require feedback for every matching event. Do not use selection feedback to acknowledge an unchanged selection. See [selection feedback semantics](https://developer.apple.com/documentation/uikit/uiselectionfeedbackgenerator/selectionchanged%28%29).

## Define timing and ownership

1. Identify the event that deserves feedback.
2. Select the signal that matches its meaning.
3. Assign one implementation location to emit that signal.
4. Define the condition that prevents duplicate playback.

Trigger success from the result of an operation, not from its initial button press. Do not emit feedback from view rendering, initial data loading, or unrelated state restoration. Prevent duplicate signals from repeated callbacks or both a child control and its parent.

For continuous gestures, identify meaningful boundaries before adding discrete signals. Avoid feedback on every position update. Suppress repeated signals while the gesture remains near the same boundary. Do not replay stale feedback after cancellation or navigation away from the task.

## Use native APIs first

For SwiftUI, consider [sensoryFeedback](https://developer.apple.com/documentation/swiftui/sensoryfeedback) when the deployment target supports the required behavior. Bind its trigger to the intended event. Check transition conditions when the same state can change for unrelated reasons.

For UIKit, use the appropriate [feedback generator](https://developer.apple.com/documentation/uikit/uifeedbackgenerator). Choose selection, impact, or notification feedback according to the event. Keep calls on the main actor. Check API availability before choosing an initializer or overload.

For predictable UIKit interactions, consider [prepare()](https://developer.apple.com/documentation/uikit/uifeedbackgenerator/prepare%28%29) before the expected event. Calling it immediately before playback does not improve latency. Do not keep a generator prepared through an indefinite loop.

Use Core Haptics only when a justified custom pattern needs capabilities beyond standard feedback. Check [device support](https://developer.apple.com/documentation/corehaptics/chhapticdevicecapability/supportshaptics) before using custom haptics. Keep the action functional if playback is unavailable. Do not raise the minimum OS solely to add a tactile effect.

## Respect preferences and other feedback

Keep haptics optional. Honor the app's existing haptic preference. When adding custom feedback, provide a way to disable it if the app lacks one. Do not bypass system settings with another vibration mechanism.

Keep visual and accessible confirmation available without haptics. Do not treat Reduce Motion as a substitute for a haptic preference. Match tactile timing to the event's visible feedback. Check possible interference when the task uses the camera, microphone, or motion sensors.

## Check on a supported physical device

- Check whether the signal matches the event and arrives at the expected time.
- Check rapid repeated interactions for duplicate or excessive feedback.
- Check cancellation and failed operations for incorrect success signals.
- Check the experience with the app's haptics disabled.
- Check that all task information remains available without tactile feedback.

A screenshot cannot establish tactile quality. A simulator or source check cannot establish how the signal feels on a physical device. Report physical feedback as unverified when no supported device is available.
