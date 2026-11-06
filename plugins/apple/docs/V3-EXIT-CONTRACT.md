# V3 sprint and exit contract

Purpose: a Swift-first, native UI engineering workbench that repeatedly produces understandable, tested changes in real projects. Start full V3 execution after V2 platform and integration acceptance; independent local work may proceed sooner.

## Sprint 1 — Establish the lab

Complete compatible Xcode setup or connect an explicitly authorized Xcode Mac. Provide six platform app shells with build, launch and interaction scripts. Preserve platform/runtime versions and source-bound results. Demonstrate clean-machine skill discovery, MCP initialization and plugin relocation. Do not treat library typechecking as an application launch.

Exit: each supported platform has a reproducible build and its stated interaction coverage; unsupported/device-only behavior is named explicitly.

## Sprint 2 — Understand and design

Discover project targets, deployment constraints, capabilities and Swift diagnostics. Maintain an independent routing/evaluation corpus. Review native control choice, hierarchy, semantics, typography, responsive layout, keyboard/VoiceOver/focus, reduced motion and error states. Implement tests that reproduce observed regressions before fixing them.

Exit: predefined benchmark thresholds are set before evaluation and met on held-out tasks; measured results and human design judgments are distinguishable. Existing user design choices and compatible working behavior are preserved.

## Sprint 3 — Implement and recover

Complete representative navigation, persistence, async work, streaming transfers and permissions recipes. Add cancellation, network interruption, migration and corrupt-file fixtures. Repair scoped defects through reviewable diffs. Bind each successful verification to the exact changed source. Prioritize reliability over adding unrelated features.

Exit: representative projects complete primary tasks and recover from documented failure cases; no false progress, silent data loss or invented verification results.

## Sprint 4 — Ship and sustain

Audit privacy declarations, entitlements, signing and dependency licenses; exercise packaging, upgrade and rollback. Verify distribution where credentials are available. Record SDK change impact and maintain project-local reproductions/decisions without storing secrets. Publish a supported-capability matrix and known limits.

Exit: clean installation and a complete inspect → change → build → interact → review → package workflow are demonstrated. All release-critical defects are closed; remaining lower-severity limitations have owners and acceptance decisions. Credential/device-dependent results remain explicit.

## V3 ultimatum

V3 is accepted only when a separate reviewer can reproduce the published end-to-end results from a clean checkout, see why the Swift/UI decisions were made, and identify exactly which targets were tested. No unexplained red checks, fabricated passes or undocumented environment dependencies. Freeze feature scope at that point and move to maintenance releases.

V3 does not promise permanent completeness, automatic App Review approval, or zero future work. Swift, SDKs, Apple policies and device behavior evolve. The intended outcome is controlled maintenance and repeatable quality, not endless feature expansion.
