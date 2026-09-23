# Task 1 — Consumable API

This repository implements Task 1 of the Product Engineering Bootcamp, featuring a public REST API for a Transport Booking Domain.

## Status
Implementation complete. Ready for database configuration and deployment.

## Planned structure
- `app/` — API routes and minimal consumer application
- `lib/` — shared server utilities (db, rate limiting, error handling, Zod validations)
- `prisma/` — schema and seed scripts
- `evidence/` — required proof artifacts
- `PRD.md` — task requirements

## Resource design

| Resource | Purpose | Identifier | Required fields | Relationships |
|---|---|---|---|---|
| Route | A transport service between an origin and destination | UUID (Generated) | name, origin, destination, status, departureTime, arrivalTime, fareMinor, currency | Has many Vehicles, Has many Bookings |
| Vehicle | A transport vehicle assigned to a route | UUID (Generated) | routeId, registrationNumber, make, model, capacity, status | Belongs to Route, Has many Bookings |
| Passenger | A customer using the transport service | UUID (Generated) | firstName, lastName, email, phone | Has many Bookings |
| Booking | A passenger booking for a route | UUID (Generated) | routeId, passengerId, bookingReference, status, fareMinor, currency, bookedAt | Belongs to Route, Belongs to Passenger, Optionally references Vehicle |

## API Documentation

All API paths use the base URL followed by `/api/v1`.

### Consistent Envelope

**Success Response Envelope:**
```json
{
  "data": [], // or object for single item
  "meta": {
    "total": 340,
    "limit": 20,
    "nextCursor": "uuid-here",
    "hasNextPage": true
  }
}
```

**Error Response Envelope:**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Route not found"
  }
}
```

### Endpoints

#### 1. List Routes
`GET /api/v1/routes`

**Query Parameters:**
- `limit` (int, default: 20, max: 100)
- `cursor` (string)
- `sort` (createdAt|departureTime|fareMinor, default: createdAt)
- `order` (asc|desc, default: desc)
- `origin` (string, filter)
- `destination` (string, filter)
- `status` (active|inactive, filter)

**Example cURL:**
`curl "https://yourdomain.com/api/v1/routes?origin=Lagos&sort=departureTime&order=asc"`

#### 2. Get Route
`GET /api/v1/routes/:id`

**Example cURL:**
`curl "https://yourdomain.com/api/v1/routes/123e4567-e89b-12d3-a456-426614174000"`

#### 3. List Vehicles for a Route
`GET /api/v1/routes/:id/vehicles`

Shares the same query parameters as `List Vehicles`.

**Example cURL:**
`curl "https://yourdomain.com/api/v1/routes/123e4567-e89b-12d3-a456-426614174000/vehicles"`

#### 4. List Vehicles
`GET /api/v1/vehicles`

**Query Parameters:**
- `limit` (int, default: 20, max: 100)
- `cursor` (string)
- `sort` (createdAt|capacity, default: createdAt)
- `order` (asc|desc, default: desc)
- `make` (string, filter)
- `status` (available|maintenance|inactive, filter)

**Example cURL:**
`curl "https://yourdomain.com/api/v1/vehicles?status=available&limit=5"`

#### 5. Get Vehicle
`GET /api/v1/vehicles/:id`

#### 6. List Passengers
`GET /api/v1/passengers`

**Query Parameters:**
- `limit` (int, default: 20, max: 100)
- `cursor` (string)
- `sort` (createdAt|lastName, default: createdAt)
- `order` (asc|desc, default: desc)
- `email` (string, filter)
- `lastName` (string, filter)

#### 7. Get Passenger
`GET /api/v1/passengers/:id`

#### 8. List Bookings
`GET /api/v1/bookings`

**Query Parameters:**
- `limit` (int, default: 20, max: 100)
- `cursor` (string)
- `sort` (createdAt|bookedAt|fareMinor, default: createdAt)
- `order` (asc|desc, default: desc)
- `status` (pending|confirmed|cancelled, filter)
- `routeId` (string, UUID filter)

#### 9. Get Booking
`GET /api/v1/bookings/:id`

#### 10. Create Booking
`POST /api/v1/bookings`

**Body schema:**
- `routeId` (UUID, required)
- `passengerId` (UUID, required)
- `vehicleId` (UUID, optional)
- `seatNumber` (string, optional)
- `fareMinor` (int, required)
- `currency` (string, default: "USD")
- `status` (string, default: "pending")

**Example cURL:**
`curl -X POST "https://yourdomain.com/api/v1/bookings" -H "Content-Type: application/json" -d '{"routeId":"...", "passengerId":"...", "fareMinor":1500}'`

#### 11. Update Booking
`PATCH /api/v1/bookings/:id`

**Body schema:**
- `status` (pending|confirmed|cancelled, optional)
- `vehicleId` (UUID, optional)
- `seatNumber` (string, optional)

#### 12. Delete Booking
`DELETE /api/v1/bookings/:id`


## Design decisions

- **Why these resources**: The Transport Booking domain naturally provides a complex graph of resources with necessary cross-relations (Routes -> Vehicles -> Bookings <- Passengers), proving the ability to handle a real-world relational schema.
- **Why generated identifiers**: UUID v4 prevents malicious users from enumerating our database or guessing identifiers to scrape data or discover business metrics (like the total number of bookings).
- **Why cursor pagination**: We opted for cursor pagination because it is highly resilient to data changes (insertions/deletions) when traversing a dataset, and it provides consistent O(1) performance compared to offset pagination's O(N) performance on large tables. While offset pagination allows jumping to arbitrary pages, cursor pagination is significantly more reliable for an API meant for programmatic consumption.
- **Why the response envelope is consistent**: Consistent envelopes mean consumers only need to write parser and error-handling logic once. They know `res.data` is always the primary payload and `res.meta` safely stores pagination bounds.
- **Why IP rate limiting**: Implemented via a sliding window map at the middleware/handler level to protect the publicly exposed API from denial of service and aggressive scraping.


## Development & Setup
1. Define `DATABASE_URL` in `.env` (Use a managed Postgres string like Neon).
2. Run `npm install`.
3. Run `npx prisma db push`.
4. Run `npm run db:seed` to seed data idempotently.
5. Run `npm run dev` to start locally.

## Evidence
As required by the rubric, all evidence artifacts (screenshots, live URL, and the repeatable seed script) are tracked and stored in the `evidence/` directory. See `evidence/EVIDENCE.md` for the final submission checklist.
