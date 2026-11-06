# Source policy and updates

Pinned specialist revisions and licenses are in registry.json and THIRD_PARTY_NOTICES.md. The former private review inventory/logs are not bundled; read docs/STATUS.md at plugin root for current public scope. Research checkouts are local, excluded from distribution, and never auto-executed. Bundled MIT specialist references retain their original license files under `references/vendor/`.

Primary API/HIG authority: https://developer.apple.com/documentation/ and https://developer.apple.com/design/human-interface-guidelines. Swift language: https://docs.swift.org/swift-book/documentation/the-swift-programming-language/ and https://www.swift.org/documentation/. Apple open-source components: https://github.com/apple-oss-distributions (components, not the complete iOS product).

Update a reviewed checkout deliberately, record the new commit, compare instructions and licenses, rerun structural checks and relevant behavior checks, then change a pinned bundled reference. Do not silently update all sources or enable repository hooks/installers. A collection's root license does not replace per-component terms. Missing license evidence means reference/link only until permissions are resolved.

The mesh is selective: design craft from tn; reusable token and tvOS references from eworthing; HIG checked against Apple; collection used for discovery; firmware tools kept separate by device generation and actual capability. No source wins by star count, number of skills or claimed completeness.
