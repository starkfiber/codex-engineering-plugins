import Testing
@testable import BlueprintSample
@Test func unknownSizeHasNoInventedPercentageOrETA() {
    let transfer = Transfer(received: 1024, total: nil)
    #expect(transfer.fraction == nil)
    #expect(transfer.remainingSeconds(bytesPerSecond: 200) == nil)
}
@Test func knownTransferClampsAndCalculatesRemainingTime() {
    #expect(Transfer(received: 50, total: 100).fraction == 0.5)
    #expect(Transfer(received: 150, total: 100).fraction == 1)
    #expect(Transfer(received: 50, total: 100).remainingSeconds(bytesPerSecond: 10) == 5)
    #expect(Transfer(received: 50, total: 100).remainingSeconds(bytesPerSecond: 0) == nil)
}
