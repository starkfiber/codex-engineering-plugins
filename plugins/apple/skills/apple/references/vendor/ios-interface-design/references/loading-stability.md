# Loading stability

Read this file when asynchronous content or operations can change the layout. Keep the user's current task visually stable while content arrives.

## Reserve meaningful space

Reserve image space using the intended aspect ratio or known dimensions. Keep the placeholder and final image within the same layout role. Do not replace a small spinner with a large image that displaces nearby controls.

Keep an action's area stable when its label changes to progress feedback. Let the control adapt to larger text when necessary. Do not preserve a screenshot by clipping labels or fixing every row height.

Keep stable identities for existing list items. Preserve the visible item and its relative position when practical. Avoid moving the user's target because unrelated data arrives above it.

## Distinguish loading situations

| Situation | Suitable response |
| --- | --- |
| No content is available yet. | Show a relevant loading state within the intended structure. |
| Existing content is refreshing. | Preserve useful content when it remains valid. Indicate refresh or stale status when needed. |
| More rows are arriving. | Keep existing rows visible. Place progress near the affected boundary. |
| One action is pending. | Show progress on that action. Keep unrelated controls available when their behavior permits it. |
| Part of the content fails. | Keep successful content visible when meaningful. Place recovery near the failed region. |

Do not show an empty result before loading establishes that the result is empty. Do not leave content from another selected object visible as if it belonged to the current object.

## Use skeletons selectively

A skeleton is a temporary visual approximation of the expected content structure. Use it when that structure is predictable and useful to recognize. Match its image regions, text groups, and major spacing to the expected layout.

Do not use an arbitrary grid of rounded blocks for every screen. Do not show invented values or pretend that skeleton controls are interactive. Keep placeholders outside accessibility navigation unless they communicate meaningful status.

Avoid perpetual shimmer by default. Respect Reduce Motion if a loading treatment animates. Do not add fake progress percentages or delay available content to complete an animation.

## Preserve input and continuity

Keep entered text during recoverable failures. Preserve relevant keyboard focus and selection during updates. Prevent outdated responses from replacing a newer selection's content.

Do not restart the same loading animation because a view redraws. Avoid flashing progress indicators during immediate transitions. Keep meaningful feedback when the operation takes longer.

Use the existing data and state architecture. A visual refinement does not authorize redesigning networking or changing business behavior.

## Check the transition

Observe loading through completion or failure when runtime checks are available. Include slow content, partial failure, retry, and repeated navigation where relevant. Check whether images, controls, or scroll position move unexpectedly.

A screenshot of the final state cannot establish loading stability. Report unavailable runtime checks explicitly.
