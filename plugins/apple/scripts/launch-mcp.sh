#!/bin/sh
set -eu
task_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
# Prefer a known compatible runtime; never install dependencies or evaluate shell input.
for task_node in "${APPLE_BLUEPRINT_NODE:-}" /opt/homebrew/opt/node@22/bin/node /usr/local/opt/node@22/bin/node node; do
    [ -n "$task_node" ] || continue
    if "$task_node" -e 'if (Number(process.versions.node.split(".")[0]) < 22) process.exit(1)' >/dev/null 2>&1; then
        exec "$task_node" "$task_root/scripts/mcp-server.mjs" --stdio
    fi
done
echo 'Apple Blueprint requires a working Node 22+. Set APPLE_BLUEPRINT_NODE to its executable path.' >&2
exit 1
