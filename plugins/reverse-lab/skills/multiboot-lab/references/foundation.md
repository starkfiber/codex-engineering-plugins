# Implemented multiboot foundation

The installed skill bundles two dependency-free Node helpers under its `scripts/` directory:

```text
node <skill>/scripts/master-usb.mjs plan <catalog.json>
node <skill>/scripts/master-usb.mjs copy <source> <NEW-destination.img> [publisher-sha256]
node <skill>/scripts/pack.mjs <catalog.json> <NEW-pack-directory>
```

`copy` supports new regular .img/.iso/.bin files only. It streams, hashes, fsyncs and verifies a full readback, with cancellation/failure cleanup. It refuses existing destinations and explicit device paths. Equal hashes prove byte identity, not authenticity or bootability.

`plan` uses declared byte counts; `pack` measures actual files and builds verified images plus menu.json, storage-plan.json and status.json. The menu is a bootloader-neutral catalog, not a firmware-rendered menu. A failed pack retains completed files for inspection and marks failure; abrupt-process resume is not implemented for this product.

Create a catalog in the current project with this shape, replacing illustrative values:

```json
{
  "capacityBytes": 34359738368,
  "reserveBytes": 536870912,
  "overheadPercent": 2,
  "images": [
    {"id":"linux-installer","title":"Linux installer","os":"linux","architecture":"x86_64","bytes":4294967296,"source":"/absolute/path/to/installer.iso"}
  ]
}
```

Reserve/overhead are configurable estimates, not a proven filesystem layout. Image count is bounded by space and compatible boot methods.

## Qualification and source

The original product distribution contains its example catalog, tests and results; they are not shipped inside this skill. On this Mac it is at `case://local/Codex/2026-11-02/https-github-com-morluto-rea-https/outputs/master-usb`. Its 16 copy/planning tests and 7 pack tests passed on macOS/Node 24.22.1. The installed copies are byte-identical to the tested helpers. Windows execution, bootloader integration, firmware boot, physical-device writing and product GUI are unqualified.

## Platform adapters

Microsoft's Windows installation-media route requires a filesystem/layout and handling FAT32's file-size constraints, including large WIM splitting: https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/install-windows-from-a-usb-flash-drive?view=windows-11 .

Apple's supported macOS installer flow uses a full installer and createinstallmedia, with compatible hardware/version and separate Apple-silicon/Intel startup requirements: https://support.apple.com/en-ie/101578 .

These official references were researched on 2026-11-02; check current requirements for implementation. A PC ISO menu is not evidence of Apple-silicon support. Next gate: a disposable virtual disk with a real bootloader menu and one verified Linux installer boot, followed by separately qualified Windows and macOS adapters.
