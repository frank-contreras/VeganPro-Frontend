# VeganPro frontend specifications

This workspace follows the global SDD skills and the repository guidance in
[`AGENTS.md`](../AGENTS.md). At initialization, this is a greenfield repository:
there is no application implementation or established behavior to explore.

## Structure

- `product/`: product scope, goals, and shared constraints.
- `features/`: specifications for new frontend capabilities.
- `changes/`: active changes to existing behavior and their working artifacts.
- `decisions/`: durable technical decisions and their rationale.

Add `domain/` when concrete domain rules require shared documentation. Create
documents when they have substantive content; the `.gitkeep` files only preserve
empty directories in Git.

## Workflow

Start with `sdd-specify` for the first capability. Use `sdd-design` when technical
choices require it, then `sdd-plan`, `sdd-implement`, and `sdd-validate`. Use
`sdd-archive` after completion when working artifacts should be archived and
durable knowledge promoted.

Once application behavior exists, use `sdd-explore` before changing it and
`sdd-change` to describe the intended delta. Active SDD artifacts are the source
of truth for the current change.

This repository covers the frontend only. Backend services, persistence,
authentication infrastructure, and API implementation are external boundaries.
Document unknown contracts as unknown; do not invent endpoints or response shapes.

## Supporting tools

Use Engram for durable project history, with current repository evidence taking
precedence. Use Context7 for framework or library documentation when needed.
Project-local agents provide focused exploration, documentation research,
analysis, and review; follow the routing guidance in `AGENTS.md`.
