# Design and review

Start with the app's primary task, existing identity, navigation and information hierarchy. Preserve explicit aesthetic choices. Favor semantic controls, meaningful grouping, readable metadata and native behavior. Use project tokens for color, typography, spacing and motion when present; avoid inventing a rigid token system for a tiny fix.

For iPhone/iPad craft, consult the bundled `vendor/ios-interface-design/SKILL.md` and its targeted references. For tokens, consult `vendor/swiftui-design-tokens/SKILL.md`. For Apple TV focus, consult `vendor/apple-tvos/SKILL.md`. These are optional specialists, not simultaneous instruction sets. Read each selected specialist fully before applying its workflow.

For HIG assertions use current official guidance at https://developer.apple.com/design/human-interface-guidelines and cite the relevant page. Distinguish an Apple requirement from a recommendation and from your own design judgment. The dickwu local research checkout can inform phone/desktop review, but its snapshots omit watchOS/tvOS/visionOS sections and its root lacks an explicit license; it is not bundled in this plugin.

Review task hierarchy, navigation/recovery, responsive typography, semantic color in supported appearances, labels and focus order, reduced motion/transparency, loading stability and error/permission states. Use screenshots for visual observations, measured values for contrast/size findings, and interaction tests for behavior. Do not infer tactile quality, focus behavior or complete accessibility from a still image. Avoid universal rules such as haptics on every tap or one spacing threshold across all platforms.

For a new interface, establish one representative screen and expand its adopted rules consistently. For a review-only request, deliver prioritized evidence-backed findings without implementing unrelated changes.
