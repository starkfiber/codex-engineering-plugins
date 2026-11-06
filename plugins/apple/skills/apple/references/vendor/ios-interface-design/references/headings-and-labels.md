# Headings and labels

Read this file when naming screens, sections, groups, or fields. Each visible title should identify a distinct scope or help the user act. A visual container does not automatically need a heading.

## Give each level a purpose

| Level | Purpose | Rule |
| --- | --- | --- |
| Screen title | Identify the destination, object, or task. | Do not repeat it in a decorative content heading immediately below. |
| Section heading | Distinguish a meaningful group from nearby content. | Include it when it adds scope, orientation, or useful navigation. |
| Field label | Identify the value or setting that the user controls. | Keep it specific enough to remain understandable during input and review. |
| Helper text | Explain a constraint, consequence, or unfamiliar choice. | Do not restate the label in a complete sentence. |

Do not create every level merely because a component template includes it. Use spacing and alignment for groups that need no additional name.

## Remove repeated meaning

Check the screen title, section heading, field label, and helper text together. Identify the information that each one adds. Remove a title if it contributes no useful distinction.

Check near-duplicates as well as exact matches. Adding “settings,” “details,” “information,” or “preferences” does not automatically create a different meaning. Do not rename a redundant heading merely to avoid identical wording.

For a section with one field, prefer the field label when the heading repeats its meaning. Remove the redundant heading. Preserve the layout grouping if it still helps.

A section with several fields can also lack a useful heading. Conversely, a single-field section can need a heading for scope or navigation. Decide from the information relationship, not a fixed field count.

## Examples

The arrows below indicate nesting, not text to insert into the interface.

| Before | After | Reason |
| --- | --- | --- |
| Profile → Profile details → Display name | Profile → Display name | The middle heading adds no scope for this single field. |
| Notifications → Notification settings → Push notifications | Notifications → Push notifications | The section repeats the screen's purpose. |
| Delivery → Delivery information → Delivery address | Delivery → Delivery address | Remove the section while keeping the precise field label. |
| Preferences → Theme → App theme | Preferences → App theme | One clear setting label replaces two names for the same setting. |
| Checkout → Billing address → Street, City | Keep the group when a Shipping address group also exists. | The heading distinguishes fields with similar names and different purposes. |

Apply these changes only when the stated context matches the actual interface. Do not add fields from an example to the product.

## Preserve useful labels

Keep a field understandable after its placeholder disappears. Do not use the current value or an example value as its only name. Do not replace a precise label with “Value” merely to remove shared words.

A screen title and a field label can share words when each serves a necessary role. A separate sheet may repeat an object name to preserve context. The same navigation title can appear in expanded and collapsed states. These cases do not automatically require different wording.

Use one visible label when a persistent heading can identify a single control without ambiguity. Keep that control's accessible name explicit. Do not assume that visual proximity establishes the accessibility relationship.

Preserve separate actions and field semantics when removing group headings. Avoid adding duplicate accessibility announcements through both a label and a redundant hint. Keep accessible names aligned with useful visible labels.

## Check the result in context

1. Read the visible hierarchy in order.
2. Check what each title contributes beyond its parent.
3. Remove redundant headings before shortening useful field labels.
4. Check the result with populated fields, long text, and relevant localization.
5. Check accessible names and reading order when tools permit.

Do not perform a global string deletion to remove duplicate words. Similar labels can belong to different objects or tasks. Fix the redundant relationship within the affected scope.
