# Executed VM milestone — 2026-11-03

The Master USB prototype now has a real two-entry GRUB menu on one remastered ARM64 UEFI optical image. Alpine 3.24.3 and 3.23.7 each reached a live installer shell, reported the exact expected release and repository, ran setup-alpine help and powered off cleanly under QEMU. This is live installer availability, not an installed OS.

Local deliverables: `case://local/Codex/2026-11-02/https-github-com-morluto-rea-https/outputs/master-usb-vm`. Read README.md for build.mjs/verify-boot.mjs usage, proof-summary.json for results and SOURCES-LICENSES.md for provenance. Scripts remain in the project distribution; they are not bundled into this skill. The image is local engineering material, not a qualified public redistribution.

Techniques established:
- Keep bootloader menu display, selected kernel, selected userspace/repository, installer availability and installed-OS proof distinct.
- Multi-release Alpine media needs explicit entry-specific repository and modloop paths. Actual guest mount was /media/cdrom; assuming /media/sr0 failed into recovery. Preserve that failed transcript.
- Match an exact guest release field; a version string in the echoed kernel command line can falsely pass a substring check.
- Hash the exact final image for every run; rebuilds can differ, so an earlier image's review does not qualify the final artifact.
- Require guest shutdown plus owned QEMU process exit; no remaining VM process is a separate cleanup observation.

Current scope: ARM64 QEMU virt/UEFI optical boot. It does not establish native Apple startup, physical USB, x86/Windows compatibility, Secure Boot enforcement or complete OS installation. The earlier PC-style target plan was superseded by this concrete ARM64 qualification.

Next: adapt guest media discovery for a virtual USB-storage presentation and prove it before a physical USB backend; separately qualify x86 and Windows. Do not assume optical /media/cdrom paths work unchanged on USB. No host device paths may be passed to the file-backed VM harness.
