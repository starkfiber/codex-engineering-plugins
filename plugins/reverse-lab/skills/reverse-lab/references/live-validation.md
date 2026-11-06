# Real-application validation

Choose a concrete feature and an installed or user-provided artifact. Record app version, artifact digest, relevant module/function and locator units (byte offset, UTF-16 offset, line or symbol). Do not label string offsets as byte offsets.

Use actual REA analysis when available, retain its complete result and inspect coverage/unknowns. An MCP handshake or tools/list is a connection check, not a completed investigation. If native client tools are not attached, a tested CLI or explicit local stdio client can provide real analysis; label the transport used and do not claim the chat acquired native tools.

For behavior checks, use the smallest reviewed execution unit. Inspect an extracted function/module before running it; do not bootstrap the application bundle to obtain one export. Preserve source identity and list mocked dependencies. A language VM timeout is an execution control, not an OS security boundary; use appropriate isolation for untrusted code. Execution must stay within the current authorized task.

Test a representative success, relevant boundary and failure case. Compare expected behavior to actual results; retain surprising behavior and distinguish a faithful reconstruction from an intentional improvement. Mocks limit what a test can prove.

Report proof level explicitly:
- Static artifact analysis: shipped code was inspected.
- Isolated behavior: extracted shipped code ran under documented test inputs.
- Integration: interacting components ran together.
- Full application: the actual app's user workflow ran and its outcome was observed.

Do not promote one level to another. Choose the level needed for the requested claim. Avoid exercising destructive app workflows merely to improve a test label.

Exercise persistence as part of the case: index decisive files, verify from another working directory/process, and demonstrate that changed or missing evidence invalidates verification. Resume from checkpoint and revalidate the target before reusing conclusions. An empty or malformed evidence index is not a successful proof.

## Partial results and memory failures

Check underlying graph/semantic coverage, parsed/skipped source counts and limitations, not just `isError` or a summary view's `complete-within-view` status. A successful protocol response can contain zero parsed sources after a worker runs out of memory. Preserve that partial result, mark affected conclusions unknown and choose a narrower reviewed module or source slice. Record extraction provenance and any syntax wrapper before analyzing the reduced artifact. Completion of a reduced artifact does not establish full-app coverage. Increase resources only when justified and available; do not retry an unchanged failing full bundle indefinitely.
