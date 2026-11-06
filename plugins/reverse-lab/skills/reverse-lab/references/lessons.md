# Techniques established by executed cases

These are scoped observations, not universal rules. Add a lesson only with a concrete reproduction, a correction and evidence of its check.

- **Etcher 2.1.6 / REA 6.8.0:** a successful summary view concealed heap exhaustion and zero parsed JS. Gate the underlying application/semantic coverage using coverage.mjs. Narrowing reviewed modules completed application-graph analysis; semantic completeness remained unknown.
- **Etcher UI on this Mac:** clicking Flash from file changed focus without opening the picker; Tab/Return activation opened it. After refreshing current UI state, try a supported keyboard action and observe the actual resulting window. Do not assume clicks succeeded.
- **Invalid-image handling:** a zero-filled image stalled selection; a formatted MBR/FAT test image completed the UI flow. Preserve both outcomes. Our flasher must expose validation failures/cancellation rather than leave an indefinite disabled state. This is a product requirement, not a patch to Etcher.
- **Evidence persistence:** fresh nested paths, malformed/relative indexes, pruned IDs, empty indexes and macOS path aliases broke v2 case assumptions. Case helper regression tests now cover those exact boundaries.
- **UI-to-code trace:** the visible Reverse-L…Image.dmg label matched the actual shipped function. Saved AX assertions prove that captured flow; a replay of those assertions is not a fresh GUI run.
- **Installation:** a registration failure must restore existing configuration and source; commented TOML examples must not be treated as enabled settings. Installer tests inject those failures before global installation.
- **Jobs:** a disappeared owner does not prove a child stopped or succeeded. Reconcile live/stale state; never blindly redispatch or terminate an unrelated process.

Original case evidence is in the local Etcher proof/UI deliverables created on 2026-11-02. Revalidate artifact identity before carrying these findings to another app version.
