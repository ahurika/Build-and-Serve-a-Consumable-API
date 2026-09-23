import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { withApi } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withApi(req, async () => {
    const vehicle = await db.vehicle.findUnique({
      where: { id: params.id },
    });

    if (!vehicle) {
      return apiError('NOT_FOUND', 'Vehicle not found', 404);
    }

    return apiSuccess(vehicle);
  });
}
