# Blender Asset Lab · 0.1.0-alpha.1

A Codex skill for constructing and verifying game-ready Blender assets, with focused topology/material/export references and an executable scene audit. This package contains original workflow guidance and audit code; it does not bundle Blender, game assets or a third-party MCP server.

```sh
codex plugin add blender@engineering-plugins --json
```

Install the repository's marketplace first as described in its root README. Refresh the chat, then ask: “Use $blender-3d-asset-generation to create a simple original prop with a triangle budget, export glTF and verify a clean re-import.” Existing Blender is required for bpy execution. A connected Blender MCP is optional and separate; this plugin registers no MCP engine.

Run the audit inside Blender, using a new report path:

```sh
blender --background asset.blend --python skills/blender-3d-asset-generation/scripts/audit_blender_asset.py -- --output report.json --max-triangles 5000 --require-uv
blender --background --python tests/blender_smoke.py
```

Commands run from this plugin directory. The smoke test creates a disposable cube, verifies a passing audit, then requires failures for an exceeded triangle budget and unapplied scale. The audit does not prove engine performance, rig deformation, material fidelity or re-import correctness; inspect those in the target engine. It reports source mesh data, so modifier-evaluated geometry still needs separate review.

Original instructions, helper and icon are MIT licensed. Blender and any user-selected assets retain their own licenses. The bundled references link official Blender material; they are not copied manuals. Public alpha, tested with Blender5.2.1LTS; record the Blender version with contributed results.
