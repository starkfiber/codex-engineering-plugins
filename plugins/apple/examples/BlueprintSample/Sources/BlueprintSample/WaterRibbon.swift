import SwiftUI

private struct BlueprintReduceMotionKey: EnvironmentKey {
    static let defaultValue = false
}

extension EnvironmentValues {
    /// App preference supplements the read-only system accessibility setting.
    public var blueprintReduceMotion: Bool {
        get { self[BlueprintReduceMotionKey.self] }
        set { self[BlueprintReduceMotionKey.self] = newValue }
    }
}

/// Decoration only. Never represents a transfer, telemetry or execution progress.
public enum AmbientMotion {
    public static func isActive(enabled: Bool, reduceMotion: Bool, sceneActive: Bool) -> Bool {
        enabled && !reduceMotion && sceneActive
    }
}

struct WaterRibbon: View {
    let enabled: Bool
    @Environment(\.accessibilityReduceMotion) private var systemReduceMotion
    @Environment(\.blueprintReduceMotion) private var appReduceMotion
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        Group {
            if AmbientMotion.isActive(enabled: enabled, reduceMotion: systemReduceMotion || appReduceMotion, sceneActive: scenePhase == .active) {
                // Restrict the clock to the decorative leaf, at most 24 updates per second.
                TimelineView(.animation(minimumInterval: 1.0 / 24)) { timeline in
                    RibbonCanvas(phase: timeline.date.timeIntervalSinceReferenceDate.truncatingRemainder(dividingBy: 24) / 24 * .pi * 2)
                }
            } else {
                RibbonCanvas(phase: 0)
            }
        }
        .allowsHitTesting(false)
        .accessibilityHidden(true)
    }
}

private struct RibbonCanvas: View {
    let phase: Double
    var body: some View {
        Canvas { context, size in
            for index in 0..<7 {
                var wave = Path()
                for step in 0...80 {
                    let x = size.width * CGFloat(step) / 80
                    let y = size.height * 0.80
                        + sin(Double(step) * 0.075 + Double(index) * 0.23 + phase) * (10 + Double(index))
                        + sin(Double(step) * 0.15 - phase) * 2
                    if step == 0 { wave.move(to: CGPoint(x: x, y: y)) }
                    else { wave.addLine(to: CGPoint(x: x, y: y)) }
                }
                context.stroke(wave, with: .linearGradient(Gradient(colors: [.clear, .cyan.opacity(0.20 + Double(index) * 0.06), .blue.opacity(0.30), .clear]), startPoint: .zero, endPoint: CGPoint(x: size.width, y: size.height)), lineWidth: index == 3 ? 2.4 : 1)
            }
            for index in 0..<16 {
                let x = size.width * (0.57 + Double(index % 8) * 0.052)
                let y = 18 + Double((index * 29) % 67)
                let radius = index % 4 == 0 ? 1.5 : 0.8
                context.fill(Path(ellipseIn: CGRect(x: x, y: y, width: radius * 2, height: radius * 2)), with: .color(.cyan.opacity(0.25)))
            }
        }
    }
}
