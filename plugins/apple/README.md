# Apple Blueprint · 2.0.0-alpha.4

A Swift/native Apple development workflow with focused references and three local read-only MCP tools. Invoke `$apple` after installation and refresh the chat. It routes macOS, iOS, iPadOS, watchOS, tvOS, visionOS, extensions and firmware questions to relevant guidance; it is not Apple OS source or an exhaustive offline SDK.

- `apple_route`: reference routing with reasons.
- `apple_inspect_project`: bounded configuration/source heuristics for a selected local project.
- `apple_sha256`: streamed selected-file digest, optionally compared with an expected digest.
- `apple://registry`: routing/provenance resource.
- `apple_native_review`: native review prompt.

These tools do not build, restore firmware, deploy to hardware or establish App Review acceptance. An existing Node22+ runs the local server; Xcode/SDKs and actual devices are separate. No API key is required by these helpers.

```sh
node skills/apple/scripts/apple.mjs route 'Build a watchOS workout app'
node skills/apple/scripts/apple.mjs doctor
node scripts/mcp-server.mjs --stdio
```

The marketplace registers the portable launch script. Standalone clients may configure command `node` with `/absolute/repository/plugins/apple/scripts/mcp-server.mjs --stdio`; avoid duplicate registrations. Review discovered schemas for exact arguments. Start with a route, inspect the actual project and record compiler, UI and hardware outcomes separately.

Selected upstream MIT specialist references remain intact, with exact revisions and full licenses in skills/apple/registry.json and THIRD_PARTY_NOTICES.md. Other linked tools are references, not bundled installers. The included macOS Swift sample uses synthetic fixtures and a generic example-client contract; it does not connect to a real phone or private operating-system service.

Run the real sample tests from the repository root:

```sh
node plugins/apple/scripts/test-swift.mjs
swift run --package-path plugins/apple/examples/BlueprintSample BehaviorCheck
```

On a Mac using Command Line Tools, the helper supplies the selected toolchain's built-in Swift Testing framework and runtime search paths. It installs nothing and changes no global developer selection. Full Xcode uses its normal Swift Testing integration. See the upstream [Swift Testing distributions guide](https://github.com/swiftlang/swift-testing/blob/main/Documentation/Distributions.md).

This is a **public alpha**. Current helper/compiler checks and bounded macOS UI results do not certify every platform. Firmware preflight deliberately does not establish restore/signing eligibility. The [full V3 contract](docs/V3-EXIT-CONTRACT.md) is retained; [qualification](docs/V3-QUALIFICATION.md) identifies the open gates. See docs/STATUS.md and the repository's shared contribution/security guidance.
