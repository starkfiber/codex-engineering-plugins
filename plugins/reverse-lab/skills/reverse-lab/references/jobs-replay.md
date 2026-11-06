# Durable jobs and reviewed replay packs

These are dependency-free Node helpers. Use a working installed Node runtime. Each job reserves its directory permanently before spawning a process; a second start at the same path fails instead of duplicating work. Commands are explicit executable paths and argument arrays, never shell strings.

## Job lifecycle

Create a reviewed JSON spec:

```json
{"command":"/absolute/path/to/node","args":["/absolute/path/to/reviewed-test.mjs"],"cwd":"/absolute/project"}
```

Compute its SHA-256 after reviewing its contents, then run:

```text
node <skill>/scripts/jobs.mjs start ABS_JOB_DIR SPEC.json --review-sha256 SHA
node <skill>/scripts/jobs.mjs status ABS_JOB_DIR
node <skill>/scripts/jobs.mjs reconcile ABS_JOB_DIR
```

`start` waits for the child and records `job.json`, `stdout.log` and `stderr.log`. Success requires exit code zero and verified process-group disappearance. Nonzero child exit, spawn failure and unverified cleanup are reported. CLI exit codes: 0 for completed with verified cleanup; 2 for any other observed state; 1 for malformed input or invocation failures.

If the owner crashes, the child can continue. `reconcile` checks recorded process existence; it labels an active orphan `orphan-running`, or an absent orphan `interrupted`, never `completed` without an observed exit result. It does not kill or redispatch anything. PID existence is conservative and does not prove ownership; PID reuse can keep a case blocked rather than cause an unsafe action. Starting again at the reserved path remains prohibited. Review retained outputs and cleanup, then use a new job directory for an intentional retry.

Cleanup scope: on macOS/Linux, a child starts in its own process group and absence of that group is verified. A descendant that deliberately detaches into another process group is outside that proof. Windows currently records direct-child exit but leaves descendant cleanup unverified, so it does not produce a fully verified replay success. Do not claim whole-system cleanup or Windows qualification from the Mac tests.

## Replay pack

`replay.mjs` checks artifact identity, optional JSON version assertions, then runs reviewed steps serially. It stops on the first failure or unverified cleanup. Put output outside the global plugin. Existing output directories are not overwritten.

```json
{
  "schemaVersion": 1,
  "name": "Reviewed application behavior",
  "artifacts": [
    {"path":"/absolute/app.asar","sha256":"64 lowercase hexadecimal characters"},
    {"path":"/absolute/package.json","sha256":"64 lowercase hexadecimal characters","version":{"field":"version","expected":"2.1.6"}},
    {"path":"/absolute/replay-test.mjs","sha256":"64 lowercase hexadecimal characters"}
  ],
  "steps": [
    {"id":"behavior","spec":{"command":"/absolute/path/to/node","args":["/absolute/replay-test.mjs"],"cwd":"/absolute/project"}}
  ]
}
```

```text
node <skill>/scripts/replay.mjs PACK.json ABS_OUTPUT --review-sha256 SHA
```

Artifacts must be regular files with matching SHA-256. Version assertions read the declared dotted field from JSON; they do not infer app versions from filenames. Include the app and executable test scripts in the artifact list, and review any other commands, dependencies or side effects. The SHA argument acknowledges the exact reviewed pack; it is not an independent security approval or sandbox.

Output includes the exact reviewed pack, `results.json`, and per-step job ledgers/logs. Results report the verified artifact identities and each step's observed exit/cleanup state. The pack name is not evidence of test coverage; inspect the actual test assertions and limitations.

For the Etcher case, build a local pack referencing its installed ASAR and the delivered `replay-compatibility.mjs` and `replay-labels.cjs`. Both use the existing local ASAR library and their documented dependency adaptations. Their known webpack boundaries are specific to the recorded app version. A changed app hash must block replay until extraction assumptions are reviewed.

## Executed validation

`test-jobs-replay.mjs` covers successful job/log capture, failed child, duplicate concurrent dispatch, spawn failure, interrupted-owner/orphan reconciliation, unrelated working directory, unreviewed pack refusal, changed artifacts, version mismatch, first-failure stop and shell-option rejection. Tests use temporary files and ordinary harmless child processes, with cleanup after completion.

Independent review found and fixed two real defects before release: output containment now resolves dot segments and existing symlink ancestors; pinned inputs are rehashed after every step and at finalization. A successful child exit with changed/missing pinned input fails replay and blocks following steps. Intentionally generated outputs must not be listed as immutable inputs. The expanded suite passes 14 checks, including these regressions. The Etcher four-step pack passed again from `/tmp` in run-2 with every input integrity check and process-group cleanup check true.
