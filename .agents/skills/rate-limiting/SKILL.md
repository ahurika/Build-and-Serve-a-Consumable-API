# Skill: IP Rate Limiting

## Use when
Adding protection to the public unauthenticated API.

## Procedure
1. Read R19–R20.
2. Define the limit in configuration.
3. Key requests by IP.
4. Count requests in the configured window.
5. Allow requests below the threshold.
6. Return 429 above the threshold.
7. Include Retry-After.
8. Keep handler logic free of magic numbers.
9. Test the threshold and exceeded behavior.
10. Capture the required 429 evidence.
