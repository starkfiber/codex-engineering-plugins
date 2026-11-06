# Firmware research and device operations

IPSW is a device-specific restore archive, not source code for iOS. A downloadable archive is not proof of current restore eligibility. Verify product type, build, integrity, current signing/personalization and compatibility with the exact target. Obtain official files through Apple-hosted links; preserve TLS validation and source provenance. Never infer signing from download availability or a stale badge.

Use `scripts/apple.mjs inspect-ipsw` to list archive entries only. Incomplete files will fail archive validation; do not report them as verified firmware. Do not execute extracted content. Validate manifests and archive paths before any later extraction; guard against traversal, symlink escapes and decompression limits.

Tool choices from the reviewed sources:
- idevicerestore: primary open-source restore engine candidate; compile dependencies first. A restore can erase data. Match the exact target and current user-authorized operation before execution.
- DFUUtility: native Mac workflow candidate with identity/session modeling; test fixture parsing and planning before device use. A DFU transition or restore is a separate operational action.
- iExtractor: historical extraction reference; current IPSW/encryption support requires testing on the chosen archive.
- IPSW-CLI: do not adopt unchanged. The reviewed source disables TLS verification and appends resumed responses without first requiring HTTP 206; notifications interpolate strings into script code. Root has no explicit license.
- iOS-OTA-Downgrader and XPwn: legacy references; their supported devices do not establish modern iPhone support. Do not use them as an iPhone 14 downgrade path.

Firmware research does not authorize restoration of any connected device. No device is selected by enumeration order. Preserve backups, exact device identity, restore window and recovery instructions when a device operation is actually requested. No Apple firmware is bundled in this plugin.
