import SwiftUI
public struct TransferView: View {
    public let transfer: Transfer
    public init(transfer: Transfer) { self.transfer = transfer }
    public var body: some View {
        VStack(alignment: .leading) {
            Text("Download").font(.headline)
            if let fraction = transfer.fraction {
                ProgressView(value: fraction).accessibilityLabel("Download progress")
            } else {
                ProgressView().accessibilityLabel("Downloading; total size unknown")
            }
            Text(transfer.received, format: .byteCount(style: .file)).font(.caption)
        }.padding()
    }
}
