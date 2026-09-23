import { NextRequest } from 'next/server';
import { apiError } from './api-response';
import { rateLimit } from './rate-limit';

export async function withApi(
  req: NextRequest,
  handler: () => Promise<Response>
): Promise<Response> {
  try {
    // 1. IP Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimitResult = rateLimit(ip);

    if (!rateLimitResult.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Rate limit exceeded',
          },
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
          },
        }
      );
    }

    // 2. Execute Handler
    const response = await handler();

    // 3. Attach Rate Limit Headers to success responses too
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimitResult.resetTime / 1000).toString());

    return response;
  } catch (error: any) {
    console.error('API Error:', error);
    
    if (error.code === 'P2023') {
      return apiError('BAD_REQUEST', 'Malformed identifier provided', 400);
    }

    return apiError('INTERNAL_SERVER_ERROR', 'An unexpected error occurred', 500);
  }
}
