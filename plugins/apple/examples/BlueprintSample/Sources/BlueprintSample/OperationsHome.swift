import SwiftUI

public struct OperationsHome: View {
    let open: (DiagnosticRecord) -> Void
    @Environment(\.accessibilityReduceMotion) private var systemReduceMotion
    @Environment(\.blueprintReduceMotion) private var appReduceMotion
    private var reduceMotion: Bool { systemReduceMotion || appReduceMotion }
    @AppStorage("blueprint.ambientMotion") private var ambientMotion = true
    private var attention: [DiagnosticRecord] {
        ResearchFixtures.attentionIDs.compactMap { id in ResearchFixtures.records.first { $0.id == id } }
    }
    public var body: some View {
        GeometryReader { geometry in
        ScrollView {
            VStack(alignment: .leading, spacing: 26) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("OPERATIONS OVERVIEW").font(.caption.weight(.semibold)).foregroundStyle(.secondary)
                    Text("Decisions, with evidence.").font(.largeTitle.weight(.semibold)).accessibilityAddTraits(.isHeader)
                    Text("Triage uncertainty. Inspect outcomes. Keep research in reach.").foregroundStyle(.secondary)
                }
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 18)
                        .fill(LinearGradient(colors: [.blue.opacity(0.13), .cyan.opacity(0.06)], startPoint: .topLeading, endPoint: .bottomTrailing))
                    WaterRibbon(enabled: ambientMotion)
                    VStack(alignment: .leading, spacing: 12) {
                        Label("Inspect before acting", systemImage: "checkmark.shield").font(.headline)
                        Text("Local fixtures · no live runtime connected").font(.callout).foregroundStyle(.secondary)
                        Button("Review receipt mismatch") { if let item = attention.first { open(item) } }
                            .buttonStyle(.borderedProminent).tint(.cyan).foregroundStyle(.black)
                    }.padding(22)
                }
                .overlay(alignment: .topTrailing) {
                    Button { ambientMotion.toggle() } label: {
                        Label(reduceMotion ? "Motion reduced" : (ambientMotion ? "Pause motion" : "Play motion"), systemImage: reduceMotion ? "figure.stand" : (ambientMotion ? "pause" : "play"))
                            .font(.caption)
                    }
                    .buttonStyle(.borderless)
                    .help(reduceMotion ? "Reduce Motion keeps the water still." : "Optional decoration; unrelated to activity or progress.")
                    .disabled(reduceMotion)
                    .padding(16)
                }
                .frame(height: 162).clipShape(RoundedRectangle(cornerRadius: 18))
                HStack(spacing: 22) {
                    stat("Observations", count: ResearchFixtures.records.count)
                    Divider()
                    stat("Need review", count: attention.count)
                    Divider()
                    stat("Confirmed", count: ResearchFixtures.records.filter(\.isVerifiedResult).count)
                }.frame(height: 52)
                Divider()
                if geometry.size.width >= 760 {
                    HStack(alignment: .top, spacing: 24) {
                        attentionSection.frame(minWidth: 350, maxWidth: .infinity, alignment: .leading)
                        Divider()
                        researchSection.frame(width: 235, alignment: .leading)
                    }
                } else {
                    VStack(alignment: .leading, spacing: 26) { attentionSection; researchSection }
                }
            }.padding(32).frame(maxWidth: 1100, alignment: .leading).frame(maxWidth: .infinity, alignment: .leading)
        }
        }
    }
    private var attentionSection: some View {
                VStack(alignment: .leading, spacing: 14) {
                    Text("Needs attention").font(.title3.weight(.semibold)).accessibilityAddTraits(.isHeader)
                    ForEach(attention) { item in
                        Button { open(item) } label: {
                            HStack(alignment: .top, spacing: 12) {
                                Image(systemName: "exclamationmark.circle").foregroundStyle(.orange).padding(.top, 2).accessibilityHidden(true)
                                VStack(alignment: .leading, spacing: 5) {
                                    Text(item.title).font(.headline).foregroundStyle(.primary)
                                    Text(item.summary).font(.callout).foregroundStyle(.secondary).lineLimit(2)
                                }
                                Spacer(minLength: 6)
                                Image(systemName: "chevron.right").font(.caption).foregroundStyle(.secondary).accessibilityHidden(true)
                            }.contentShape(Rectangle())
                        }.buttonStyle(.plain)
                        Divider()
                    }
                }
    }
    private var researchSection: some View {
                VStack(alignment: .leading, spacing: 12) {
                    Text("Research alongside").font(.title3.weight(.semibold)).accessibilityAddTraits(.isHeader)
                    if let research = ResearchFixtures.records.first(where: { $0.surface == "Research" }) {
                        Button { open(research) } label: {
                            Label(research.title, systemImage: "books.vertical")
                        }.buttonStyle(.bordered)
                        Text("Historical proposals retain their source and validation limits.").font(.caption).foregroundStyle(.secondary)
                    }
                    Divider().padding(.vertical, 4)
                    Label("Fixture contract accepted", systemImage: "checkmark.seal").font(.headline)
                    Text("Synthetic example contract. Live runtime integration still requires separate evidence and review.")
                        .font(.callout).foregroundStyle(.secondary)
                }
    }
    private func stat(_ title: String, count: Int) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(count, format: .number).font(.title2.monospacedDigit().weight(.semibold))
                .contentTransition(reduceMotion ? .identity : .numericText())
            Text(title).font(.caption).foregroundStyle(.secondary)
        }.frame(maxWidth: .infinity, alignment: .leading)
            .accessibilityElement(children: .ignore)
            .accessibilityLabel("\(count) \(title)")
    }
}
