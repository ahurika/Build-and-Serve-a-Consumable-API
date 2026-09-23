export const config = {
  rateLimit: {
    maxRequestsPerWindow: parseInt(process.env.API_RATE_LIMIT_REQUESTS || '100', 10),
    windowSeconds: parseInt(process.env.API_RATE_LIMIT_WINDOW_SECONDS || '60', 10),
  }
};
