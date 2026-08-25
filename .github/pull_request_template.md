## What changed

Describe the user-facing result and the reason for the change.

## Evidence

- [ ] I ran `pnpm check`.
- [ ] I ran focused browser tests when the user flow changed.
- [ ] I updated the ownership tests when the database changed.
- [ ] I checked the relevant desktop and mobile screens.
- [ ] I updated `BUILD.md`.

## Risk check

- [ ] No secret or real environment file is included.
- [ ] Every Convex function that touches user-owned data still enforces ownership.
- [ ] The change does not add a non-default service without an architecture decision.
- [ ] Destructive actions are clear and require confirmation.
