# Physical iPhone SOP

Use for a real iPhone, WebDriverAgent (WDA), signing, screenshots and device cleanup.

## Establish identity and preserve state
Record model, OS/build, selected UDID in private evidence, app bundle/version/build, install source, Xcode build and helper version. Never select the first attached device. Preserve the installed store app, its login and data. Do not uninstall it to make testing easier.

## Prepare a separately signed helper
Verify Developer Mode, pairing/trust and compatible developer disk support. Use the installed Xcode SDK and an authorised development team. Helper signing is not the target app's distribution identity. The user completes Apple authentication and device trust. Bind any forwarded WDA port to loopback only. Verify the selected device and current WDA session before every action batch.

For launch failures capture the exact error first. A runtime repair proven on one Xcode/iOS pair is not a general recipe: use only matching official Xcode runtime libraries, preserve entitlements, re-sign and verify the helper. Do not disable signing checks. Record whether xcodebuild or an alternate XCTest launcher actually worked.

## Bounded run
Capture before/after native screenshots, route, keyboard state and test action. Keep device inputs serial. Do not enter bank credentials, trigger real payments or mutate customer balances as a diagnostic shortcut. Record fixtures distinctly from real account evidence.

## Close out
Stop only the exact forwarding, streaming and test-runner processes started by this run. Terminate the test helper when finished, retain its installation if requested. Confirm the user app and profile remain intact. Record pending checks honestly. See payment-returns.md and motion-device-evidence.md.

For executed controller and launcher findings, read [iphone-controller-lessons.md](iphone-controller-lessons.md).
