# Durable investigations

Persist at meaningful milestones, before a long external operation, and before yielding with incomplete work. An abrupt provider stop may prevent a final save, so do not defer all persistence to the end.

Keep a concise checkpoint with:
- Original objective, current scope and completion criteria.
- Target identity/version/digest and evidence index location.
- Verified findings and unresolved hypotheses, separately.
- Changes made, checks run and their actual results.
- Failed approaches and why repeating them unchanged would not help.
- Running job/session IDs with last observed state and cleanup ownership.
- Next executable step, exact blocker if any, and authorization still needed.

On resume, read the checkpoint and evidence index, verify referenced artifacts, and recheck relevant live state. A previous permission must match the current action and scope. Changed artifacts invalidate dependent conclusions until rechecked; retained evidence from another version is not current evidence.

Use bounded queries, excerpts and paging; preserve full results in project-local files when permitted. Reference files rather than replaying giant outputs. Summaries must retain uncertainty and links to decisive evidence. Do not upload case material to shared memory by default.

If rate-limited, honor an explicit retry interval where the tool supports it; avoid loops and unsolicited recurring jobs. If context is exhausted or the session ends, provide the checkpoint path and a resume prompt. This reduces lost work but cannot guarantee uninterrupted execution or remove model limits.

Suggested resume request:
“Use Reverse Lab to resume the case at [absolute case path]. Verify target identity and evidence, read checkpoint.md, and continue the next incomplete step within the recorded scope.”
