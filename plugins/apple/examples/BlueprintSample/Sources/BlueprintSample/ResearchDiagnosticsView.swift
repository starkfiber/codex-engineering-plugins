import SwiftUI

#if os(macOS)
private struct ResearchFindActionKey: FocusedValueKey { typealias Value = () -> Void }
extension FocusedValues {
    fileprivate var researchFindAction: (() -> Void)? {
        get { self[ResearchFindActionKey.self] }
        set { self[ResearchFindActionKey.self] = newValue }
    }
}
public struct ResearchFindCommands: Commands {
    @FocusedValue(\.researchFindAction) private var find
    public init() {}
    public var body: some Commands {
        CommandGroup(after: .textEditing) {
            Button("Find…") { find?() }
                .keyboardShortcut("f", modifiers: .command)
                .disabled(find == nil)
        }
    }
}
#endif

/// Fixture-only research client. No runtime connection, action execution or telemetry polling.
public struct ResearchDiagnosticsView: View {
    @State private var surface: String? = "Overview"
    @State private var selectedID: String? = ResearchFixtures.attentionIDs.first
    @State private var query = ""
    @FocusState private var sidebarFocused: Bool
    @FocusState private var searchFocused: Bool
    @State private var restoreSidebarFocus = false
    @Environment(\.accessibilityReduceMotion) private var systemReduceMotion
    @Environment(\.blueprintReduceMotion) private var appReduceMotion
    private var reduceMotion: Bool { systemReduceMotion || appReduceMotion }
    public init() {}
    private var records: [DiagnosticRecord] { ResearchFixtures.filtered(surface: surface ?? "Overview", query: query) }
    private var selected: DiagnosticRecord? { records.first { $0.id == selectedID } }
    private var sidebarSelection: Binding<String?> {
        Binding(get: { surface }, set: { value in
            guard value != surface else { return }
            restoreSidebarFocus = sidebarFocused
            surface = value
        })
    }
    private var recordSelection: Binding<String?> {
        Binding(get: { selectedID }, set: { id in
            selectedID = id
            if surface == "Overview", let record = records.first(where: { $0.id == id }) { surface = record.surface }
        })
    }

    public var body: some View {
        #if os(macOS)
        Group {
            if surface == "Overview" && query.isEmpty {
                NavigationSplitView { sidebar } detail: {
                    OperationsHome { record in
                        selectedID = record.id
                        surface = record.surface
                    }.navigationTitle("Operations")
                }
            } else {
                NavigationSplitView { sidebar } content: { observationList } detail: {
                    if let selected { recordDetail(selected) }
                    else { ContentUnavailableView("Select an observation", systemImage: "doc.text.magnifyingglass", description: Text("Inspect its provenance, decision and evidence.")) }
                }
            }
        }
        .searchable(text: $query, prompt: "Search observations")
        .searchFocused($searchFocused)
        .focusedSceneValue(\.researchFindAction, { searchFocused = true })
        .onChange(of: surface) { if !records.contains(where: { $0.id == selectedID }) { selectedID = records.first?.id } }
        .onChange(of: query) { if !records.contains(where: { $0.id == selectedID }) { selectedID = records.first?.id } }
        .animation(reduceMotion ? nil : .easeInOut(duration: 0.18), value: surface)
        #else
        NavigationStack {
            List(ResearchFixtures.records) { record in
                NavigationLink(record.title) { recordDetail(record) }
            }.navigationTitle("Research Lab")
        }
        #endif
    }

    #if os(macOS)
    private var sidebar: some View {
            List(ResearchFixtures.surfaces, id: \.self, selection: sidebarSelection) { value in
                Label(value, systemImage: symbol(for: value)).padding(.vertical, 5)
            }
            .focused($sidebarFocused)
            .task(id: surface) {
                if restoreSidebarFocus {
                    await Task.yield()
                    sidebarFocused = true
                    restoreSidebarFocus = false
                }
            }
            .navigationTitle("Apple Blueprint")
            .navigationSplitViewColumnWidth(min: 175, ideal: 205)
            .safeAreaInset(edge: .bottom) {
                Label("Local fixtures", systemImage: "externaldrive").font(.caption).foregroundStyle(.secondary).padding()
            }
    }
    private var observationList: some View {
            VStack(alignment: .leading, spacing: 0) {
                HStack {
                    Text(records.count == 1 ? "1 observation" : "\(records.count) observations").font(.subheadline).foregroundStyle(.secondary)
                    Spacer()
                    Image(systemName: "line.3.horizontal.decrease").foregroundStyle(.secondary).accessibilityHidden(true)
                }.padding()
                Divider()
                if records.isEmpty {
                    ContentUnavailableView.search(text: query)
                } else {
                    List(records, selection: recordSelection) { record in
                        VStack(alignment: .leading, spacing: 7) {
                            Text(record.title).font(.headline)
                            Text(record.displayStage).font(.caption).foregroundStyle(record.isVerifiedResult ? Color.green : Color.secondary)
                            Text(record.summary).font(.callout).foregroundStyle(.secondary).lineLimit(3)
                        }.padding(.vertical, 8).tag(record.id)
                    }.listStyle(.inset)
                }
            }
            .navigationTitle(surface ?? "Overview")
            .navigationSplitViewColumnWidth(min: 250, ideal: 320)
    }
    #endif

    private func recordDetail(_ record: DiagnosticRecord) -> some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                HStack(spacing: 12) {
                    Image(systemName: symbol(for: record.surface))
                        .font(.title).foregroundStyle(.cyan)
                        .frame(width: 52, height: 52)
                        .background(.cyan.opacity(0.09), in: RoundedRectangle(cornerRadius: 14))
                        .accessibilityHidden(true)
                    VStack(alignment: .leading, spacing: 5) {
                        Text(record.displayStage.uppercased()).font(.caption.weight(.semibold)).foregroundStyle(.secondary)
                        Text(record.title).font(.title2.weight(.semibold)).textSelection(.enabled).accessibilityAddTraits(.isHeader)
                    }
                }
                Text(record.summary).font(.body).foregroundStyle(.secondary).textSelection(.enabled)
                Label("Illustrative fixture · no live runtime", systemImage: "info.circle")
                    .font(.callout).foregroundStyle(.secondary)
                if record.id == "stream-ambiguity" {
                    Text("Sequence counts cover representative events only. Repeated identities include conflicting content; conflicting variants need separate ordering review.")
                        .font(.callout).foregroundStyle(.secondary).textSelection(.enabled)
                }
                if record.id == "metric-origin" {
                    Text("These fixture values have no metric units or sample periods. They are not device measurements.")
                        .font(.callout).foregroundStyle(.secondary).textSelection(.enabled)
                }
                Divider()
                VStack(alignment: .leading, spacing: 15) {
                    Text("Decision & evidence").font(.headline).accessibilityAddTraits(.isHeader)
                    ForEach(Array(record.fields.enumerated()), id: \.offset) { _, field in
                        HStack(alignment: .top, spacing: 18) {
                            Text(field.label).foregroundStyle(.secondary).frame(width: 140, alignment: .leading)
                            Text(field.value).frame(maxWidth: .infinity, alignment: .leading).textSelection(.enabled)
                        }.font(.callout).accessibilityElement(children: .combine)
                    }
                }
                Divider()
                VStack(alignment: .leading, spacing: 10) {
                    Text("Provenance").font(.headline).accessibilityAddTraits(.isHeader)
                    Text(record.source).font(.callout).textSelection(.enabled)
                    Text(record.snapshot).font(.caption).foregroundStyle(.secondary)
                    Text("Producer: \(record.producer)").font(.caption).foregroundStyle(.secondary)
                    if let runID = record.runID { Text(runID).font(.caption.monospaced()).foregroundStyle(.secondary).textSelection(.enabled) }
                    Text("Synthetic fixture contract v1\nLive runtime adapter not approved").font(.caption).foregroundStyle(.secondary)
                }
            }.padding(28).frame(maxWidth: 680, alignment: .leading).frame(maxWidth: .infinity, alignment: .leading)
        }.background(.background)
    }
    private func symbol(for surface: String) -> String {
        switch surface {
        case "Research": "books.vertical"
        case "Tasks & Ledger": "list.bullet.rectangle"
        case "Scheduler": "chart.bar.xaxis"
        case "Agents & Gates": "point.3.connected.trianglepath.dotted"
        default: "square.grid.2x2"
        }
    }
}
