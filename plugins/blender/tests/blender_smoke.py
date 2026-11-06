"""Run with Blender --background --python tests/blender_smoke.py."""
from pathlib import Path
import json
import runpy
import sys
import tempfile
import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.mesh.primitive_cube_add()
audit = runpy.run_path(str(Path(__file__).resolve().parents[1] / "skills/blender-3d-asset-generation/scripts/audit_blender_asset.py"))
with tempfile.TemporaryDirectory() as temp:
    output = Path(temp) / "audit.json"
    sys.argv = ["blender", "--", "--output", str(output), "--max-triangles", "12", "--require-uv"]
    assert audit["main"]() == 0
    report = json.loads(output.read_text())
    assert report["passed"] and report["summary"]["triangles"] == 12
    sys.argv = ["blender", "--", "--output", str(output), "--max-triangles", "1"]
    assert audit["main"]() == 2
    assert not json.loads(output.read_text())["passed"]
    bpy.context.active_object.scale.x = 2
    sys.argv = ["blender", "--", "--output", str(output), "--require-applied-scale"]
    assert audit["main"]() == 2
print("PASS: actual Blender scene audit accepts a valid cube and rejects budget/scale failures")
