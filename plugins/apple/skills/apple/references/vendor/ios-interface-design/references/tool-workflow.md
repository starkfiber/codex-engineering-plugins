# Tool workflow

Read this file when selecting tools for visual evidence. Use the tools available in the current environment. Do not assume that the environment includes a named integration or exposes its tools.

## Select tools by the evidence needed

| Evidence | Tool option | Limitation |
| --- | --- | --- |
| Rendered screen and interaction | XcodeBuildMCP or the project's existing simulator tools. | Check available capabilities before selecting commands. |
| Variants of a view | Xcode Previews. | A preview does not establish that the complete navigation flow works. |
| Labels, text clipping, and contrast issues | Accessibility Inspector. | Automated findings do not replace manual checks of the experience. |
| Structure and appearance of a supplied Figma design | Figma MCP. | Use it only when the task includes a relevant Figma reference. |

Keep these integrations optional. Do not install tools or change project configuration solely to complete this checklist. When a tool is unavailable, use an available alternative. State which evidence you could not retrieve.

## Capture a useful comparison

For a refinement, capture the existing screen when possible. For a new screen, capture the first representative implementation.

1. Select the intended screen and state.
2. Record the device or viewport, appearance, text size, locale, and sample data.
3. Build the app with the project's available tools.
4. Launch the app.
5. Navigate to the selected state.
6. Wait for the relevant content to settle within the project's normal timeout.
7. Capture the screen.
8. Check the capture against the design statement.

Use available readiness signals instead of arbitrary delays. Report a loading failure if the content does not become ready.

Keep the comparison conditions consistent after a change. Do not confuse different data or scroll positions with a design improvement. Record changed conditions when an exact comparison is unavailable.

Capture the result again after material changes under the same conditions.

## Check variants and interactions

Use preview data that stays separate from production data. Xcode supports configurable previews and separate sample data. See [Xcode Previews](https://developer.apple.com/documentation/xcode/adding-previews-to-your-interface-files).

[XcodeBuildMCP](https://www.xcodebuildmcp.com/docs/cli) provides simulator and UI automation commands. Discover the installed version's commands before using them. Do not copy an assumed command signature from memory.

Use [Accessibility Inspector](https://developer.apple.com/documentation/accessibility/accessibility-inspector) when available for relevant accessibility checks. Preserve its reported findings separately from your visual judgments.

## Use a supplied Figma reference

Retrieve both design context and a screenshot of the relevant frame when the integration supports them. Use the same frame for both requests. Retrieve relevant assets when needed. Check access and export limitations in the tool result.

Figma MCP exposes [design context and screenshot tools](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/). Tool output can use web-oriented structures. Translate the design into the project's native framework. Do not replace a native iOS implementation with web code because the reference tool returned it.

## Report evidence precisely

Record the screen, state, comparison conditions, observed defect, and result of each material fix. Keep tool findings separate from your visual judgments.
