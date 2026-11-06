# Platform adapters

Use https://developer.apple.com/design/human-interface-guidelines and each platform's SDK documentation. Availability differs by platform and version even when symbols look alike. Check `#if os(...)`, `#if canImport(...)` and runtime `#available(...)` for their distinct purposes.

## macOS
Choose Window, WindowGroup, DocumentGroup, Settings or MenuBarExtra by lifecycle. Give menu-bar utilities a proper app bundle, stable bundle ID and deliberate activation policy. Verify status-item visibility and click behavior on the actual display; do not assume Control Center holds hidden third-party icons. Support keyboard commands, focus, resize, multiple windows where relevant, drag/drop and native file dialogs. Distinguish sandbox bookmarks/entitlements from direct-distribution access; decide signing, hardened runtime and notarization from distribution intent. Directories outside the container need the correct user-granted access when sandboxed.

## iOS
Use task-appropriate tabs/stacks, safe areas, keyboard-aware forms, semantic system controls and lifecycle-aware tasks. Test long text, Dynamic Type, VoiceOver, background/foreground transitions and permission recovery. Haptics belong to meaningful events and must not be the sole signal. UIKit interop is appropriate for missing native behavior; preserve interactive navigation and gestures.

## iPadOS
Adapt to available width, not model names. Use split views and inspectors where useful; preserve selected content across column collapse and expansion. Test resizable windows, pointer and keyboard, drag/drop, multitasking and scene restoration. Share domain code with iOS without stretching a phone layout to full width.

## watchOS
Optimize glanceable tasks and short interactions for the wrist. Verify Digital Crown, focus, text sizes and complications through WidgetKit. Choose independent versus companion architecture explicitly. WatchConnectivity transfer is asynchronous and availability-dependent; preserve pending work and handle unreachable companions. Health/workout/background tasks require the appropriate capabilities and runtime modes. Test notifications and sensor behavior on hardware before claiming them verified.

## tvOS
Design around remote directional focus and viewing distance. Verify initial focus, focus restoration, modal containment and Menu/back behavior. Keep text input and pointer assumptions out of shared views. Test playback lifecycle, audio, remote input and accessible labels. A touch-target audit on iOS is not a tvOS focus audit.

## visionOS
Choose windows, volumes or immersive spaces by task. Preserve comfortable scale, legibility, depth and clear selection through indirect input. Verify RealityKit/ARKit availability and permissions separately; hand/eye tracking assumptions require documented public API support and hardware evidence. Keep shared domain code separate from spatial presentation. Simulator results cannot establish comfort or physical tracking quality.

## Other Apple surfaces
Mac Catalyst is an explicit product choice with its own behavior and entitlements. CarPlay requires supported categories and entitlements; use template APIs for the permitted category. WidgetKit, App Intents, Share extensions, Safari extensions, App Clips and device-management tools have distinct targets, lifecycles and constraints. For an unlisted surface, consult its current Apple documentation before proposing support.
