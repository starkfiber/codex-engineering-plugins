# Style specification

Read this file for a named style or a custom visual direction. A style specification defines the visual rules that components share. Record these rules in the project's design document.

## Define the intended interpretation

1. Identify the requested style and the product task.
2. Check supplied references for defining visual traits.
3. Select a consistent interpretation that fits the task and existing constraints.
4. Record the visual rules and the traits to avoid.
5. Apply those rules to a representative screen and its relevant states.

A style name can describe several interpretations. Do not assume that every reference with that label follows the same rules. Separate observed choices from your proposed adaptations.

## Describe the complete visual system

| Dimension | Decisions to record |
| --- | --- |
| Composition | Define hierarchy, density, grid, alignment, and permitted asymmetry. |
| Spacing | Define page insets and gaps within content, between related items, and between sections. |
| Geometry | Define shapes and corner treatments for controls, objects, and larger surfaces. |
| Borders | Define stroke width, color, placement, and the roles that receive outlines. |
| Depth | Define shadow direction, offset, blur, spread, and intensity. Define flat roles and pressed states. |
| Surfaces | Define fills, materials, textures, and layering rules. |
| Background | Define its role, color transitions, texture scale, foreground contrast, and motion policy. |
| Typography | Define text roles, weight, scale, variants, and wrapping behavior. Preserve the applicable font constraints. |
| Color | Define canvas, surfaces, text, action, selection, and status roles. Specify supported appearances and contrast adjustments. |
| State | Define idle, pressed, selected, disabled, loading, error, and focus appearances where relevant. |
| Motion and haptics | Define feedback that supports the style and event. Preserve accessibility preferences and semantic meanings. |
| Boundaries | Define exceptions for system-owned surfaces and platform services. |

Use values and relationships that another agent can implement. “Bold borders” alone is insufficient. Specify which components use borders and how their widths relate. Record actual chosen token values during implementation.

## Preserve defining traits across states

A visual direction should affect the components that express it. Changing only the accent does not establish a new style. Do not keep rounded, translucent defaults when the selected system requires angular, opaque controls.

For example, a neo-brutalist button might use a square outline and a hard offset shadow. Its pressed appearance can reduce that offset while retaining the outline. Its disabled appearance still needs a clear label and an unambiguous state. This is one possible interpretation, not a mandatory button recipe.

Use a primary style for the screen. Combine styles only when each has a defined role. For example, editorial content and utilitarian controls can coexist with an explicit boundary. Avoid accidental mixtures of unrelated shadows, corners, and materials.

## Resolve constraints without losing the direction

Keep the task, accessible interaction, data integrity, and requested scope intact. Continue to apply the skill's rules for fonts, imagery, color, containers, motion, and haptics. A trend article does not authorize an exception.

When a reference conflicts with a rule:

1. Identify the exact conflicting trait.
2. Seek an interpretation that preserves the style's identity within the applicable constraints.
3. Record the adaptation and its effect on fidelity.

If a defining trait remains incompatible, explain the conflict before implementing that trait. Ask a focused question only when the user's choice is necessary. Continue work that does not depend on that choice. Do not silently abandon the style or claim full fidelity after removing its defining traits.

For example, retrofuturism does not automatically authorize neon effects. Explore compatible geometry, typography, and color first. A user instruction can change an aesthetic default. Record that exception explicitly instead of treating the style name as permission.

## Check both quality and fidelity

- Check whether the interface preserves the task and interaction requirements.
- Check whether each relevant component follows the chosen visual rules.
- Check whether state changes preserve the same visual system.
- Check whether large text and supported appearances retain the intended character.
- Check transitions into platform-owned surfaces for visual continuity and expected behavior.

Do not reward fidelity that makes the app unusable. Do not reward usability by silently replacing the requested style with a default theme. Fix the specific conflict through the documented rules.
