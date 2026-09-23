# Skill: Repeatable Data Seeding

## Use when
Creating realistic development and production data.

## Procedure
1. Read R2, R4, R5, R6, R7.
2. Generate realistic records using a source allowed by the brief.
3. Respect resource relationships.
4. Use generated non-sequential identifiers.
5. Create a repeatable seed operation.
6. Make reruns non-duplicating.
7. Ensure a few hundred records per resource.
8. Test the seed twice.
9. Verify relationships are valid.
10. Commit the seed script, not a database dump.

## Acceptance
A second seed run does not create duplicates and the resulting data is usable by the API.
