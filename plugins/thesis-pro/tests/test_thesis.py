import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

SERVER = Path(__file__).resolve().parents[1] / "scripts" / "thesis_pro_mcp.py"
spec = importlib.util.spec_from_file_location("thesis", SERVER)
thesis = importlib.util.module_from_spec(spec)
with patch.dict(os.environ, {"THESIS_PRO_HOME": tempfile.gettempdir()}):
    spec.loader.exec_module(thesis)


class ThesisTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        thesis.ROOT = (Path(self.temp.name) / "projects").resolve()
        self.project = thesis.tool_create({"title": "Synthetic library accessibility study", "target_words": 5000})["project"]
        self.pid = self.project["id"]

    def tearDown(self):
        self.temp.cleanup()

    def test_budget_persistence_and_export(self):
        self.assertEqual(sum(c["target_words"] for c in self.project["chapters"]), 5000)
        thesis.tool_save_section({"project_id": self.pid, "chapter": 1, "section_title": "Proposal", "content": "Synthetic example only. No participants or results."})
        dashboard = thesis.tool_dashboard({"project_id": self.pid})
        self.assertGreater(dashboard["words"], 0)
        exported = thesis.tool_export({"project_id": self.pid})
        self.assertIn("Synthetic example only", Path(exported["path"]).read_text())

    def test_export_traversal_rejected(self):
        for name in ("../outside.md", "/tmp/outside.md", "nested/file.md", "..\\outside.md", "\0bad"):
            with self.subTest(name=name), self.assertRaises(ValueError):
                thesis.tool_export({"project_id": self.pid, "filename": name})

    def test_identity_and_symlink_boundaries(self):
        for pid in ("../other", "", "a/b", "a.b"):
            with self.assertRaises(ValueError):
                thesis.project_path(pid)
        outside = Path(self.temp.name) / "outside"
        outside.mkdir()
        (thesis.ROOT / "linked").symlink_to(outside, target_is_directory=True)
        with self.assertRaises(ValueError):
            thesis.load_project("linked")
        path = thesis.project_path(self.pid)
        data = json.loads(path.read_text())
        data["id"] = "different"
        path.write_text(json.dumps(data))
        with self.assertRaises(ValueError):
            thesis.load_project(self.pid)

    def test_atomic_failure_preserves_previous_project(self):
        path = thesis.project_path(self.pid)
        before = path.read_bytes()
        with patch.object(thesis.os, "replace", side_effect=OSError("synthetic interruption")):
            with self.assertRaises(OSError):
                thesis.tool_save_section({"project_id": self.pid, "chapter": 1, "section_title": "Draft", "content": "Replacement"})
        self.assertEqual(path.read_bytes(), before)
        self.assertEqual(list(path.parent.iterdir()), [path])

    def test_audit_and_source_identity(self):
        issues = thesis.tool_audit({"project_id": self.pid})
        self.assertFalse(issues["passed"])
        with self.assertRaises(ValueError):
            thesis.tool_add_claim({"project_id": self.pid, "claim": "Synthetic", "source_ids": ["unknown"]})
        source = thesis.tool_add_source({"project_id": self.pid, "citation": "Synthetic fixture; not a real publication", "verified": False})["source"]
        thesis.tool_add_claim({"project_id": self.pid, "claim": "Illustrative claim", "source_ids": [source["id"]]})
        self.assertIn("sources", [x["area"] for x in thesis.tool_audit({"project_id": self.pid})["issues"]])

    def test_argument_types(self):
        for name, args in (("add_source", {"project_id": self.pid, "citation": "Fixture", "verified": "false"}), ("create_project", {"title": "Fixture", "target_words": True})):
            with self.assertRaises(ValueError):
                thesis.handle({"method": "tools/call", "params": {"name": name, "arguments": args}})

    def test_stdio_isolated_startup(self):
        requests = [{"jsonrpc": "2.0", "id": 1, "method": "initialize"}, {"jsonrpc": "2.0", "id": 2, "method": "tools/list"}, {"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "list_projects", "arguments": {}}}]
        env = dict(os.environ, THESIS_PRO_HOME=str(Path(self.temp.name) / "empty"))
        run = subprocess.run([sys.executable, str(SERVER)], input="\n".join(map(json.dumps, requests)) + "\n", text=True, capture_output=True, env=env, timeout=10, check=True)
        replies = [json.loads(line) for line in run.stdout.splitlines()]
        self.assertEqual(replies[0]["result"]["serverInfo"]["version"], "0.2.0-alpha.1")
        self.assertEqual(len(replies[1]["result"]["tools"]), 10)
        self.assertEqual(replies[2]["result"]["structuredContent"]["projects"], [])


if __name__ == "__main__":
    unittest.main()
