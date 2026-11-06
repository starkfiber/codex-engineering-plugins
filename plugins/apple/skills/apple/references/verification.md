# Verification and delivery

Run `node scripts/apple.mjs doctor` from the skill directory to inventory tools without modifying them. Use the existing project's build/test commands. Discover schemes and available destinations before selecting a simulator. A Command Line Tools installation can compile many Mac Swift packages but does not supply all Xcode SDKs or simulator runtimes.

For this plugin's synthetic sample, run `node ../../scripts/test-swift.mjs` from the skill directory. On a selected Command Line Tools installation it checks for the built-in Testing framework and interop library and supplies both search paths. A `no such module Testing` error does not by itself prove the framework is absent; supplying only the framework path can compile and still fail at runtime. Prefer the project's normal configuration for other projects. See the plugin's `docs/V3-QUALIFICATION.md` for current acceptance limits; native AX inspection alone does not establish VoiceOver behavior.

Record these independent evidence levels: source review; syntax/static checks; compiled target; unit tests; simulator interaction; physical-device interaction; signed/package/distribution verification. Never upgrade one level to another in the handoff.

For a change, reproduce the relevant failure and verify acceptance behavior. In UI work inspect the affected screen and states; test keyboard/focus and accessibility proportional to the change. For a menu-bar utility confirm the actual item and popover visually, launch the packaged app through Launch Services, and exercise quit/relaunch. Building a bare executable is not installation.

For all-platform claims build every claimed target with the applicable SDK and run platform-specific interactions. When hardware or SDKs are missing, label those rows untested. Do not create fabricated pass reports.

Review signing identity, entitlements, sandbox/network/file permissions and distribution method before packaging. Keep test fixtures separate from production data. Store credential-free checkpoints in the project: outcomes, evidence paths, failures/corrections and next steps. The plugin does not install privileged helpers, erase devices, publish builds or enroll devices as part of ordinary validation.
