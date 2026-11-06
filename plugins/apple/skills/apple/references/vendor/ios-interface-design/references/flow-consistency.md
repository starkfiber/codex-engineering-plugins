# Flow consistency

Read this file when the requested scope includes multiple screens. A flow is the sequence of screens and states for one user task. Check the sequence as well as each screen.

## Compare the relevant screens

1. Identify the entry screen and intended result.
2. Identify the detail views, editors, sheets, and recovery states within the requested scope.
3. Compare representative renders beside each other when available.
4. Check the transitions between them in the running interface when possible.

Use the same content, appearance, text size, and locale for the comparison. Do not create extra screens solely to complete this list. A local fix needs only the surrounding context relevant to that fix.

## Preserve visual roles

| Relationship | Rule |
| --- | --- |
| Color and status | Keep the same meaning for the same semantic color across the flow. |
| Type | Use consistent styles for equivalent title, body, metadata, and value roles. |
| Geometry and depth | Keep borders, shapes, shadows, and pressed states consistent for equivalent components. |
| Density | Adapt density to the task while preserving grouping conventions. |
| Actions | Keep equivalent actions recognizable through labels, emphasis, and placement. |
| Images | Preserve object identity between thumbnails, details, and editing views. |

Consistency does not require identical composition. A detail screen can provide more reading space than its source list. An editor can emphasize inputs while retaining the same visual system.

Follow platform conventions when a sheet requires different action placement. Do not force identical button positions across different presentation types.

## Preserve context through transitions

Keep the selected object recognizable when opening its details. Preserve relevant edits, selection, and list position when returning. Reflect a completed edit where the user expects to see its result.

Keep recovery within the task when possible. An error should not become an unrelated themed screen. Preserve the chosen style in supporting states without reducing the clarity of recovery actions.

Preserve the documented boundary between app-owned styling and system-owned surfaces.

## Check for drift

Check whether equivalent components use different tokens without a task-specific reason. Fix unintended differences at the shared component or token level when appropriate. Avoid applying isolated offsets to every screen.

Compare light and dark versions separately when the app supports both. Keep intentional differences in the design document. Report unavailable transition checks separately from screenshot observations.
