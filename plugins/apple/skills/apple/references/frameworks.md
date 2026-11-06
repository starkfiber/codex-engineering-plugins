# Framework selection

Look up each framework at https://developer.apple.com/documentation/ before introducing version-sensitive APIs. Confirm target availability, capabilities, privacy descriptions, lifecycle and testing requirements.

| Concern | Candidate frameworks / key decision |
| --- | --- |
| Views, input, scenes | SwiftUI; UIKit/AppKit interop by platform |
| Data | Foundation, SwiftData or Core Data; migration and isolation |
| HTTP, background transfers | URLSession; streaming, cancellation, background session support by platform |
| Widgets and complications | WidgetKit; separate target, timeline reload budgets, shared containers |
| Live Activities | ActivityKit on supported targets; stale/end lifecycle and push updates |
| Siri and system actions | App Intents; discoverability, parameters, authentication policy |
| Companion sync | WatchConnectivity; reachability versus queued transfer |
| Health and workouts | HealthKit, WorkoutKit where supported; permissions and hardware evidence |
| Purchases | StoreKit; entitlement reconciliation, transactions, restore flow and local configuration tests |
| Cloud sync | CloudKit; container, account state, conflicts and offline recovery |
| Audio/video | AVFoundation, AVKit, MediaPlayer; audio session and interruption handling |
| Spatial | RealityKit, ARKit; windows/volumes/immersive spaces and input availability |
| Maps/location | MapKit, Core Location; permission scope and background capability |
| ML and language | Core ML, Vision, NaturalLanguage; on-device resource use and availability |
| Security/identity | Security, CryptoKit, LocalAuthentication, AuthenticationServices |
| Notifications | UserNotifications; authorization, delivery state and actionable content |
| App distribution | Xcode signing/export, TestFlight/App Store Connect, Developer ID/notarization |

The research collection offers framework-specific discovery but contains overlapping instructions and mixed licenses. Prefer the original upstream for the selected topic, inspect its license and version, and import only what the actual task needs.
