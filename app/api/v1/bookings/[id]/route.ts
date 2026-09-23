import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { withApi } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-response';
import { updateBookingSchema } from '@/lib/validations';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withApi(req, async () => {
    const booking = await db.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return apiError('NOT_FOUND', 'Booking not found', 404);
    }

    return apiSuccess(booking);
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return withApi(req, async () => {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return apiError('BAD_REQUEST', 'Invalid JSON body', 400);
    }

    const parseResult = updateBookingSchema.safeParse(body);
    if (!parseResult.success) {
      const messages = parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return apiError('UNPROCESSABLE_ENTITY', `Validation failed - ${messages}`, 422);
    }

    const existingBooking = await db.booking.findUnique({ where: { id: params.id } });
    if (!existingBooking) {
      return apiError('NOT_FOUND', 'Booking not found', 404);
    }

    if (parseResult.data.vehicleId) {
      const vehicleExists = await db.vehicle.findUnique({ where: { id: parseResult.data.vehicleId } });
      if (!vehicleExists) return apiError('NOT_FOUND', 'Vehicle not found', 404);
    }

    const updatedBooking = await db.booking.update({
      where: { id: params.id },
      data: parseResult.data,
    });

    return apiSuccess(updatedBooking);
  });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withApi(req, async () => {
    const existingBooking = await db.booking.findUnique({ where: { id: params.id } });
    if (!existingBooking) {
      return apiError('NOT_FOUND', 'Booking not found', 404);
    }

    await db.booking.delete({
      where: { id: params.id },
    });

    return apiSuccess({ deleted: true });
  });
}
