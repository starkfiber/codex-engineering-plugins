# Structured design review

Inspect the supplied artifact and selected platform guidance. Produce findings only where evidence supports them. Keep inferred risks separate from observed defects.

For each finding record: id, priority (P0–P3), platform, artifact/file and location, observed behavior, task impact, proposed correction, and verification method. Include evidence type: source, measurement, screenshot, interaction or hardware. If no actionable finding exists, say so and list only relevant evidence limits.

Order review by task completion/navigation, accessibility/input, content hierarchy, typography/color, state recovery, motion and polish. An attractive screenshot does not prove keyboard, VoiceOver, TV focus or spatial comfort.

For motion requested by the user, support Reduce Motion, cap redraw work, suspend animation when not visible and keep progress values truthful. Avoid continuously allocating particles or performing network/file work in render closures. Profile on the target instead of asserting smoothness from compilation.

For a new screen specify the dominant task, semantic tokens, states and platform input expectations; implement one representative flow and exercise its acceptance checks. Review-only requests authorize findings, not automatic edits.
