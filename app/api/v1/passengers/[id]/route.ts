import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { withApi } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withApi(req, async () => {
    const passenger = await db.passenger.findUnique({
      where: { id: params.id },
    });

    if (!passenger) {
      return apiError('NOT_FOUND', 'Passenger not found', 404);
    }

    return apiSuccess(passenger);
  });
}
