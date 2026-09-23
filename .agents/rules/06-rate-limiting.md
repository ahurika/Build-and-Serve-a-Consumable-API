# Rule: Rate Limiting
- Public API is unauthenticated for reading.
- Rate limit by IP.
- Keep the threshold in configuration.
- Return 429 when exceeded.
- Include Retry-After.
- Do not bury rate-limit numbers inside route handlers.
