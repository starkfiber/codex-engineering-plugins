# Case files

Choose a project-owned directory, typically `.reverse-lab/<case-name>`. Use the current project's retention rules. Do not put client cases inside the global plugin or upload them to shared memory.

Run with an existing compatible Node runtime:

```text
node <skill-directory>/scripts/case.mjs init <absolute-case-directory> <objective>
node <skill-directory>/scripts/case.mjs record <absolute-case-directory> <absolute-evidence-file> <claim-or-description>
node <skill-directory>/scripts/case.mjs verify <absolute-case-directory>
```

`init` creates case.json, evidence.json and checkpoint.md without replacing an existing directory. Edit checkpoint.md as work progresses; case.json holds the initial objective. Keep requirements/tests/council notes only when they serve the investigation.

`record` fingerprints the actual file and stores its absolute path, byte count, SHA-256, recording time and description. Record retained tool output files as well as target artifacts when useful. The description is an analyst claim, not verified fact. Files remain where they are; the helper does not copy or upload them. Avoid storing credentials or ambient environment dumps.

`verify` rehashes indexed files and returns a nonzero exit code if any file is missing, changed or unreadable. Hash agreement establishes byte identity only; it does not establish provenance, sufficient coverage or truth. A live website may change despite unchanged saved output; record capture time and URL separately.

The helper uses an exclusive writer lock. If a concurrent writer exists, it fails rather than overwriting the index. Investigate a stale lock before removing it; do not remove a lock belonging to an active process.

The helper creates missing parent directories while preserving exclusive case creation. It validates every evidence entry before reads/writes: unique ID, absolute path, SHA-256, byte count, description and timestamp. IDs advance above the highest existing ID. `verify` returns `status:empty`, `evidencePresent:false` and exit code 2 for an empty index; only a nonempty, unchanged index returns success. Malformed indexes fail explicitly rather than resolving paths against the caller's current folder.
