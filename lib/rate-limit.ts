export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // Unix timestamp in ms
}

import { config } from './config';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = config.rateLimit.windowSeconds * 1000;
const MAX_REQUESTS_PER_WINDOW = config.rateLimit.maxRequestsPerWindow;

export function rateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || record.resetTime < now) {
    // New window
    const newRecord = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
    rateLimitMap.set(ip, newRecord);
    return {
      success: true,
      limit: MAX_REQUESTS_PER_WINDOW,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetTime: newRecord.resetTime,
    };
  }

  // Existing window
  record.count += 1;
  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - record.count);

  return {
    success: record.count <= MAX_REQUESTS_PER_WINDOW,
    limit: MAX_REQUESTS_PER_WINDOW,
    remaining,
    resetTime: record.resetTime,
  };
}
