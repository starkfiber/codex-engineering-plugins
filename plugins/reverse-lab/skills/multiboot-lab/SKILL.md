---
name: multiboot-lab
description: Develop SFEBoot (formerly Master USB), our multiboot-first installer project, plan multiple installer images and verify file-backed image catalogs. Use for our flasher engineering and boot compatibility work; current helpers do not create bootable physical USB drives.
---

# Multiboot Lab

The chosen product direction is one USB boot menu with several installer images, with macOS and Windows host applications. Distinguish host OS, installer guest OS, CPU architecture, firmware, Secure Boot and physical storage compatibility. More images are limited by capacity and compatible boot methods; avoid “unlimited” claims.

Read [the implemented foundation](references/foundation.md) for the current CLI and constraints. `scripts/master-usb.mjs` and `scripts/pack.mjs` are original file-only prototype helpers. They support copy/readback verification and a neutral JSON catalog; they do not install a bootloader, modify physical drives or prove bootability. Use the scripts from this skill directory rather than assuming they are on PATH.

Use Reverse Lab's council, coverage checks, evidence cases and replay packs when investigating reference apps. Retain the distinction between shipped-function behavior, actual UI results and successful firmware boot. Apply observed design lessons; do not silently copy third-party implementation into our product.

For a new target combination, record host, firmware/CPU, image source/digest, boot method, storage layout and actual observed result. Use synthetic image files first, then disposable virtual disks, then a user-selected disposable physical device with exact identity and authorization before destructive writes. Do not infer authorization to erase a drive from a general request to improve this plugin.

Before claiming a bootable multiboot release, require a real firmware-rendered menu and at least one actual installer boot, plus documented supported combinations. Windows and macOS need distinct adapters; a generic PC ISO menu does not prove Apple-silicon support. Consult current official documentation for platform-specific behavior rather than assuming all images can use one loader.

Persist project-local findings and failures. Promote a new technique into the skill only after a demonstrated case and regression check, stating its scope and provenance. Keep source/installer payloads and private device metadata out of shared memory by default.

## Qualified virtual boot milestone

For boot-menu work, read [executed VM proof](references/vm-proof.md). Two ARM64 Alpine live installer entries have now booted from a combined optical image. That optical proof remains historical. SFEBoot 0.5 also has independently verified file-backed burn → actual QEMU USB mass-storage boot for both pinned Alpine entries. Read [USB acceptance](references/usb-acceptance.md) for the topology, strict proof rules and observed fixes. One physical USB image-prefix write/readback and subsequent QEMU boot of its captured bytes are now verified. Physical-computer boot and Windows VSS runtime remain unqualified.

For the current USB workflow prefer the separately installed SFEBoot CLI/MCP and its `sfeboot` skill. The legacy bundled catalog helpers remain file-only. This plugin does not bundle the SFEBoot runtime or turn those old helpers into a bootloader.

## PC and hardware learning (3.3)

SFEBoot 0.6 adds pinned Alpine x86_64 USB proof under both UEFI and legacy BIOS, alongside its ARM64 pair. EDK2 CODE and private VARS must be supplied separately. Exact command-line tokens, USB driver/ancestry/mount and clean shutdown are mandatory; prefix matches caused real false-positive bugs and now have regression cases.

A physical write/readback case used exact IORegistry BSD-media ancestry, hardware serial and registry-instance identity, user-approved erasure, an expiring source/device plan and local administrator execution. A separately captured image matched the written bytes and both ARM64 entries booted in QEMU. Distinguish this from booting physical firmware or testing all flash capacity. Never infer authorization for a different device from that past case.

For Windows, separately qualify Setup-only test media, complete installation media and a full installed VSS guest. A single GPT ESP allowed firmware boot but WinPE did not expose it as a normal volume; the corrected Windows adapter exposed a healthy removable source volume using Microsoft Basic Data FAT32 with removable UEFI fallback. Keep failed media and screenshots in local evidence. Do not claim a generated launch plan, a frozen boot screen or missing-media error is a usable installer. Follow the separately installed SFEBoot skill for current qualified recipes and VSS acceptance.

For browser-independent Windows tests, read [headless VSS lessons](references/headless-vss.md). Native startup-harness provisioning passed on a disposable copy; persisted Windows first-run setup blocked VSS execution. Preserve that failure and check readiness before reusing the method.
