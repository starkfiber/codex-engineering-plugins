import BlueprintSample
import Foundation
precondition(Transfer(received: 1024, total: nil).fraction == nil)
precondition(Transfer(received: 1024, total: nil).remainingSeconds(bytesPerSecond: 200) == nil)
precondition(Transfer(received: 50, total: 100).fraction == 0.5)
precondition(Transfer(received: 150, total: 100).fraction == 1)
precondition(Transfer(received: 50, total: 100).remainingSeconds(bytesPerSecond: 10) == 5)
precondition(Transfer(received: 50, total: 100).remainingSeconds(bytesPerSecond: 0) == nil)
print("PASS: six transfer-model behavior checks")
precondition(ResearchFixtures.records.count == 13)
precondition(ResearchFixtures.records.allSatisfy { !$0.isVerifiedResult })
precondition(ResearchFixtures.records.first { $0.id == "receipt-failed" }?.displayStage == "Unverified result")
precondition(ResearchFixtures.filtered(surface: "Scheduler", query: "").count == 1)
precondition(ResearchFixtures.filtered(surface: "Overview", query: "not-a-fixture").isEmpty)
precondition(ResearchFixtures.filtered(surface: "Agents & Gates", query: "predictor").count == 1)
print("PASS: six research-state and filtering checks")
let projected = EdgeFixtures.projection
precondition(projected.events.count == 2)
precondition(projected.duplicateCount == 1)
precondition(projected.ambiguousSequenceCount == 1)
precondition(projected.events.allSatisfy { $0.originalTimestamp == nil })
precondition(ObservedMetric(value: 0, origin: .measured).label == "0 · measured")
precondition(ObservedMetric(value: 5, origin: .defaulted).label == "5 · defaulted")
precondition(ObservedMetric(value: nil, origin: .unavailable).label == "Unavailable")
precondition(ResultAvailability.processLost.rawValue == "Unavailable after process restart")
let crossStream = ObservedEvent(projectID: "fixture", streamID: "stream-b", eventID: "event-a", sequence: 12, originalTimestamp: nil, payloadDigest: "fixture-a")
precondition(EventProjection([EdgeFixtures.events[0], crossStream]).duplicateCount == 0)
let conflicting = ObservedEvent(projectID: "fixture", streamID: "stream-a", eventID: "event-a", sequence: 12, originalTimestamp: nil, payloadDigest: "changed")
precondition(EventProjection([EdgeFixtures.events[0], conflicting]).conflictingIdentityCount == 1)
precondition(ResearchFixtures.records.first { $0.id == "anchor-scope" }?.isVerifiedResult == false)
precondition(ObservedMetric(value: .nan, origin: .measured).label == "Unavailable")
print("PASS: twelve event, timestamp, metric, recovery and anchor edge checks")
precondition(ResearchFixtures.filtered(surface: "Overview", query: "").first?.id == "receipt-failed")
precondition(ResearchFixtures.records.first { $0.id == "result-lost" }?.stage == .observation)
precondition(EventProjection([]).events.isEmpty)
precondition(ResearchFixtures.records.first { $0.id == "anchor-scope" }?.fields.contains { $0.label == "Omitted example" && $0.value.contains("candidates") } == true)
print("PASS: four operations-ordering, empty-state and disclosure checks")
let encoder = JSONEncoder()
encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
let contractData = try encoder.encode(ContractExport.fixture)
let decoded = try JSONDecoder().decode(ContractExport.self, from: contractData)
precondition(EventProjection(decoded.events).events.count == 2)
precondition(decoded.metrics.first?.label == "0 · measured")
precondition(decoded.results[0].backendStatus == "unavailable-after-restart")
precondition(decoded.results[1].effectVerification == "unverified")
precondition(decoded.events.allSatisfy { $0.timestampOrigin == "unknown" })
print("PASS: five exported-contract roundtrip checks")
let eventData = try encoder.encode(EdgeFixtures.events[0])
var malformed = try JSONSerialization.jsonObject(with: eventData) as! [String: Any]
malformed["timestampOrigin"] = "observed-now"
precondition((try? JSONDecoder().decode(ObservedEvent.self, from: JSONSerialization.data(withJSONObject: malformed))) == nil)
malformed["timestampOrigin"] = "unknown"
malformed["sequence"] = -1
precondition((try? JSONDecoder().decode(ObservedEvent.self, from: JSONSerialization.data(withJSONObject: malformed))) == nil)
malformed["sequence"] = 12
malformed["eventId"] = ""
precondition((try? JSONDecoder().decode(ObservedEvent.self, from: JSONSerialization.data(withJSONObject: malformed))) == nil)
print("PASS: three malformed-event rejection checks")
precondition(EdgeFixtures.conflictProjection.events.count == 1)
precondition(EdgeFixtures.conflictProjection.conflictingVersions.count == 1)
precondition(EdgeFixtures.conflictProjection.conflictingVersions[0].count == 2)
precondition(EdgeFixtures.conflictProjection.conflictingVersions[0].map(\.payloadDigest) == ["fixture-a", "fixture-a-changed"])
let knownTime = ObservedEvent(projectID: "fixture", streamID: "stream-a", eventID: "known-time", sequence: 13, originalTimestamp: Date(timeIntervalSince1970: 1000), payloadDigest: "fixture-known")
let knownRoundtrip = try JSONDecoder().decode(ObservedEvent.self, from: encoder.encode(knownTime))
precondition(knownRoundtrip.originalTimestamp == knownTime.originalTimestamp)
precondition(knownRoundtrip.timestampOrigin == "producer-supplied-unverified")
precondition(ResearchFixtures.filtered(surface: "Overview", query: "conflicting content").first?.id == "identity-conflict")
precondition(EventProjection([EdgeFixtures.changedEvent, EdgeFixtures.events[0]]).conflictingVersions[0].count == 2)
precondition(EventProjection(decoded.conflictingEvents ?? []).conflictingVersions.first?.count == 2)
print("PASS: nine conflict-preservation and known-time checks")
let motionCases: [(Bool, Bool, Bool, Bool)] = [
    (true, false, true, true), (true, true, true, false),
    (true, false, false, false), (true, true, false, false),
    (false, false, true, false), (false, true, true, false),
    (false, false, false, false), (false, true, false, false)
]
for (enabled, reduced, active, expected) in motionCases {
    precondition(AmbientMotion.isActive(enabled: enabled, reduceMotion: reduced, sceneActive: active) == expected)
}
print("PASS: eight ambient motion preference, accessibility and lifecycle checks")
precondition((try? FixtureAdmission.decode(contractData).events.count) == 3)
func admissionFailure(_ changes: (inout [String: Any]) -> Void) throws -> Bool {
    var object = try JSONSerialization.jsonObject(with: contractData) as! [String: Any]
    changes(&object)
    return (try? FixtureAdmission.decode(JSONSerialization.data(withJSONObject: object))) == nil
}
precondition((try? admissionFailure { $0["schemaVersion"] = "apple-diagnostics-fixture/2" }) == true)
precondition((try? admissionFailure { $0["proofKind"] = "runtime-verified" }) == true)
precondition((try? FixtureAdmission.decode(Data(contractData.dropLast(12)))) == nil)
precondition((try? FixtureAdmission.decode(Data(repeating: 32, count: FixtureAdmission.maximumBytes + 1))) == nil)
precondition((try? admissionFailure { object in
    var results = object["results"] as! [[String: Any]]
    results[1]["effectVerification"] = "verified"
    object["results"] = results
}) == true)
precondition((try? admissionFailure { object in
    let event = (object["events"] as! [[String: Any]])[0]
    object["events"] = Array(repeating: event, count: FixtureAdmission.maximumEvents + 1)
}) == true)
precondition((try? admissionFailure { object in
    var results = object["results"] as! [[String: Any]]
    results[0]["correlationId"] = "  "
    object["results"] = results
}) == true)
print("PASS: eight fixture admission, corrupt-input and false-proof rejection checks")
if CommandLine.arguments.contains("--emit-contract") { print(String(decoding: contractData, as: UTF8.self)) }
