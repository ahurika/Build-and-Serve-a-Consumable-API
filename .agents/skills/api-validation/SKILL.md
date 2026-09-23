# Skill: API Validation

## Use when
Implementing or testing request bodies and query parameters.

## Procedure
1. Read R11–R18.
2. Centralize query/body schemas.
3. Validate limit.
4. Validate offset/cursor according to chosen strategy.
5. Validate filters.
6. Validate sort field and order.
7. Validate identifiers.
8. Validate required POST fields.
9. Map failures to the required HTTP status.
10. Ensure malformed identifiers never become 500 errors.
11. Test ugly inputs from the PRD.

## Required cases
- limit=5000
- negative offset where applicable
- unknown sort field
- malformed identifier
- missing required POST field
