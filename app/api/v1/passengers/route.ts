import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { withApi } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-response';
import { paginationSchema, passengerFilterSchema } from '@/lib/validations';

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
    const filterResult = passengerFilterSchema.safeParse(searchParams);
    if (!filterResult.success) {
      return apiError('BAD_REQUEST', 'Invalid filter parameters', 400);
    }
    const { email, lastName, sortBy, sortOrder } = filterResult.data;

    const where = {
      ...(email && { email: { contains: email, mode: 'insensitive' as const } }),
      ...(lastName && { lastName: { contains: lastName, mode: 'insensitive' as const } }),
    };

    const passengers = await db.passenger.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { [sortBy]: sortOrder },
    });

    const hasNextPage = passengers.length > limit;
    if (hasNextPage) {
      passengers.pop();
    }

    const nextCursor = hasNextPage ? passengers[passengers.length - 1].id : null;
    const total = await db.passenger.count({ where });

    return apiSuccess(passengers, {
      total,
      limit,
      nextCursor,
      hasNextPage,
    });
  });
}
