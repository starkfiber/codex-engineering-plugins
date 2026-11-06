# Optical details

Read this file after the screen's hierarchy and grouping work. Optical alignment concerns perceived alignment, which can differ from the bounds of a shape.

## Align visible content

Use native alignment guides before adding offsets. Align related text by its baseline when the text sizes differ. A baseline is the line on which most letters rest. Centering text containers can leave their text visibly misaligned.

For repeated rows, check these anchors:

- The leading edge of primary text.
- The baseline of the primary value.
- The trailing edge of comparable amounts.
- The inset of separators relative to their content.

Use leading and trailing alignment for layouts that support different reading directions. Do not insert spaces into strings to align columns. Recheck alignment after text wraps or changes size.

## Balance symbols and text

Equal bounding boxes do not guarantee equal visual weight. A filled symbol can appear heavier than an outline symbol. A narrow symbol can appear smaller than a broad symbol.

1. Check the symbol variant for the intended role.
2. Match its weight to adjacent text where appropriate.
3. Adjust its scale if the emphasis still differs.
4. Check the result at the intended display size.

Preserve the control's hit area while adjusting the visible symbol. Prefer SF Symbols metrics over arbitrary offsets. Add a local optical adjustment only when a rendered comparison supports it. Check that adjustment with supported text sizes and symbol variants.

Apple documents [symbol weights and scales](https://developer.apple.com/design/human-interface-guidelines/sf-symbols) for matching symbols with text.

## Balance padding and shapes

Judge padding around visible content, not only around its layout frame. Check multiline labels separately from single-line labels. Do not force identical padding when native controls already account for their content.

When a rounded control sits inside a rounded surface, compare the visible gap around their corners. For concentric circular corners, subtracting the inset from the outer radius can provide a starting estimate. This estimate does not describe every continuous corner or capsule. Check the actual render before changing radii.

Do not add nested decorative surfaces to demonstrate this geometry. Do not override component shapes solely to match a formula. The selected style can require square corners, hard outlines, or other custom geometry. Check those shapes against the style specification.

## Check at useful scales

Check the whole screen at its intended display size first. Use enlarged crops to locate a suspected mismatch. Return to the whole screen before deciding whether the mismatch matters.

Do not optimize only for a magnified screenshot. Do not apply compensating offsets across every row when the alignment model is wrong.

