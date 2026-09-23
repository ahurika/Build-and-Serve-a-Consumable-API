# AGENTS.md — Task 1 Consumable API

## Mission
Build only the Task 1 deliverable from the provided Product Engineering Bootcamp brief: a public, versioned, consumable REST API plus the smallest possible consumer.

## Source of truth
The attached five-task bootcamp brief is the only product/task source of truth.

Do not introduce requirements from other tasks, external tutorials, imagined product requirements, or unrelated engineering preferences.

## Required working order
1. Read `PRD.md`.
2. Read every applicable file in `.agents/rules/`.
3. Read the skill file relevant to the current checkpoint before implementation.
4. State the current checkpoint and requirement IDs being addressed.
5. Inspect existing files before modifying them.
6. Implement only the current checkpoint.
7. Run the relevant tests/checks.
8. Record evidence for requirements that have been verified.
9. Do not silently expand scope.

## Requirement IDs
- R1: One concrete market/domain.
- R2: 3–5 related resource types.
- R3: Resource fields/types/requiredness/identifiers documented before coding.
- R4: Generated non-sequential identifiers.
- R5: Realistic data at a few-hundred-record scale per resource.
- R6: Repeatable seed with no duplicate creation on rerun.
- R7: No database dump committed.
- R8: Versioned `/api/v1/` paths.
- R9: Collection and item endpoints.
- R10: Nested resource where applicable.
- R11: Pagination on every list endpoint; default 20, max 100.
- R12: Total count and next-page indicator.
- R13: Filtering on at least two fields on every list endpoint.
- R14: Sorting on every list endpoint.
- R15: Consistent success envelope.
- R16: Consistent error envelope.
- R17: Honest 400/404/422/429 behavior.
- R18: Schema validation for bodies and query parameters.
- R19: IP-based rate limiting.
- R20: Rate limit in configuration and Retry-After on 429.
- R21: Complete README endpoint documentation with curl examples.
- R22: Design decisions section.
- R23: Public deployment.
- R24: Managed Postgres and production environment variables.
- R25: Production seed.
- R26: External/public verification.
- R27: Minimal consumer calls public URL.
- R28: Evidence: live URL, paginated curl, 429, consumer, seed script.
- R29: No landing page/admin panel/full interface.
- R30: Consumer empty/error states for excellent-level completion.
- R31: Defence questions can be answered from the implementation.

## Non-negotiable constraints
- Do not add authentication for reading.
- Do not build a landing page.
- Do not build an admin panel.
- Do not build unrelated product features.
- Do not use sequential integer IDs.
- Do not use localhost as the consumer's production API target.
- Do not commit secrets or database dumps.
- Do not claim a requirement is complete without evidence.
- Do not fabricate evidence.
- Do not change a requirement because it is inconvenient.
- Do not use different response/error shapes across endpoints.

## AI behavior
AI may implement code, but every generated change must remain traceable to the PRD requirement IDs.

When uncertain:
1. Check the PRD.
2. Check the brief.
3. Do not invent a requirement.

When an implementation choice is not specified by the brief, choose the smallest implementation that satisfies the requirement and document the decision.

## Definition of done
A checkpoint is done only when:
- Its requirements are implemented.
- Relevant tests/checks pass.
- The implementation is explainable.
- Required evidence has been captured or explicitly scheduled for the appropriate later verification checkpoint.
