# Build With Your Agent

Your agent should work from the repository, not from a blank chat.

Start the first session with this prompt:

```text
Read AGENTS.md, PRODUCT.md, BUILD.md, and ARCHITECTURE.md.

Tell me what you believe the product is, what stage the build is in, and the next exact task. Do not write code yet.

Then inspect the repository for the existing pattern that is closest to the next task. Give me a small implementation plan, the database changes, the tests you will write first, and any decision you need from me.
```

Read the plan before you approve it. Check that it solves the product in `PRODUCT.md` and does not add a new service without a real reason.

When you approve the plan, say:

```text
Implement the approved plan. Follow AGENTS.md. Keep BUILD.md current as you work. Run the focused tests after each behavior and run pnpm check before you call the task complete.
```

At the end of a session, check `BUILD.md`. It should tell the next agent what changed, what evidence passed, what remains uncertain, and the next exact task.

If the agent starts changing direction, stop it with:

```text
Stop. Read PRODUCT.md and BUILD.md again. We are not starting a new product or replacing the current problem. Explain whether this new idea belongs in the current release. Do not edit code until I approve the change.
```

