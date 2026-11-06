import Foundation

public struct ObservedEvent: Sendable, Hashable, Codable {
    private enum CodingKeys: String, CodingKey {
        case projectID = "projectId", streamID = "streamId", eventID = "eventId"
        case sequence, originalTimestamp, payloadDigest, timestampOrigin
    }
    public let projectID: String
    public let streamID: String
    public let eventID: String
    public let sequence: Int
    public let originalTimestamp: Date?
    public let payloadDigest: String
    public let timestampOrigin: String
    public init(projectID: String, streamID: String, eventID: String, sequence: Int, originalTimestamp: Date?, payloadDigest: String) {
        self.projectID = projectID; self.streamID = streamID; self.eventID = eventID
        self.sequence = sequence; self.originalTimestamp = originalTimestamp; self.payloadDigest = payloadDigest
        self.timestampOrigin = originalTimestamp == nil ? "unknown" : "producer-supplied-unverified"
    }
    public var identity: [String] { [projectID, streamID, eventID] }
    public var timestampLabel: String { originalTimestamp?.formatted() ?? "Unknown original timestamp" }
    public init(from decoder: any Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        let project = try c.decode(String.self, forKey: .projectID)
        let stream = try c.decode(String.self, forKey: .streamID)
        let event = try c.decode(String.self, forKey: .eventID)
        let sequence = try c.decode(Int.self, forKey: .sequence)
        let time = try c.decodeIfPresent(Date.self, forKey: .originalTimestamp)
        let origin = try c.decode(String.self, forKey: .timestampOrigin)
        guard !project.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
              !stream.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
              !event.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
              sequence >= 0,
              origin == (time == nil ? "unknown" : "producer-supplied-unverified") else {
            throw DecodingError.dataCorrupted(.init(codingPath: decoder.codingPath, debugDescription: "Invalid event identity, sequence or timestamp origin"))
        }
        self.init(projectID: project, streamID: stream, eventID: event, sequence: sequence, originalTimestamp: time, payloadDigest: try c.decode(String.self, forKey: .payloadDigest))
    }
}

/// Never infer a global order from equal stream sequence numbers.
public struct EventProjection: Sendable {
    /// Preserve each differing version of a reused identity for inspection.
    public let conflictingVersions: [[ObservedEvent]]
    public let events: [ObservedEvent]
    public let duplicateCount: Int
    public let conflictingIdentityCount: Int
    public let ambiguousSequenceCount: Int
    public init(_ input: [ObservedEvent]) {
        var unique: [[String]: ObservedEvent] = [:]
        var output: [ObservedEvent] = []
        var duplicateCount = 0
        var conflicts = Set<[String]>()
        var versions: [[String]: [ObservedEvent]] = [:]
        for event in input {
            if let previous = unique[event.identity] {
                duplicateCount += 1
                if previous != event {
                    conflicts.insert(event.identity)
                    var values = versions[event.identity] ?? [previous]
                    if !values.contains(event) { values.append(event) }
                    versions[event.identity] = values
                }
            } else { unique[event.identity] = event; output.append(event) }
        }
        let groups = Dictionary(grouping: output) { [$0.projectID, $0.streamID, String($0.sequence)] }
        self.events = output; self.duplicateCount = duplicateCount
        conflictingIdentityCount = conflicts.count
        conflictingVersions = output.compactMap { versions[$0.identity] }
        ambiguousSequenceCount = groups.values.filter { $0.count > 1 }.count
    }
}

public enum MetricOrigin: String, Sendable, Codable { case measured, defaulted, smoothed, unavailable }
public struct ObservedMetric: Sendable, Codable {
    public let value: Double?
    public let metricOrigin: MetricOrigin
    public init(value: Double?, origin: MetricOrigin) { self.value = value; self.metricOrigin = origin }
    public var label: String {
        guard let value, value.isFinite, metricOrigin != .unavailable else { return "Unavailable" }
        return "\(value.formatted()) · \(metricOrigin.rawValue)"
    }
}

/// Interchange fixture only; backend-reported completion and effect verification are independent.
public struct RuntimeObservation: Codable, Sendable {
    public let correlationId: String
    public let persistenceKind: String
    public let backendStatus: String
    public let effectVerification: String
    public static let lost = RuntimeObservation(correlationId: "fixture-runtime-01", persistenceKind: "process-local", backendStatus: "unavailable-after-restart", effectVerification: "unknown")
    public static let completed = RuntimeObservation(correlationId: "fixture-runtime-02", persistenceKind: "process-local", backendStatus: "reported-completed", effectVerification: "unverified")
}

public struct ContractExport: Codable, Sendable {
    public let schemaVersion: String
    public let proofKind: String
    public let events: [ObservedEvent]
    public let conflictingEvents: [ObservedEvent]?
    public let metrics: [ObservedMetric]
    public let results: [RuntimeObservation]
    public static let fixture = ContractExport(schemaVersion: "apple-diagnostics-fixture/1", proofKind: "local-fixture-not-runtime-proof", events: EdgeFixtures.events, conflictingEvents: [EdgeFixtures.events[0], EdgeFixtures.changedEvent, EdgeFixtures.changedEvent], metrics: [.init(value: 0, origin: .measured), .init(value: 5, origin: .defaulted), .init(value: 3, origin: .smoothed), .init(value: nil, origin: .unavailable)], results: [.lost, .completed])
}

public enum ResultAvailability: String, Sendable {
    case notAttempted = "Not attempted"
    case processLost = "Unavailable after process restart"
    case reportedCompleted = "Backend-reported completion; effect unverified"
}

public enum EdgeFixtures {
    public static let changedEvent = ObservedEvent(projectID: "fixture", streamID: "stream-a", eventID: "event-a", sequence: 12, originalTimestamp: nil, payloadDigest: "fixture-a-changed")
    public static let conflictProjection = EventProjection([events[0], changedEvent, changedEvent])
    public static let events: [ObservedEvent] = [
        .init(projectID: "fixture", streamID: "stream-a", eventID: "event-a", sequence: 12, originalTimestamp: nil, payloadDigest: "fixture-a"),
        .init(projectID: "fixture", streamID: "stream-a", eventID: "event-a", sequence: 12, originalTimestamp: nil, payloadDigest: "fixture-a"),
        .init(projectID: "fixture", streamID: "stream-a", eventID: "event-b", sequence: 12, originalTimestamp: nil, payloadDigest: "fixture-b")
    ]
    public static let projection = EventProjection(events)
    public static let records: [DiagnosticRecord] = [
        .init(id: "identity-conflict", surface: "Tasks & Ledger", title: "One event identity, conflicting content", summary: "The same scoped event identity arrived with different content. Both versions are retained for review; the first is not silently promoted to truth.", stage: .simulation, producer: "Local conflict projection", source: "Synthetic repeated-identity fixture", snapshot: "Local edge-case fixtures", runID: "fixture-conflict-01", receiptVerified: false, fields: [.init("Conflicting identities", String(conflictProjection.conflictingIdentityCount)), .init("Preserved versions", String(conflictProjection.conflictingVersions.first?.count ?? 0)), .init("First payload token", events[0].payloadDigest), .init("Second payload token", changedEvent.payloadDigest), .init("Verification", "Unresolved; compare original producer evidence")]),
        .init(id: "stream-ambiguity", surface: "Tasks & Ledger", title: "Stream ordering needs review", summary: "Distinct events share a sequence. An inclusive cursor also repeated an event; unique identities remain visible without inventing order.", stage: .simulation, producer: "Local event projection", source: "src/streams/service.ts · archived source review", snapshot: "Local edge-case fixtures", runID: "fixture-stream-01", receiptVerified: false, fields: [.init("Input events", "3"), .init("Unique events", String(projection.events.count)), .init("Repeated identities", String(projection.duplicateCount)), .init("Ambiguous sequences", String(projection.ambiguousSequenceCount)), .init("Ordering", "Unresolved; both distinct events preserved")]),
        .init(id: "timestamp-unknown", surface: "Tasks & Ledger", title: "Original event time unknown", summary: "The event has no original timestamp. A local observation time cannot establish when it happened or whether telemetry is fresh.", stage: .simulation, producer: "Local time projection", source: "src/streams/service.ts · listEvents", snapshot: "Local edge-case fixtures", runID: "fixture-stream-01", receiptVerified: false, fields: [.init("Original time", events[0].timestampLabel), .init("Freshness", "Unknown"), .init("Time origin", "Not supplied; no current-time substitution")]),
        .init(id: "metric-origin", surface: "Agents & Gates", title: "Measured zero is still a measurement", summary: "Measured, defaulted and smoothed metrics retain their origin. Missing data is not drawn as a measured curve.", stage: .simulation, producer: "Local metric projection", source: "src/streams/service.ts · updateProfile", snapshot: "Local edge-case fixtures", runID: "fixture-metrics-01", receiptVerified: false, fields: [.init("Measured latency", ObservedMetric(value: 0, origin: .measured).label), .init("Historical default", ObservedMetric(value: 5, origin: .defaulted).label), .init("Smoothed estimate", ObservedMetric(value: 3, origin: .smoothed).label), .init("Missing metric", ObservedMetric(value: nil, origin: .unavailable).label)]),
        .init(id: "result-lost", surface: "Tasks & Ledger", title: "Runtime result no longer available", summary: "The historical runtime keeps results in memory. Losing the record after restart establishes neither successful nor failed execution.", stage: .observation, producer: "Local recovery fixture", source: "src/agents/runtime.ts · stats/getResult", snapshot: "Local edge-case fixtures", runID: "fixture-runtime-01", receiptVerified: false, fields: [.init("Availability", ResultAvailability.processLost.rawValue), .init("External effect", "Unknown"), .init("Persistence", "Process-local map"), .init("Recovery", "Reconcile durable evidence; do not blindly retry")]),
        .init(id: "anchor-scope", surface: "Tasks & Ledger", title: "Anchor covers selected fields", summary: "A digest of selected ledger fields is not full-record integrity or runtime replay. Omitted fields are explicitly outside this anchor’s coverage.", stage: .historical, producer: "Archived source review", source: "src/ledger/index.ts · anchorLedgerEntries/replayLedger", snapshot: "Recovery snapshot · 31 July 2026", runID: nil, receiptVerified: false, fields: [.init("Covered fields", "id, timestamp, chosen, energyAfter"), .init("Omitted example", "seed_state and candidates"), .init("Replay meaning", "Chronological stored-row query"), .init("Full-record verification", "Not established")])
    ]
}
