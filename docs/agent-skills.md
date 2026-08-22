# Agent Skills

This repository keeps the skill set small on purpose.

Next.js writes current framework guidance into `AGENTS.md`. The repository adds one local skill at `.agents/skills/build-next-feature` for the failure that matters most here: an agent changing direction, losing the current task, or building a feature without carrying its data rules and evidence with it.

## Why We Did Not Copy a Large Skill Pack

I reviewed Matt Pocock's public skills repository at commit `5b15a47f2d7150f545fbcacbfe381787fc0230dc` from August 21, 2026.

The useful ideas are present here:

- write from a product or specification
- work in vertical test-driven slices
- test behavior at an observable seam
- review completed work
- leave a clear handoff for the next session

His `implement`, `tdd`, `to-spec`, and `handoff` skills are strong general tools. Copying all four into this starter would duplicate `AGENTS.md`, depend on skills and issue-tracker setup that members may not have, and make automatic skill selection noisy.

The local `build-next-feature` skill adapts those ideas to this repository's actual workflow. `BUILD.md` is the handoff. `PRODUCT.md` is the product boundary. The Projects feature is the canonical implementation.

Source: [mattpocock/skills](https://github.com/mattpocock/skills)

Add another local skill only after repeated member evidence shows that agent rules and automated checks cannot solve the failure.
