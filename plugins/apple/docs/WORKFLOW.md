# Working with Apple Blueprint

## A complete task

1. Establish the app, platforms, target SDKs and intended user outcome.
2. Inspect existing source, architecture, tests and project instructions. Route only relevant references.
3. Define observable acceptance: what the user can do, error states, accessibility and recovery.
4. Implement the smallest coherent change. Preserve the chosen product identity.
5. Run local checks and builds. Fix failures before expanding scope.
6. Exercise actual UI behavior on supported simulators/devices. Record build identity, conditions and observations.
7. Deliver the change with evidence, limitations and a tested rollback path.

## Useful requests

- “Audit this screen for Dynamic Type, keyboard behavior and interrupted animations; implement and verify the fixes.”
- “Investigate stutter using native traces. Report capture latency separately from app frame timing.”
- “Review payment return handling. Use sandbox fixtures and test duplicate callbacks without charging anyone.”
- “Prepare a release and identify exactly which device and distribution gates remain.”

## Performance workflow

Start with the native workload and instrument it. Attribute UI preparation, render work, GPU execution and presentation separately. Remote screenshots are not a native FPS benchmark. Bound capture and display queues, preserve input order, pause idle work and verify recovery after interruption. Record thermal state only when actually measured.

Use subtle motion to explain continuity and state. Respect Reduce Motion; avoid perpetual animation solely to make a screen appear active. A faster preview is not proof of a faster application.

## Release and rollback

Pin the plugin version and preserve the previous installed package. Run repository validation before publishing. Reconnect/reload the plugin through the host and verify tool discovery; copying guidance into an older cache does not activate a new version. Roll back by selecting the prior package and repeat tool discovery. Never alter signing, device trust or production data as a side effect of a documentation upgrade.

## Evidence language

Use **implemented**, **locally tested**, **built**, **visually observed**, **device tested** and **release qualified** distinctly. Missing traces and unavailable devices are pending evidence, not passing outcomes. Keep private screenshots, raw device identifiers, customer records and signing materials outside public releases.
