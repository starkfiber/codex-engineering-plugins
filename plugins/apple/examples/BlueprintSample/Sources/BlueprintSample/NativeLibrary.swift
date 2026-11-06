import SwiftUI
import Observation

/// UI-facing state is explicitly isolated; services can be injected by the host app.
@MainActor @Observable public final class LibraryModel {
    public var selection: String?
    public var query = ""
    public let items = ["Downloads", "Library", "Settings"]
    public init() {}
    public var filteredItems: [String] { query.isEmpty ? items : items.filter { $0.localizedCaseInsensitiveContains(query) } }
}

/// Uses native navigation, controls, text styles and system appearance on each target.
public struct NativeLibrary: View {
    @State private var model = LibraryModel()
    public init() {}
    public var body: some View {
        #if os(macOS)
        NavigationSplitView {
            List(model.filteredItems, id: \.self, selection: $model.selection) { Text($0) }
                .searchable(text: $model.query)
                .navigationTitle("Library")
        } detail: { detail }
        #else
        NavigationStack {
            List(model.filteredItems, id: \.self) { item in
                NavigationLink(item) { Text(item).navigationTitle(item) }
            }.navigationTitle("Library")
        }
        #endif
    }
    private var detail: some View {
        Group {
            if let selection = model.selection { Text(selection).font(.title) }
            else { ContentUnavailableView("Select an item", systemImage: "sidebar.left") }
        }.padding()
    }
}
