# Release the Starter

## Prepare

1. Finish the user-facing change on a branch.
2. Update `CHANGELOG.md` and `BUILD.md`.
3. Run `pnpm check`.
4. Run `pnpm db:start`, `pnpm db:reset`, and `pnpm test:db` on a machine with Docker.
5. Run `pnpm test:e2e`.
6. Follow `docs/release-checklist.md` from top to bottom.

## Publish

1. Open a pull request.
2. Wait for the application and database jobs to pass.
3. Review the diff for secrets, migrations, dependency changes, and member-facing instructions.
4. Merge to `main`.
5. Create a version tag such as `v1.0.0`.
6. Record the tag and commit in `BUILD.md`.

## Distribute

Keep the canonical repository private and marked as a template. Follow [the member access process](member-access.md) for each member.

Changes to the template do not flow into repositories members already created. Publish important fixes in the community with the exact files or commits members need to apply.

