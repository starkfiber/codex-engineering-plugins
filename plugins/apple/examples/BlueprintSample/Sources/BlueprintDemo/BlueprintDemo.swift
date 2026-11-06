import SwiftUI
import BlueprintSample

@main
struct BlueprintDemoApp: App {
    var body: some Scene {
        Window("Apple Blueprint Lab", id: "lab") {
            LabContent().frame(minWidth: 980, minHeight: 560)
        }.defaultSize(width: 1180, height: 740)
        .commands {
            SidebarCommands()
            ToolbarCommands()
            ResearchFindCommands()
        }
        Settings { LabSettings() }
    }
}

private struct LabContent: View {
    @AppStorage("blueprint.reduceMotion") private var reduceMotion = false
    @AppStorage("blueprint.appearance") private var appearance = "system"
    var body: some View {
        ResearchDiagnosticsView()
            .environment(\.blueprintReduceMotion, reduceMotion)
            .preferredColorScheme(appearance == "light" ? .light : appearance == "dark" ? .dark : nil)
    }
}

private struct LabSettings: View {
    @AppStorage("blueprint.ambientMotion") private var ambientMotion = true
    @AppStorage("blueprint.reduceMotion") private var reduceMotion = false
    @AppStorage("blueprint.appearance") private var appearance = "system"
    var body: some View {
        Form {
            Picker("Appearance", selection: $appearance) {
                Text("System").tag("system")
                Text("Light").tag("light")
                Text("Dark").tag("dark")
            }
            Section("Motion") {
                Toggle("Animate decorative water", isOn: $ambientMotion)
                Toggle("Reduce motion in this app", isOn: $reduceMotion)
                Text("Your system Reduce Motion setting always takes precedence. Water is decoration, unrelated to progress or activity.")
                    .font(.caption).foregroundStyle(.secondary)
            }
        }
        .formStyle(.grouped)
        .frame(width: 440)
        .fixedSize(horizontal: false, vertical: true)
        .padding()
    }
}
