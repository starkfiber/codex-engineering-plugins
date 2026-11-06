import Foundation

/// Local UI projection v1. Provisional until primary ExampleClient confirms the runtime contract.
/// All examples are invented fixtures inspired by recovered source observations.
public enum EvidenceStage: String, Codable, CaseIterable, Sendable {
    case observation = "Observation"
    case historical = "Historical claim"
    case simulation = "Simulation"
    case proposal = "Proposed action"
    case confirmed = "Confirmed result"
}

public struct DiagnosticRecord: Identifiable, Codable, Sendable {
    public let id: String
    public let surface: String
    public let title: String
    public let summary: String
    public let stage: EvidenceStage
    public let producer: String
    public let source: String
    public let snapshot: String
    public let runID: String?
    public let receiptVerified: Bool
    public let fields: [DiagnosticField]

    /// A declared result without a verified receipt is visibly unverified.
    public var displayStage: String {
        stage == .confirmed && !receiptVerified ? "Unverified result" : stage.rawValue
    }
    public var isVerifiedResult: Bool { stage == .confirmed && receiptVerified }
}
public struct DiagnosticField: Codable, Sendable {
    public let label: String
    public let value: String
    public init(_ label: String, _ value: String) { self.label = label; self.value = value }
}

public enum ResearchFixtures {
    public static let attentionIDs = ["receipt-failed", "identity-conflict", "stream-ambiguity", "result-lost", "metric-origin", "timestamp-unknown", "anchor-scope"]
    public static let surfaces = ["Overview", "Research", "Tasks & Ledger", "Scheduler", "Agents & Gates"]
    public static let records: [DiagnosticRecord] = baseRecords + EdgeFixtures.records
    private static let baseRecords: [DiagnosticRecord] = [
        .init(id: "research-optics", surface: "Research", title: "Optical compute architecture", summary: "Recovered research proposes optical tensor operations and a conventional runtime. Performance claims need independent experiments.", stage: .historical, producer: "Recovered document", source: "VOIKE optical-compute paper · opening pages reviewed", snapshot: "Recovery snapshot · 31 July 2026", runID: nil, receiptVerified: false, fields: [.init("Coverage", "Targeted review; not a complete validation"), .init("Authorship", "Named authors in recovered PDF; not independently authenticated"), .init("Availability", "Local recovered artifact"), .init("Hardware evidence", "Unavailable")]),
        .init(id: "task-proposal", surface: "Tasks & Ledger", title: "Reduce scheduler timelines", summary: "The historical agent records a proposed optimization. Its execution stub does not establish an applied runtime change.", stage: .proposal, producer: "Fixture agent observation", source: "vvm/ai/jarvis.py · source review", snapshot: "Local fixture projection v1", runID: "fixture-run-01", receiptVerified: false, fields: [.init("Observed", "High CPU threshold triggered (fixture)"), .init("Requested change", "Timeline count → 2"), .init("Attempt", "Not executed"), .init("Result receipt", "None"), .init("Rollback", "Not applicable; no change made")]),
        .init(id: "receipt-failed", surface: "Tasks & Ledger", title: "Receipt verification failed", summary: "A claimed completion cannot become a confirmed result when its receipt fails validation.", stage: .confirmed, producer: "Fixture receipt validator", source: "Synthetic invalid receipt", snapshot: "Local fixture projection v1", runID: "fixture-run-02", receiptVerified: false, fields: [.init("Sequence", "12 (fixture)"), .init("Receipt", "Digest mismatch"), .init("Execution", "Unknown"), .init("Interpretation", "Unverified; investigate source event")]),
        .init(id: "schedule-partial", surface: "Scheduler", title: "Four schedules evaluated", summary: "Duration and deadline estimates compare task orderings. Simulating an ordering does not execute task callbacks.", stage: .simulation, producer: "Fixture scheduler", source: "vvm/scheduler/ttcs.py · source review", snapshot: "Local fixture projection v1", runID: "fixture-schedule-01", receiptVerified: false, fields: [.init("Requested timelines", "6"), .init("Evaluated timelines", "4"), .init("Missing evaluations", "2"), .init("Objective", "Estimated seconds + 1000 × missed deadlines"), .init("Selected ordering", "Deadline first (illustrative)"), .init("Executed callbacks", "0")]),
        .init(id: "gate-rejected", surface: "Agents & Gates", title: "No eligible candidate", summary: "All candidates failed their gate. Historical fallback selection must not be presented as an approved plan.", stage: .proposal, producer: "Fixture candidate inspector", source: "src/semantic_kernel/vasvel.ts · source review", snapshot: "Local fixture projection v1", runID: "fixture-gate-01", receiptVerified: false, fields: [.init("Candidates", "3"), .init("Eligible", "0"), .init("Reason", "Cost or risk exceeded gate"), .init("Historical fallback", "First candidate may still be selected"), .init("UI outcome", "No approved selection")]),
        .init(id: "gate-empty", surface: "Agents & Gates", title: "No candidates supplied", summary: "An empty candidate set is distinct from a set whose members were rejected.", stage: .proposal, producer: "Fixture candidate inspector", source: "Synthetic empty candidate set", snapshot: "Local fixture projection v1", runID: "fixture-gate-02", receiptVerified: false, fields: [.init("Candidates", "0"), .init("Decision", "Unavailable"), .init("Recovery", "Supply candidate plans before evaluation")]),
        .init(id: "predictor-unavailable", surface: "Agents & Gates", title: "Predictor unavailable", summary: "The recovered forecasting implementation is a placeholder. A series of zero values is not evidence of a trained forecast.", stage: .historical, producer: "Source review", source: "voike/jarvis/ml.py · source review", snapshot: "Recovery snapshot · 31 July 2026", runID: nil, receiptVerified: false, fields: [.init("Detector", "Rolling statistical anomaly detector"), .init("Predictor training", "Placeholder"), .init("Forecast", "Hidden: no validated predictor"), .init("Telemetry freshness", "Stale fixture; timestamp unknown")])
    ]
    public static func filtered(surface: String, query: String) -> [DiagnosticRecord] {
        let matches = records.filter { (surface == "Overview" || $0.surface == surface) && (query.isEmpty || ($0.title + " " + $0.summary + " " + $0.source).localizedCaseInsensitiveContains(query)) }
        guard surface == "Overview" else { return matches }
        return matches.sorted {
            let lhs = attentionIDs.firstIndex(of: $0.id) ?? ($0.surface == "Research" ? 100 : 50)
            let rhs = attentionIDs.firstIndex(of: $1.id) ?? ($1.surface == "Research" ? 100 : 50)
            return lhs == rhs ? $0.title < $1.title : lhs < rhs
        }
    }
}
