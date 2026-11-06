# Native implementation

Use this reference when a UI change needs platform-specific implementation guidance. The following SwiftUI suggestions have UIKit equivalents.

## Separate appearance from behavior

1. Use a native control with custom styling when it can express the design.
2. Use custom composition around native controls when the layout needs more freedom.
3. Build a custom control only when those options cannot express the required interaction or appearance.

SwiftUI's [ButtonStyle](https://developer.apple.com/documentation/swiftui/buttonstyle) supports custom appearance with standard button behavior. Use the relevant style APIs for other controls when available. In UIKit, use supported configuration and state APIs before replacing interaction handling.

Do not replace a semantic button with a drawn rectangle and a tap gesture solely to change its borders. For custom controls, implement the relevant labels, roles, values, actions, focus, keyboard behavior, and state changes. Check those behaviors in the running interface. A custom drawing does not provide them automatically.

Preserve platform-owned permission dialogs, keyboards, and other system surfaces. Specify how app-owned styling transitions into those surfaces. Do not recreate system dialogs merely to match a theme.

## Structure and tokens

- Keep semantic colors in the existing asset catalog or token layer. Use adaptive system backgrounds where suitable. Do not scatter raw hex values through screens. Do not apply global opacity to distinguish secondary content.
- Prefer text styles such as body, headline, and title. Use system rounded, serif, or monospaced variants for a specific role. Avoid changing the type style from row to row. Use monospaced digits for changing numeric columns where stable width helps.
- Use scalable metrics for custom dimensions that depend on text. Do not cap Dynamic Type to preserve a screenshot. Do not shrink text to preserve a screenshot. Let horizontal rows become vertical when essential labels and values no longer fit.
- Extract a reusable component when it controls repeated visual rules or interactions. Avoid a universal card component whose many switches make every screen look alike.
- Preserve model and state ownership. Do not redesign networking to complete a visual refinement.

## Navigation and layout

- Use navigation stacks for hierarchy. Use tabs for peer destinations. Use sheets for tasks with a defined scope. Choose navigation based on the flow, not a predetermined number of tabs. Preserve established navigation unless the requested scope includes changes to it.
- Use native list and form behavior when it supports the task. Customize content and grouping deliberately. Do not remove useful indicators of interaction merely to create a custom appearance.
- Use custom row surfaces, borders, separators, or layouts when the chosen style requires them. Preserve scrolling, editing, selection, and input behavior where applicable.
- Handle safe areas and keyboard avoidance with layout tools rather than hard-coded device heights or offsets. Avoid drawing a fake status bar or home indicator in a running app.
- On supported iPad layouts, consider a list/detail structure or sidebar. Adapt to available width, multitasking, and orientation rather than device-name checks alone.
- For current materials and new APIs, check Apple documentation and the deployment target. Do not raise the minimum OS for a decorative effect.

Apple describes [Liquid Glass](https://developer.apple.com/design/human-interface-guidelines/materials) as a functional layer for navigation and controls above content. Use Liquid Glass in that role. Do not apply glass to every content card. Do not stack glass surfaces.

When the design uses Liquid Glass, prefer system support. Provide compatible behavior for supported older systems. Respect Reduce Transparency and Increase Contrast. Do not add glass to app-owned surfaces when it conflicts with the selected style.

## Hit testing and semantics

- Use actual buttons and navigation links for actions. A tap gesture on styled text does not provide all expected control behavior.
- For custom buttons, apply the intended size and padding inside the label. Define the content shape inside that label when needed. Check that the padded area responds, not just the glyph. Use comfortably sized targets, generally at least 44 by 44 points for ordinary custom controls. Prevent overlap between neighboring targets.
- A row with a secondary action needs distinct sibling controls. Do not wrap a button inside a navigation link or button. Preserve independent accessibility focus and hit regions.
- Label icon-only actions in the app's language. Group related reading content when it improves VoiceOver output. Do not merge separate actions into that group. Express selection and status through accessibility semantics as well as color.
- Keep focus, reading order, and error recovery consistent after insertion, deletion, sheet dismissal, or input validation failure.

## State and motion

- Keep stable item identities so updates preserve focus and position. Do not generate new identifiers during rendering to trigger animations.
- Animate the state change that explains the interaction. Avoid broad implicit animations that also animate unrelated layout, keyboard, or loading changes.
- Native navigation and list transitions count as motion design. Do not add a second transition over them solely to demonstrate animation.
- Under Reduce Motion, replace unnecessary spatial movement with an immediate update or restrained alternative.
- Show a truthful loading or disabled state for ongoing work. Avoid fake timers and indefinite skeleton placeholders when content is already available. Keep recovery actions next to the relevant failure.

## Platform references

Read the relevant official page when a platform detail is uncertain. You do not need to read every linked page for every task:

- [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Apple typography guidance](https://developer.apple.com/design/human-interface-guidelines/typography)
- [UI design tips](https://developer.apple.com/design/tips/)
- [Testing system accessibility features](https://developer.apple.com/documentation/accessibility/testing-system-accessibility-features-in-your-app)
- [SF Symbols](https://developer.apple.com/sf-symbols/)

