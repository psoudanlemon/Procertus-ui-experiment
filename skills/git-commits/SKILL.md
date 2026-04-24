---
name: git-commits
description: Git commit strategy and how AI agents should write commit messages. Use whenever creating commits, amending, or preparing PRs.
globs: []
---

# Git commits (agent policy)

## Strategy

- **One logical change per commit** when practical: a reviewer should understand the commit from its title. Split unrelated edits (e.g. drive-by format + feature) into separate commits.
- **Size**: Prefer smaller commits over huge dumps. If a task is large, sequence commits (e.g. refactor then feature) rather than one opaque changeset.
- **Generated noise**: Do not commit machine caches, secrets, or env files that belong in `.gitignore`. Verify `git status` before committing.
- **CLI-created repos**: `scaffold project` leaves an initial commit with subject **`chore(scaffold): add monorepo baseline`** and a short body (Conventional Commits, aligned with this skill). Your work starts **after** that baseline.

### `scaffold project` and Git

Unless the user passes **`--no-git`**, the CLI **refuses to start** unless Git is on PATH and **`git config --global user.name`** and **`user.email`** are both set. The initial commit uses that global identity. If the user hits this error, they must configure Git globally or use **`--no-git`**.

## Commit message format

Use **[Conventional Commits](https://www.conventionalcommits.org/)**-style prefixes so history stays scannable:

| Prefix | Use for |
|--------|---------|
| **`feat`** | New user-visible behavior or API |
| **`fix`** | Bug fixes |
| **`docs`** | Documentation only |
| **`style`** | Formatting, whitespace (no logic change) |
| **`refactor`** | Internal structure without behavior change |
| **`test`** | Adding or fixing tests |
| **`chore`** | Tooling, deps, config, build—no product behavior |
| **`ci`** | CI configuration |
| **`perf`** | Performance improvements |

**Subject line (first line):**

- Pattern: **`type(scope): imperative summary`** — scope is optional (e.g. `feat(cli-scaffold): add workspace-ui hook`).
- Use **imperative mood** (*add*, *fix*, *remove*), not past tense (*added*, *fixed*).
- Keep the subject **concise** (about 50–72 characters). **No trailing period** on the subject line.

**Body (optional, recommended when non-obvious):**

- Leave a **blank line** after the subject, then one or more paragraphs.
- Use **complete sentences**, correct grammar, and **plain language**—same standard as PR descriptions.
- Explain **why** the change exists when the diff alone is unclear (tradeoffs, bug context, follow-ups).

**Examples (good):**

```text
fix(pkg-ui): resolve monorepo root for add-primitive

The command used process.cwd() as the project root, which broke runs from
nested directories. Align with add-component by using findWorkspaceMonorepoRoot.
```

```text
docs: reference git-commits skill from AGENTS.md
```

**Examples (bad):**

- `WIP` / `fix` / `updates` / `address feedback` (vague, no type)
- Subject line ending with `.` or written as a long essay

## Pull requests

- **Title**: Mirror the main commit or summarize the series; still clear and specific.
- **Description**: Complete sentences; state what changed and why; link issues if applicable. Do not rely on vague bullets alone when the change is broad.

## When the user asks for a commit

1. Inspect the **actual diff** (`git diff`, staged files).
2. Choose the **narrowest accurate type** and optional **scope** (package or area).
3. Write subject + body so someone reading **only the log** understands the intent.
