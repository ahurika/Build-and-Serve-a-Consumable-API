import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { withApi } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-response';
import { paginationSchema, vehicleFilterSchema } from '@/lib/validations';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withApi(req, async () => {
    const routeId = params.id;
    
    const route = await db.route.findUnique({ where: { id: routeId } });
    if (!route) {
      return apiError('NOT_FOUND', 'Route not found', 404);
    }

    const searchParams = Object.fromEntries(req.nextUrl.searchParams);

    // Validate pagination
    const paginationResult = paginationSchema.safeParse(searchParams);
    if (!paginationResult.success) {
      return apiError('BAD_REQUEST', 'Invalid pagination parameters', 400);
    }
    const { limit, cursor } = paginationResult.data;

    // Validate filters
    const filterResult = vehicleFilterSchema.safeParse(searchParams);
    if (!filterResult.success) {
      return apiError('BAD_REQUEST', 'Invalid filter parameters', 400);
    }
    const { status, make, sortBy, sortOrder } = filterResult.data;

    const where = {
      routeId,
      ...(status && { status }),
      ...(make && { make: { contains: make, mode: 'insensitive' as const } }),
    };

    const vehicles = await db.vehicle.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { [sortBy]: sortOrder },
    });

    const hasNextPage = vehicles.length > limit;
    if (hasNextPage) {
      vehicles.pop();
    }

    const nextCursor = hasNextPage ? vehicles[vehicles.length - 1].id : null;
    const total = await db.vehicle.count({ where });

    return apiSuccess(vehicles, {
      total,
      limit,
      nextCursor,
      hasNextPage,
    });
  });
}
