import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { withApi } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withApi(req, async () => {
    const route = await db.route.findUnique({
      where: { id: params.id },
    });

    if (!route) {
      return apiError('NOT_FOUND', 'Route not found', 404);
    }

    return apiSuccess(route);
  });
}
