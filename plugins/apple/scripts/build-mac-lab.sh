#!/bin/sh
set -eu
task_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
task_sample="$task_root/examples/BlueprintSample"
cd "$task_sample"
swift build --product BlueprintDemo
task_bin=$(swift build --show-bin-path)
task_app="$task_root/dist/Apple Blueprint Lab.app"
mkdir -p "$task_app/Contents/MacOS"
cp "$task_bin/BlueprintDemo" "$task_app/Contents/MacOS/BlueprintDemo"
cp "$task_sample/Info.plist" "$task_app/Contents/Info.plist"
/usr/bin/plutil -lint "$task_app/Contents/Info.plist"
/usr/bin/codesign --force --sign - "$task_app"
/usr/bin/codesign --verify --strict "$task_app"
echo "Built and ad-hoc signed: $task_app"
