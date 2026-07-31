---
name: gh-create-issue
description: Draft and create focused GitHub Issues. Use when asked to turn work, a bug, a decision, or an investigation into a GitHub Issue; to prepare an issue title and body; or to open an approved issue. Keep issues concise, evidence-based, and ready for review.
---

# Create a GitHub Issue

Create a concise issue that makes the intended outcome, evidence, and quality bar clear. Prefer repository conventions over this skill.

## Gather context

Before drafting, read applicable repository instructions and issue templates. Inspect the relevant code, diff, tests, logs, and existing issues when available.

Never invent links, owners, evidence, priorities, labels, or test results. Mark missing evidence as an open question. Ask only for missing details that materially affect the issue, such as the repository or requested assignee, labels, milestone, project, or priority.

## Draft first

Draft the title and body for review. Do not create an issue unless the user explicitly asks to create it or approves the draft.

Use an action-first, specific title with no prefixes such as `[Task]`.

Use this structure, omitting empty sections:

```markdown
## Summary

State the current state, the problem or opportunity, and the requested outcome in two or three sentences.

## What / Why

- **Outcome** — name the affected artifact or workflow and the required change.
- **Scope** — group closely related implementation details in one line.
- **Evidence** — state the observed value and how it was verified, or mark it as an open question.

## Acceptance criteria

- [ ] **Precondition first:** confirm any safety or migration requirement before changing live behavior.
- [ ] Deliver the requested observable outcome.
- [ ] Cover the affected surfaces without splitting implementation details into separate criteria.
- [ ] Update relevant tests, typechecks, linting, and documentation.

## Resources

- <driving doc or issue link, with the relevant section>
- Related to #<number> (relationship) · #<number> (relationship)
```

Keep `What / Why` to four bullets or fewer and acceptance criteria to five or fewer. Put rollout or coordination requirements inline with the affected item. Remove placeholders before presenting the draft.

## Create the issue

After approval, create the issue with the confirmed title, body, and requested metadata. Use the repository's preferred GitHub integration; use `gh issue create` only when no dedicated integration is available.

Confirm the resulting URL, title, metadata, and any unresolved open questions. Do not modify code, labels, projects, or existing issues beyond the explicit request.
