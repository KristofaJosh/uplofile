---
name: gh-create-pr
description: Prepare and create concise GitHub pull requests with the GitHub CLI. Use when asked to draft a PR title or body, open or create a pull request, publish a branch for review, update an existing PR description, or move a draft PR toward review. Apply repository-specific instructions first, verify the actual diff and test evidence, create draft PRs by default, preserve explicit push authorization, and write reviewer-focused descriptions without AI attribution.
---

# Create a GitHub Pull Request

Create a calm, concise PR that explains the outcome, problem, and reason for the change without turning the body into an engineering log.

## Follow repository conventions

Before drafting:

1. Read applicable repository instructions, contribution guides, and PR templates.
2. Inspect the current branch, working tree, upstream, base branch, commits, and full diff.
3. Check whether a PR already exists for the branch.
4. Read the linked issue when an issue number is known.

Treat repository instructions and required templates as authoritative. Use this skill's defaults only where the repository is silent.

Never invent an issue, test result, screenshot, behavior, or reviewer requirement.

## Preserve authorization boundaries

- Do not push for requests that only ask to draft, prepare, or review PR content.
- Treat an explicit request to create or open a PR as authorization to push the current branch only when that push is required to create the PR.
- Do not commit, rewrite history, force-push, push the default branch, include unrelated commits, or alter another branch unless explicitly requested.
- If relevant work is uncommitted, the base is unclear, the branch is detached, or the diff contains unrelated changes, stop and ask for direction.
- If a PR already exists, report it instead of creating a duplicate. Update it only when requested.
- Exclude `Co-Authored-By`, AI attribution, generated-by notices, and similar credit from commits and PR content.

## Draft the title

Follow the repository's title convention when one exists. Otherwise:

- Use `[#<issue-number>] <imperative summary>` when a confirmed issue applies.
- Use `<imperative summary>` when no issue is known.
- Keep it specific and concise.
- Do not invent an issue number from ambiguous branch text.

Do not rely on a branch name to link the issue. Add `Closes #<number>` only when merging the PR should close it; otherwise use `Related to #<number>`.

## Draft the body

Use the repository template when required. Otherwise use only the applicable sections:

```markdown
## Summary

State the affected user or workflow, the problem, and the outcome in one short paragraph.

## What / Why

- **Short change headline** — explain what changed and why in one line.
- **Another material change** — keep the problem and solution together.
- **While here** — group small related cleanup into one optional bullet.

## Screenshots

<!-- Include only for visual changes and only when real screenshots are available. -->

## Notes

<!-- Include only reviewer decisions, meaningful blast radius, or pending evidence. -->

## Expectation

- Describe observable behavior by relevant scenario.
- Report exact tests run and their status; state what was not run.

Related to #<issue-number>
```

Apply these limits:

- Keep `Summary` to one or two sentences. Describe the outcome, not a feature inventory.
- Keep `What / Why` to about five one-line bullets. Lead with the problem, then the fix.
- Group incidental cleanup into one `While here` bullet.
- Omit `Screenshots`, `Notes`, or `Expectation` when they add no reviewer value.
- Keep technical implementation details only when they affect review, risk, compatibility, migration, or rollout.
- Leave selector renames, internal refactors, review-finding chronology, and test mechanics to commits or comments.
- Use plain language and a calm, human tone.

## Verify before creating

Confirm that:

- The proposed title and body match the committed diff.
- The base and head branches are correct.
- Required checks were run, or missing checks are disclosed.
- No secrets, credentials, private links, or unrelated changes are exposed.
- Any compatibility, migration, rollout, or broad UI impact is called out.
- The issue relationship is accurate.

Do not silently fix, stage, or commit problems discovered during this check.

## Create the PR

Always create the PR as a draft:

```bash
git push -u origin HEAD
gh pr create --draft --base <base> --title "<title>" --body-file <body-file>
```

Use a secure temporary body file or standard input where supported. Avoid shell interpolation risks in Markdown.

After creation, inspect the PR and confirm:

- URL, title, base, and head branches
- Draft status
- Rendered body
- Explicit issue link
- Reported verification status

Return the PR URL, a concise scope summary, checks run, and anything the reviewer must decide.

## Move toward review

Keep the PR in draft while walking through the diff and resolving reviewer-relevant gaps. Even when the original request asks for a ready PR, complete the draft review first. Mark it ready only after explicit user instruction following that review. Recheck the final diff, body, screenshots, and required checks before removing draft status.
