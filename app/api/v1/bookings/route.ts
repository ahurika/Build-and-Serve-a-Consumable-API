import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { withApi } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-response';
import { paginationSchema, bookingFilterSchema, createBookingSchema } from '@/lib/validations';

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
    const filterResult = bookingFilterSchema.safeParse(searchParams);
    if (!filterResult.success) {
      return apiError('BAD_REQUEST', 'Invalid filter parameters', 400);
    }
    const { status, routeId, sortBy, sortOrder } = filterResult.data;

    const where = {
      ...(status && { status }),
      ...(routeId && { routeId }),
    };

    const bookings = await db.booking.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { [sortBy]: sortOrder },
    });

    const hasNextPage = bookings.length > limit;
    if (hasNextPage) {
      bookings.pop();
    }

    const nextCursor = hasNextPage ? bookings[bookings.length - 1].id : null;
    const total = await db.booking.count({ where });

    return apiSuccess(bookings, {
      total,
      limit,
      nextCursor,
      hasNextPage,
    });
  });
}

export async function POST(req: NextRequest) {
  return withApi(req, async () => {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return apiError('BAD_REQUEST', 'Invalid JSON body', 400);
    }

    const parseResult = createBookingSchema.safeParse(body);
    if (!parseResult.success) {
      const messages = parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return apiError('UNPROCESSABLE_ENTITY', `Validation failed - ${messages}`, 422);
    }

    const data = parseResult.data;

    // Verify foreign keys exist
    const routeExists = await db.route.findUnique({ where: { id: data.routeId } });
    if (!routeExists) return apiError('NOT_FOUND', 'Route not found', 404);

    const passengerExists = await db.passenger.findUnique({ where: { id: data.passengerId } });
    if (!passengerExists) return apiError('NOT_FOUND', 'Passenger not found', 404);

    if (data.vehicleId) {
      const vehicleExists = await db.vehicle.findUnique({ where: { id: data.vehicleId } });
      if (!vehicleExists) return apiError('NOT_FOUND', 'Vehicle not found', 404);
    }

    const booking = await db.booking.create({
      data: {
        ...data,
        bookingReference: Math.random().toString(36).substring(2, 10).toUpperCase(),
        bookedAt: new Date(),
      }
    });

    return apiSuccess(booking);
  });
}
