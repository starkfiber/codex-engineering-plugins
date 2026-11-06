# Composition

Read this file when grouping, hierarchy, typography, or density needs a decision. Apply the relevant principle to the actual task. These principles are design heuristics, not universal measurements.

## Group information through perception

Gestalt principles describe how people perceive relationships between visual elements.

| Principle | Design decision | Check |
| --- | --- | --- |
| Proximity | Keep related items closer than unrelated groups. | Does metadata clearly belong to its title? |
| Similarity | Give repeated roles consistent type, shape, and color. | Could similar styling imply a relationship that does not exist? |
| Common region | Use a shared surface when a group needs a distinct boundary. | Does the surface explain a selectable object or separate task? |
| Continuity | Align repeated content along stable visual lines. | Can the user follow a text column or sequence without searching? |
| Figure and background | Separate important content from its surroundings. | Does the background compete with the content? |

Start with proximity and alignment. Add a surface only when those relationships need more emphasis. Preserve distinct controls within any visual group. A visual group does not automatically require one combined accessibility element.

Apple's [layout guidance](https://developer.apple.com/design/human-interface-guidelines/layout) describes grouping, alignment, and ordering content by importance.

## Establish visual priority

1. Identify the content needed for the immediate task.
2. Give that content a clear position in the reading order.
3. Distinguish supporting content through spacing, type, or placement.
4. Check whether decoration attracts attention before the task does.

Prefer a clear difference in emphasis over several small, unrelated style changes. Do not make every important element large, bold, colored, and enclosed. Keep supporting information readable. A comparison screen may need equal emphasis for comparable values.

Use the language's reading direction. Do not impose a left-to-right scan pattern on every locale.

## Compose typography

Typography cannot make redundant headings useful.

- Assign text styles by role before selecting individual sizes.
- Keep the title closer to its supporting text than to the next content group.
- Use line spacing that keeps multiline text readable without separating lines into apparent groups.
- Check heading wraps with realistic words and localized text.
- Do not truncate essential information to preserve the original layout.
- Keep units associated with their values.
- Align comparable numbers consistently. Use tabular digits when changing widths distract from comparison.
- On wide layouts, constrain reading width instead of stretching paragraphs across the entire screen.

Avoid a universal ratio between all font sizes. System text styles already provide a useful hierarchy. Check that hierarchy at large text sizes. Change layout when necessary instead of forcing every role to retain its original position.

## Choose density for the task

Density describes how much useful information occupies the available area.

| Task | Useful density | Adjustment to consider |
| --- | --- | --- |
| Compare transactions or log repeated values | Compact rows with stable columns. | Reduce repeated decoration before reducing text size or control targets. |
| Read or write sustained text | A clear reading area with restrained surrounding controls. | Limit competing panels and excessive line width. |
| Browse visual objects | Images with enough identifying information to support a choice. | Balance image size against the number of useful choices visible. |
| Complete one focused step | A visible prompt and reachable controls. | Keep the next action near the information that explains it. |

Keep spacing consistent for repeated relationships. Allow larger gaps between different stages or sections. Do not make all gaps equal merely because they share a token scale.

Use empty space to clarify grouping. Do not let decorative spacing displace the immediate task below the visible area. Variation should express differences in importance or behavior.

An example spacing scale is 4, 8, 12, 16, 24, 32 points. It does not override native metrics or require identical spacing everywhere.

Check density with short and long content. A spacious empty state does not justify oversized populated rows. A compact table does not justify small touch targets.

## Diagnose composition before decoration

Ask whether the problem comes from order, grouping, emphasis, or density. Change the relevant relationship first. Check the result before changing other variables. Preserve useful information throughout the comparison.

