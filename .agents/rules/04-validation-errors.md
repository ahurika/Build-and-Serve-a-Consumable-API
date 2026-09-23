# Rule: Validation and Errors
Use centralized schema validation for request bodies and query parameters.

Required error behavior:
- 400: invalid request/query parameter.
- 404: resource not found where applicable.
- 422: missing/invalid required POST fields.
- 429: rate limit exceeded.

Every error uses:
{
  "error": {
    "code": "...",
    "message": "..."
  }
}

Malformed identifiers must never produce an unhandled 500.
