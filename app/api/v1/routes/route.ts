import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { withApi } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-response';
import { paginationSchema, routeFilterSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  return withApi(req, async () => {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);

    // Validate pagination
    const paginationResult = paginationSchema.safeParse(searchParams);
    if (!paginationResult.success) {
      return apiError('BAD_REQUEST', 'Invalid pagination parameters', 400);
    }
    const { limit, cursor } = paginationResult.data;

    // Validate filters
    const filterResult = routeFilterSchema.safeParse(searchParams);
    if (!filterResult.success) {
      return apiError('BAD_REQUEST', 'Invalid filter parameters', 400);
    }
    const { origin, destination, status, sortBy, sortOrder } = filterResult.data;

    const where = {
      ...(origin && { origin: { contains: origin, mode: 'insensitive' as const } }),
      ...(destination && { destination: { contains: destination, mode: 'insensitive' as const } }),
      ...(status && { status }),
    };

    const routes = await db.route.findMany({
      where,
      take: limit + 1, // Fetch one extra to determine if there's a next page
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { [sortBy]: sortOrder },
    });

    const hasNextPage = routes.length > limit;
    if (hasNextPage) {
      routes.pop(); // Remove the extra item
    }

    const nextCursor = hasNextPage ? routes[routes.length - 1].id : null;

    const total = await db.route.count({ where });

    return apiSuccess(routes, {
      total,
      limit,
      nextCursor,
      hasNextPage,
    });
  });
}
