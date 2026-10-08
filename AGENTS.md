# VeganPro-Frontend Agent Guide

## Repository scope

This repository contains the VeganPro frontend only.

Backend services, persistence, authentication infrastructure, and API implementation live outside this repository unless explicitly added later. Do not invent backend contracts, response shapes, endpoints, or persistence behavior that are not documented in this repository.

## Working principles

- Understand the affected flow before modifying code.
- Keep changes narrowly scoped to the requested behavior.
- Prefer existing project conventions over introducing new patterns.
- Do not add dependencies unless they materially simplify the requirement and the tradeoff is justified.
- Do not change unrelated formatting, naming, or structure.
- Preserve accessibility, responsive behavior, and error/loading states in UI work.
- Treat API contracts as external boundaries. If a contract is unknown, mark it as unknown instead of guessing.

## SDD workflow

Use the global SDD skills as the formal workflow.

For a new capability:
1. `$sdd-explore` when current repository behavior matters.
2. `$sdd-specify` to define desired behavior and acceptance criteria.
3. `$sdd-design` only when architecture, state flow, data contracts, or nontrivial technical choices require it.
4. `$sdd-plan`.
5. `$sdd-implement`.
6. `$sdd-validate`.
7. `$sdd-archive` when the change is complete and durable knowledge should be promoted.

For an existing behavior change, prefer `$sdd-change` instead of `$sdd-specify`.

Use `$sdd-init` once to establish the project SDD structure.

Active SDD artifacts are the source of truth for the current change.

## Tool usage

### Engram

Use Engram for durable project history: architectural decisions, conventions, important discoveries, and prior implementation context.

- Prefer current repository evidence over memory when they conflict.
- Save only durable information that will be useful in future sessions.
- Avoid saving transient debugging details or duplicated source content.

### Context7

Use Context7 when current framework or library documentation is needed.

- Resolve the exact library first.
- Query only the documentation required for the task.
- Do not use external docs to override repository-specific behavior without evidence.

## Agent routing

Use the cheapest capable path.

- Routine implementation: main Codex agent, GPT-6.1 Sol, low reasoning.
- Fast repository discovery: `explorer`.
- External documentation lookup: `docs_researcher`.
- Complex architecture, state, or business logic: `analysis`.
- Review after nontrivial changes: `reviewer`.
- Escalate reasoning only when the lower-cost path is insufficient.

Do not spawn multiple agents when one focused agent is enough.

## Validation

Before declaring a task complete:

- Run the narrowest relevant automated checks available.
- Run syntax/type/lint/build checks appropriate to the affected area.
- Validate acceptance criteria explicitly.
- Distinguish `PASS`, `FAIL`, `UNVERIFIED`, and `NOT APPLICABLE`.
- Do not claim manual browser, device, network, or integration behavior was verified unless it actually was.

## Completion report

Keep the final report concise and include:

- what changed;
- validation performed;
- remaining unverified items or blockers;
- whether application code, tests, docs, or SDD artifacts changed.

## Codebase Memory

When Codebase Memory is available:

- use graph tools first to understand repository structure, dependencies, imports,
  symbols, and execution flow;
- use relative repository paths for coverage checks;
- inspect source directly only to confirm freshness, resolve graph gaps, or verify
  exact implementation behavior;
- treat current source as the final authority when graph data and source differ;
- avoid broad repository scans when the graph already answers the structural question.