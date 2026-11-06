# Contributing

Report a concrete bug, missing evidence or useful workflow improvement in Issues. Include the plugin/version, exact non-sensitive command or tool arguments, expected and observed behavior, source/build identity and primary references. Retain failures and distinguish observation from inference. No secret, proprietary artifact or precise personal data belongs in an Issue.

Edit the matching plugin under plugins/. Keep skill entrypoints focused; place task-specific detail in supporting references. Do not bundle the upstream REA engine or new third-party material without reviewing its license and preserving attribution. Selected Apple vendors stay pinned and intact; update their provenance and license files together.

Run `node scripts/check.mjs` on existing Node22+; no npm install is needed for core checks. For reviewed changes regenerate manifests with `node scripts/manifest.mjs --write`, then rerun checks. Job/replay tests execute disposable owned local children. They do not authorize arbitrary user code or live targets. No credentials, engine installation or device deployment is part of default CI.

A pull request should explain the concrete change, evidence, checks actually run and limitations. Review updates before merging; do not relabel static/synthetic tests as runtime, Windows or physical-device proof. Version plugins independently and preserve previous tags for rollback. Contributions of original material use MIT; identify upstream licenses separately. No CLA/DCO is imposed.
