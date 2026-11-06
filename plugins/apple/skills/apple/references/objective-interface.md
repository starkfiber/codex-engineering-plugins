# Objective-driven interfaces and motion

Begin with the user's task and observable success: what decision or operation must this screen support? Map each displayed state to the source, operation stage and evidence that justifies it. Choose native controls and clear hierarchy before decoration. Explain research proposals, simulations and confirmed execution with distinct labels.

For SwiftUI, prefer platform navigation, system typography, semantic colors, explicit UI state ownership and accessible controls. Use bounded transitions to preserve context, not perpetual effects to imply activity. Read accessibilityReduceMotion and use a static or simpler alternative. Keep long source/provenance text selectable and allow wrapping. Render stale, empty, unavailable, rejected and failed states explicitly. A fixture demonstration should always identify itself and expose no execution controls for an unconnected backend.

For web tasks in the user's chosen stack, use semantic HTML and keyboard-operable controls; share the information hierarchy and semantic token roles rather than copying macOS chrome indiscriminately. Prefer CSS transform/opacity transitions and animate only state changes that help orientation. Respect `prefers-reduced-motion`; avoid forced animation delays. Use JavaScript for actual interaction/data state, cancel animation loops on teardown, and pause offscreen work. Do not add an unrelated web frontend to a native task.

Review beauty through coherent spacing, typography, composition and feedback alongside functionality. Verify focus visibility, text expansion, supported appearances, reduced motion and error recovery. Do not declare smoothness, accessibility or cross-platform visual quality from a compiler pass. Measure performance when animation changes are material.

Reference implementation: examples/BlueprintSample/ResearchDiagnosticsView.swift and ResearchContracts.swift at the project root. Those are local fixture projections pending ExampleClient contract review, not live runtime adapters.
