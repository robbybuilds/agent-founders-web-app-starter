---
name: build-next-feature
description: Use when adding or changing a user-facing feature after PRODUCT.md and BUILD.md identify the current product and next task.
---

# Build the Next Feature

Keep one product and one next task in motion. Do not restart discovery because a new message introduces an adjacent idea.

## Continuity Gate

Read `AGENTS.md`, `PRODUCT.md`, `BUILD.md`, and `ARCHITECTURE.md`.

Before editing code, state:

- the current product
- the user outcome for this feature
- the next exact task from `BUILD.md`
- whether the request continues that task, changes it, or conflicts with it

Stop for approval if the request changes the product, target user, data owner, default stack, or current release boundary.

## Choose the Observable Seam

Name the highest useful behavior a test can observe. Prefer a route or complete user action over an internal helper. Add focused unit tests only for validation or other logic with meaningful edge cases.

For user-owned data, read [user-owned-data.md](references/user-owned-data.md) before planning.

## Build One Vertical Slice

Plan the smallest path that lets the user complete the behavior. Include its data rule, server operation, interface state, and test evidence in the same slice.

Work in this order:

1. Write one failing test at the chosen seam.
2. Run it and confirm the expected failure.
3. Implement only enough behavior to pass.
4. Run the focused test again.
5. Add the next slice only after the first is green.

Do not build every database function before the interface or every test before the implementation.

## Finish the Session

Run `pnpm check`. Update and run the ownership tests when data changed. Run the relevant Playwright test when a user flow changed.

Update `BUILD.md` with what changed, decisions, exact evidence, remaining uncertainty, and one next exact task. Do not write an approximate day or vague phase.

