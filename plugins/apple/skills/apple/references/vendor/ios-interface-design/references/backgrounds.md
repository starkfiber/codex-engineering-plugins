# Backgrounds

Read this file when choosing or changing a screen background. Define what the background contributes before selecting an effect. The background can support hierarchy, express a material, establish atmosphere, or represent meaningful content.

## Exclude arbitrary blurred shapes

Do not add blurred circles, glowing blobs, or isolated radial patches merely to fill space. Do not disguise the same composition with a mesh gradient. A generic glow behind a heading does not establish a visual direction.

This rule concerns decorative filler. A visible sun, a data field, or an intentional lighting effect can belong to meaningful content. Preserve such elements when they serve the actual product. Explain their role in the style specification.

Do not confuse a translucent material with a blurred background ornament. A material separates layers while allowing underlying content to remain perceptible.

## Choose a background treatment

| Treatment | Suitable purpose | Constraint |
| --- | --- | --- |
| Solid fill | Support reading, repeated data, forms, or a graphic style. | Use a deliberate semantic color. A flat background is a complete choice. |
| Smooth linear gradient | Establish a directional color transition or restrained atmosphere. | Define the colors, stops, direction, and text regions. |
| Mesh gradient | Support a visual system that needs multidirectional color transitions. | Keep the composition intentional. Avoid arbitrary hotspots behind controls. |
| Gradient with grain | Express a chosen tactile or printed treatment. | Keep the grain subtle and stable. Apply it only to the background. |
| Texture or pattern | Express a specific material or brand vocabulary. | Define scale and repetition. Keep detail away from small text. |
| Relevant image or scene | Represent the product's actual subject. | Preserve a readable region for text and controls. Follow the existing asset rules. |
| Translucent material | Preserve context between overlapping layers. | Select material behavior by role, not by a desired tint. |

Use only the treatments that fit the chosen style. A brutalist interpretation can use flat fields and hard divisions. An editorial interpretation can use a quiet solid or restrained paper texture. Neither requires gradients or grain.

## Design gradients as compositions

1. Choose colors from the permitted palette.
2. Define the direction or spatial distribution of the transition.
3. Reserve readable regions for primary content and controls.
4. Check the result at the intended screen size.

Prefer the simplest gradient that expresses the intended effect. Do not combine several gradients, glows, and textures without separate roles. Check intermediate colors as well as endpoints. A readable endpoint does not guarantee readable text elsewhere.

Keep gradient coordinates stable unless the product requires change. Do not regenerate random colors or positions during view updates. Respect the existing restrictions on purple gradients and neon effects.

## Use grain deliberately

Grain is small variation in the background's pixels. It is optional texture, not a requirement for visual quality. This research does not establish grain as a widespread iOS trend.

- Define grain scale, strength, distribution, and behavior in each supported appearance.
- Prefer neutral grain unless colored variation serves the chosen material.
- Keep small labels, icons, separators, and focus indicators free from the grain overlay.
- Check for visible tiling, excessive speckling, and interference with thin strokes.
- Keep static grain stable between frames.
- Reuse the texture or cached result instead of generating noise during every view update.

Do not add strong grain to conceal gradient banding. Check the gradient rendering, color transitions, and export first. If fine noise helps, compare the result at device scale. Decorative grain and technical dithering have different purposes.

## Preserve readability and behavior

Check contrast in the regions where foreground content can actually appear. Include scrolling positions and expanded text. For animation, check the changing background behind the content.

Fix weak contrast through the background, foreground colors, or a suitable local surface. Do not compensate with tiny text, heavy text shadows, or another decorative blur.

Define variants deliberately for the app's supported appearances. Do not add a new appearance mode during a narrow background fix. Provide suitable behavior for Increase Contrast and Reduce Transparency. For animated backgrounds, respect Reduce Motion. Do not introduce perpetual background animation without a product reason.

Keep decorative layers outside hit testing and accessibility navigation. Extend the background through safe areas when appropriate. Keep interactive content within its required insets.

## Sources and iOS references

- [Apple materials guidance](https://developer.apple.com/design/human-interface-guidelines/materials) distinguishes content surfaces from the floating control layer. It also describes contrast behavior for translucent materials.
- [SwiftUI drawing and graphics](https://developer.apple.com/documentation/swiftui/drawing-and-graphics) documents native gradient and background primitives.
- [MeshGradient](https://developer.apple.com/documentation/swiftui/meshgradient) provides a grid of positioned colors. API availability does not make a gradient appropriate for every screen.
- [Lumy's iPhone imagery](https://lumy.app/images/lumy_new_2025.png) shows sky transitions associated with solar information. The inspected image set belongs to 2025. It is a contextual example, not evidence of a new 2026 trend.

The grain recommendations above are this skill's design guidance. Do not attribute them to Apple or infer them from promotional image compression.
