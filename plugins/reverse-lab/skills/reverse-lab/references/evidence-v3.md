# V3 evidence gates and claim invalidation

## Check REA coverage

```text
node <skill>/scripts/coverage.mjs <REA-evidence.json> [application|semantic|runtime]
```

Accepts the recorded REA MCP result envelope, its raw Evidence object, or a text-only MCP evidence response. Current supported operations are `analyze_javascript_application` and its `inspect_analysis_view` summary. Unknown schemas, invalid identity and malformed coverage fail explicitly; other REA operations need a supported adapter rather than assumed success.

Exit status: 0 = requested gate passes; 2 = recognized evidence fails the gate; 1 = malformed/unsupported input or CLI failure. The report always names the artifact digest and scope. `application` is the default, measuring reported source parsing and application-graph coverage. It does not establish runtime behavior, semantic completeness or any claim's truth. The `semantic` gate also requires complete semantic coverage. Static evidence cannot pass `runtime`.

The real Etcher renderer summary says `complete-within-view` even though its worker ran out of memory and parsed zero files. The checker rejects that result. The reduced-module result passes only the application gate; its semantic coverage is **unknown**, so its semantic gate fails. Retain that distinction in reports.

## Compare versions and invalidate claims

```text
node <skill>/scripts/compare.mjs <before-manifest.json> <after-manifest.json> <claims.json>
```

Both manifests use this shape, with stable artifact IDs across versions:

```json
{
  "schemaVersion": 1,
  "target": "example-app",
  "version": "1.0",
  "artifacts": [{"id": "import-logic", "sha256": "64 lowercase hex characters"}]
}
```

Claims explicitly name every evidence dependency:

```json
{
  "schemaVersion": 1,
  "claims": [{
    "id": "C1",
    "statement": "The importer rejects malformed headers",
    "dependsOn": ["import-logic", "import-tests"]
  }]
}
```

Record real SHA-256 values from verified artifacts, not the illustrative placeholder. Include relevant test inputs, configuration and runtime conditions in the manifest or invalidate affected claims manually. The comparator does not read current artifact files, calculate hashes, or infer missing dependencies. Use the case helper to verify live evidence first.

Changed, removed or absent baseline dependencies mark the affected claim `needs-revalidation`; unchanged dependencies remain `unchanged-dependencies`, never automatically “proven.” Added artifacts are listed but do not silently become dependencies. Different target IDs, malformed hashes, duplicate IDs and dependency-free claims are rejected.

Exit status: 0 = no declared claim needs revalidation; 2 = one or more need revalidation; 1 = malformed input/CLI failure. An empty claims collection has no claims to validate; it is not a proof of application correctness.

## Executed validation

Run `node <plugin>/test-evidence-v3.mjs <directory-containing-REA-fixtures>` with `rea-renderer-partial.json` and `rea-analysis.json` from the Etcher proof directory. Without the directory argument, the test looks for adjacent `../etcher-v2-proof`.

28 checks passed using both real recorded REA responses and synthetic version manifests. Tests cover scope-sensitive pass/fail, runtime rejection, malformed schemas, integrity contradictions, cross-version claim invalidation and actual CLI exit codes from an unrelated working directory. Version comparison was tested with synthetic two-version manifests, not two real Etcher releases.
