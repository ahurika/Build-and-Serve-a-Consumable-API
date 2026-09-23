import { NextResponse } from 'next/server';

export interface PaginationMeta {
  total: number;
  limit: number;
  nextCursor: string | null;
  hasNextPage: boolean;
}

export function apiSuccess<T>(data: T, meta?: PaginationMeta) {
  return NextResponse.json({
    data,
    ...(meta && { meta })
  });
}

export function apiError(code: string, message: string, status: number = 400) {
  return NextResponse.json(
    {
      error: {
        code,
        message
      }
    },
    { status }
  );
}
