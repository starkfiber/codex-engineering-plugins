import Foundation
public struct Transfer: Sendable {
    public let received: Int64
    public let total: Int64?
    public init(received: Int64, total: Int64?) { self.received = max(0, received); self.total = total }
    public var fraction: Double? {
        guard let total, total > 0 else { return nil }
        return min(1, Double(received) / Double(total))
    }
    public func remainingSeconds(bytesPerSecond: Double) -> Double? {
        guard let total, total > 0, bytesPerSecond > 0, bytesPerSecond.isFinite else { return nil }
        return Double(max(0, total - received)) / bytesPerSecond
    }
}
