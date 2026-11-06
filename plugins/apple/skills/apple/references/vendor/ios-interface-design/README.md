# iOS Interface Design

An agent skill for designing and implementing iPhone and iPad interfaces in SwiftUI or UIKit. It helps establish a coherent visual direction, refine existing screens, and review visual quality while preserving native interaction behavior.

## Install

Run `npx skills add tn/ios-interface-design` and select your coding agent.

The [skills CLI](https://github.com/vercel-labs/skills) supports agents including Claude Code, Codex, and Cursor. To inspect the package before installing, run `npx skills add tn/ios-interface-design --list`.

## Use

Ask your agent to use `ios-interface-design` with a concrete task, for example:

- “Use ios-interface-design to build a SwiftUI habit tracker with a warm editorial style.”
- “Use ios-interface-design to refine this settings screen while preserving its existing behavior.”
- “Use ios-interface-design to review this iPad flow for hierarchy, consistency, and accessibility. Report findings without editing files.”

Supply the existing project, screenshots, design references, or brand constraints when available. Explicit product choices take precedence over the skill's aesthetic defaults.

## What it covers

- Visual direction, style families, composition, typography, and semantic colors.
- Grouping, headings, optical alignment, backgrounds, and image behavior.
- Native controls, navigation, motion, haptics, and loading stability.
- Consistency across screens, Dynamic Type, localization, and accessibility.
- Visual review with evidence appropriate to the requested change.

The skill supports distinctive styles as well as restrained interfaces. It does not prescribe one appearance for every product. Games, marketing screenshots, websites, and nonvisual maintenance are outside its scope.

## Structure and tools

[SKILL.md](SKILL.md) contains the core workflow and links to focused guides in [references/](references/). Agents load those guides only when relevant to the task.

No particular plugin or paid service is required. For implementation and verification, the agent uses the project's available Apple build, preview, simulator, and accessibility tools. Optional integrations are described in [Tool workflow](references/tool-workflow.md).

## License

[MIT](LICENSE)
