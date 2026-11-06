# Review the rendered experience

Use this reference for a formal review or an unresolved visual defect. Match the evidence to the affected scope. Use existing project tools before considering alternatives.

## Review in priority order

1. Check task completion and preserved capabilities.
2. Check hierarchy, grouping, and readable information.
3. Check fidelity to the chosen style and consistency between equivalent components.
4. Check interaction behavior and layout resilience.
5. Check optical details after structural defects.

Do not average these judgments into a beauty score. A strong visual treatment cannot compensate for an unusable action.

A hard shadow or strong border is not inherently a defect. Report a conflict with the chosen rules or an observable effect on the task. Preserve defining style traits during a fix.

## Match evidence to the concern

| Concern | Evidence to collect |
| --- | --- |
| Composition and text | Inspect the render at the intended width. Check grouping, title duplication, alignment, clipping, and safe areas. |
| Style consistency | Compare equivalent components and relevant states. Identify the exact token or rule that differs. |
| Controls and navigation | Exercise changed actions, padded hit regions, separate child actions, dismissal, scrolling, and keyboard behavior. |
| Motion | Observe the transition, including the relevant Reduce Motion behavior. |
| Haptics | Use a supported physical device. Check timing, duplicates, and the disabled preference. |
| Resilience | Check long localized content, large text, relevant states, and supported appearances. Include an appropriate iPad width when relevant. |
| Flow | Compare related screens under matching conditions. Check context when opening details and returning. |
| Loading | Observe content arrival, failure, and retry. Check control positions and scroll stability. |
| Images | Check difficult crops, missing images, and object identity. |
| Backgrounds | Check foreground contrast across content positions. Check grain at device scale. |
| Accessibility | Check labels, reading order, grouping, separate actions, and relevant preferences. Measure important color pairs when tools permit. |

For translucent surfaces, include the content behind them in contrast checks. Do not declare compliance from visual judgment alone. Keep tool findings separate from your interpretation.

Use only the rows that address the task. These checks do not require opening every corresponding reference. Return to the reference selector only when a finding needs more specific guidance.

## Distinguish defects from preferences

Fix hierarchy and behavior before cosmetic differences. Do not remove useful metadata merely because it resembles a badge. Do not force every screen into the same composition when its task differs.

An empty state must represent the actual data state. A fake chart or invented activity is not a visual improvement. Placeholder data belongs only in the permitted preview or prototype context.

## Report actionable findings

For each finding, provide its location, observed evidence, user impact, and a concrete fix. Separate observed defects from risks that need a runtime check. Report no substantive defects when that is the actual result.

For an implementation task, fix observed blocking defects before delivery. Check the affected result after material fixes. For a review-only task, report the findings without editing files.

When renders or runtime tools are unavailable, complete the available source and build checks. Explicitly identify visual, interaction, or tactile checks that remain incomplete. Do not describe source inspection as a screenshot audit.
