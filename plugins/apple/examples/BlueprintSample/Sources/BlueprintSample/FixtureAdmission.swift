import Foundation

public enum FixtureAdmissionError: Error, Equatable {
    case inputTooLarge, unsupportedSchema, notFixture, tooManyRecords, invalidResult
}

/// Bounded admission for local fixture v1, not permission to connect runtime data.
public enum FixtureAdmission {
    public static let maximumBytes = 1_048_576
    public static let maximumEvents = 4_096

    public static func decode(_ data: Data) throws -> ContractExport {
        guard data.count <= maximumBytes else { throw FixtureAdmissionError.inputTooLarge }
        struct Header: Decodable { let schemaVersion: String; let proofKind: String }
        let decoder = JSONDecoder()
        let header = try decoder.decode(Header.self, from: data)
        guard header.schemaVersion == "apple-diagnostics-fixture/1" else { throw FixtureAdmissionError.unsupportedSchema }
        guard header.proofKind == "local-fixture-not-runtime-proof" else { throw FixtureAdmissionError.notFixture }
        let fixture = try decoder.decode(ContractExport.self, from: data)
        guard fixture.events.count + (fixture.conflictingEvents?.count ?? 0) <= maximumEvents,
              fixture.metrics.count <= 256, fixture.results.count <= 256 else {
            throw FixtureAdmissionError.tooManyRecords
        }
        for result in fixture.results {
            let id = result.correlationId.trimmingCharacters(in: .whitespacesAndNewlines)
            let validStatus = (result.backendStatus == "unavailable-after-restart" && result.effectVerification == "unknown")
                || (result.backendStatus == "reported-completed" && result.effectVerification == "unverified")
            guard !id.isEmpty, id.utf8.count <= 256, result.persistenceKind == "process-local", validStatus else {
                throw FixtureAdmissionError.invalidResult
            }
        }
        return fixture
    }
}
