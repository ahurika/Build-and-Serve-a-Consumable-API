import { z } from 'zod';

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).default(20).transform(val => Math.min(val, 100)),
  cursor: z.string().optional(),
  offset: z.coerce.number().int().min(0, { message: "Offset cannot be negative" }).optional(),
});

export const routeFilterSchema = z.object({
  origin: z.string().optional(),
  destination: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  sortBy: z.enum(['createdAt', 'departureTime', 'fareMinor']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const vehicleFilterSchema = z.object({
  status: z.enum(['available', 'maintenance', 'inactive']).optional(),
  make: z.string().optional(),
  sortBy: z.enum(['createdAt', 'capacity']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const passengerFilterSchema = z.object({
  email: z.string().optional(),
  lastName: z.string().optional(),
  sortBy: z.enum(['createdAt', 'lastName']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const bookingFilterSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
  routeId: z.string().uuid().optional(),
  sortBy: z.enum(['createdAt', 'bookedAt', 'fareMinor']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const createBookingSchema = z.object({
  routeId: z.string().uuid(),
  passengerId: z.string().uuid(),
  vehicleId: z.string().uuid().optional(),
  seatNumber: z.string().optional(),
  fareMinor: z.number().int().positive(),
  currency: z.string().default('USD'),
  status: z.enum(['pending', 'confirmed', 'cancelled']).default('pending'),
});

export const updateBookingSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
  vehicleId: z.string().uuid().optional(),
  seatNumber: z.string().optional(),
});
