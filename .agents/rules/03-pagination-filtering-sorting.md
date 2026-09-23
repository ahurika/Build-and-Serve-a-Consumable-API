# Rule: List Endpoints
Every list endpoint must support:
- Pagination.
- Filtering on at least two fields.
- Sorting.

Pagination defaults:
- Default limit: 20.
- Maximum limit: 100.
- Return total count.
- Return whether another page exists.

Reject or normalize invalid parameters according to the PRD. In particular, limit 5000 must not be honored and negative offset must produce 400 when offset pagination is used.
Unknown sort fields must produce 400.
