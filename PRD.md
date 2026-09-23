# PRD.md

# Transport API — Task 1: Build and Serve a Consumable API

**Product Engineering Bootcamp**
**Assessment:** Task 1 — Build and Serve a Consumable API
**Domain:** Transport Industry
**Document Status:** Implementation Ready
**Source of Truth:** `five_engineering_tasks (1)(1).pdf`

---

# 1. Product Overview

## 1.1 Product Name

**Transit API**

The product is a public REST API serving realistic transport-market data.

The API itself is the primary product. A minimal consumer application will be built only to prove that the deployed API can be consumed from outside its own codebase.

The system will model a transport booking domain containing related resources:

* Routes
* Vehicles
* Passengers
* Bookings

The domain must contain relationships between resources so the API demonstrates realistic relational data rather than isolated mock collections.

The assessment brief explicitly states that the chosen market can be a transport market with routes and bookings and that the important requirement is having at least three resource types that reference one another.

---

# 2. Problem Statement

Transport platforms expose structured information about routes, vehicles, passengers, and bookings.

For this assessment, the problem is to design and implement a realistic public API that:

1. exposes related transport resources;
2. handles realistic data volume;
3. provides predictable REST endpoints;
4. supports pagination, filtering, and sorting;
5. validates malformed input;
6. handles errors consistently;
7. protects the unauthenticated public API with rate limiting;
8. can be deployed publicly;
9. can be consumed by an external client.

The goal is not to build a complete transport application.

The goal is to demonstrate that the API itself is production-minded, consumable, documented, and defensible.

---

# 3. Assessment Objective

The completed project must demonstrate the ability to:

* design resources before implementation;
* model relationships between resources;
* use generated identifiers;
* create realistic seed data;
* create a repeatable seed process;
* build a versioned REST API;
* implement collection and item endpoints;
* implement a nested resource endpoint;
* paginate list endpoints;
* filter list endpoints;
* sort list endpoints;
* validate requests;
* return consistent success responses;
* return consistent errors;
* use appropriate HTTP status codes;
* implement IP-based rate limiting;
* document the API;
* deploy the API publicly;
* verify it outside the local environment;
* consume the deployed API through a minimal client.

---

# 4. Source-of-Truth Rules

The attached bootcamp assessment is the authoritative source for Task 1 requirements.

This PRD translates those requirements into the selected transport domain.

The following distinction must be maintained:

### Assessment requirements

Requirements explicitly stated by the bootcamp brief.

### Implementation decisions

Technical and domain decisions selected for this project where the assessment allows a choice.

Implementation decisions must never remove or weaken an assessment requirement.

If a technical implementation decision changes later, the change must be documented rather than silently changing the API contract.

---

# 5. Scope

## 5.1 In Scope

### API

* Public REST API
* Versioned `/api/v1/` paths
* Related transport resources
* Collection endpoints
* Item endpoints
* Nested resource endpoint
* Pagination
* Filtering
* Sorting
* Request validation
* Consistent response envelope
* Consistent error envelope
* Honest HTTP status codes
* IP-based rate limiting

### Database

* Managed PostgreSQL
* Relational resource model
* Generated identifiers
* Realistic data
* Few hundred records per resource
* Repeatable seed script

### Consumer

* One minimal consumer page
* List of API data
* Filter control
* Next-page control
* Empty state
* Error state

### Documentation

* README API documentation
* Endpoint examples
* curl examples
* Example responses
* Design decisions
* Deployment information

### Evidence

* Live API URL
* Public curl response
* Rate-limit response
* Consumer screenshot
* Seed script

---

# 6.2 Out of Scope

The following must not be built:

* Authentication for reading
* Landing page
* Admin panel
* Full transport booking application
* Full customer dashboard
* Full driver application
* Full operator application
* Marketing website
* Unrelated product features

The API is the product.

The consumer exists only to demonstrate that the public API works from outside its own codebase.

---

# 7. Locked Technology Stack

The following stack is locked for implementation.

| Layer                 | Technology                                        |
| --------------------- | ------------------------------------------------- |
| Language              | TypeScript                                        |
| Application framework | Next.js                                           |
| API architecture      | REST                                              |
| Database              | PostgreSQL                                        |
| Database provider     | Neon                                              |
| ORM                   | Prisma                                            |
| Validation            | Zod                                               |
| Data generation       | `@faker-js/faker`                                 |
| Public identifiers    | UUID v4                                           |
| Pagination            | Cursor pagination                                 |
| Rate limiting         | IP-based application-level rate limiting          |
| Configuration         | Centralized configuration + environment variables |
| Consumer              | Next.js                                           |
| Deployment            | Vercel                                            |
| Package manager       | npm                                               |

---

# 8. Technology Decisions

## 8.1 TypeScript

TypeScript is the locked project language.

It will be used across:

* API handlers;
* validation schemas;
* database access;
* seed scripts;
* consumer application.

---

## 8.2 Next.js

Next.js will provide the application framework.

The API and minimal consumer can exist within the same TypeScript application.

The project must remain API-first.

The consumer must not become a full frontend application.

---

## 8.3 PostgreSQL

PostgreSQL is required because the assessment explicitly requires a managed PostgreSQL database.

The production database will use Neon.

---

## 8.4 Prisma

Prisma will be used as the database access layer.

It will represent:

* routes;
* vehicles;
* passengers;
* bookings;
* their relationships.

---

## 8.5 Zod

Zod will be used as the schema validator.

Validation schemas must cover:

* request bodies;
* query parameters;
* pagination parameters;
* filtering parameters;
* sorting parameters;
* applicable path parameters.

---

## 8.6 Faker

`@faker-js/faker` will be used to generate realistic transport data.

The assessment explicitly identifies Faker as a suitable professional default for generating realistic names, addresses, prices, dates, and text.

---

## 8.7 UUID v4

UUID v4 will be used for resource identifiers.

Identifiers must be generated and non-sequential.

Sequential integer IDs must not be exposed as public resource identifiers.

The assessment specifically warns against sequential identifiers because they make dataset enumeration possible.

---

## 8.8 Cursor Pagination

Cursor pagination is selected for this implementation.

The assessment identifies cursor pagination as the Excellent-level implementation when its tradeoff against offset pagination is explained.

The README must therefore explain:

* why cursor pagination was selected;
* how cursor pagination works;
* how it differs from offset pagination;
* when offset pagination would be preferable;
* the tradeoff introduced by cursor pagination.

---

## 8.9 Vercel

Vercel will be used to deploy the Next.js application publicly.

The assessment explicitly identifies Vercel as one acceptable deployment option.

---

## 8.10 Neon

Neon PostgreSQL will be used as the managed production PostgreSQL database.

Database credentials must be provided through environment variables.

Secrets must not be committed.

---

# 9. Domain Model

The transport API will contain four primary resource types:

1. Route
2. Vehicle
3. Passenger
4. Booking

These resources provide the required relationships.

---

# 10. Resource Relationships

```text
Route
 ├── has many Vehicles
 └── has many Bookings

Vehicle
 └── belongs to Route

Passenger
 └── has many Bookings

Booking
 ├── belongs to Route
 ├── belongs to Passenger
 └── optionally references Vehicle
```

Relationship requirements:

* A route can have many vehicles.
* A route can have many bookings.
* A vehicle belongs to one route.
* A passenger can have many bookings.
* A booking belongs to one route.
* A booking belongs to one passenger.
* A booking may reference one vehicle.

---

# 11. Resource Specification

## 11.1 Route

A Route represents a transport service between an origin and destination.

### Fields

| Field           | Type        | Required | Description                              |
| --------------- | ----------- | -------: | ---------------------------------------- |
| `id`            | UUID        |      Yes | Generated public identifier              |
| `name`          | string      |      Yes | Human-readable route name                |
| `origin`        | string      |      Yes | Starting location                        |
| `destination`   | string      |      Yes | Destination location                     |
| `status`        | string/enum |      Yes | Route status                             |
| `departureTime` | datetime    |      Yes | Scheduled departure                      |
| `arrivalTime`   | datetime    |      Yes | Scheduled arrival                        |
| `fareMinor`     | integer     |      Yes | Fare represented in minor currency units |
| `currency`      | string      |      Yes | Currency code                            |
| `createdAt`     | datetime    |      Yes | Creation timestamp                       |
| `updatedAt`     | datetime    |      Yes | Last update timestamp                    |

### Route status

The implementation may use:

* `active`
* `inactive`

---

# 11.2 Vehicle

A Vehicle represents a transport vehicle assigned to a route.

### Fields

| Field                | Type        | Required | Description                 |
| -------------------- | ----------- | -------: | --------------------------- |
| `id`                 | UUID        |      Yes | Generated public identifier |
| `routeId`            | UUID        |      Yes | Parent route                |
| `registrationNumber` | string      |      Yes | Vehicle registration        |
| `make`               | string      |      Yes | Manufacturer                |
| `model`              | string      |      Yes | Vehicle model               |
| `capacity`           | integer     |      Yes | Passenger capacity          |
| `status`             | string/enum |      Yes | Vehicle availability state  |
| `createdAt`          | datetime    |      Yes | Creation timestamp          |
| `updatedAt`          | datetime    |      Yes | Last update timestamp       |

### Vehicle status

The implementation may use:

* `available`
* `maintenance`
* `inactive`

---

# 11.3 Passenger

A Passenger represents a customer using the transport service.

### Fields

| Field       | Type     | Required | Description                 |
| ----------- | -------- | -------: | --------------------------- |
| `id`        | UUID     |      Yes | Generated public identifier |
| `firstName` | string   |      Yes | Passenger first name        |
| `lastName`  | string   |      Yes | Passenger last name         |
| `email`     | string   |      Yes | Passenger email             |
| `phone`     | string   |      Yes | Passenger phone             |
| `createdAt` | datetime |      Yes | Creation timestamp          |
| `updatedAt` | datetime |      Yes | Last update timestamp       |

---

# 11.4 Booking

A Booking represents a passenger booking for a route.

### Fields

| Field              | Type        | Required | Description                      |
| ------------------ | ----------- | -------: | -------------------------------- |
| `id`               | UUID        |      Yes | Generated public identifier      |
| `routeId`          | UUID        |      Yes | Related route                    |
| `passengerId`      | UUID        |      Yes | Related passenger                |
| `vehicleId`        | UUID        |       No | Assigned vehicle                 |
| `bookingReference` | string      |      Yes | Human-readable booking reference |
| `seatNumber`       | string      |       No | Assigned seat                    |
| `status`           | string/enum |      Yes | Booking state                    |
| `fareMinor`        | integer     |      Yes | Fare in minor currency units     |
| `currency`         | string      |      Yes | Currency code                    |
| `bookedAt`         | datetime    |      Yes | Booking time                     |
| `createdAt`        | datetime    |      Yes | Creation timestamp               |
| `updatedAt`        | datetime    |      Yes | Last update timestamp            |

### Booking status

The implementation may use:

* `pending`
* `confirmed`
* `cancelled`

---

# 12. Identifier Requirements

Every primary resource identifier must be:

* generated;
* non-sequential;
* unique;
* safe to expose publicly.

Use UUID v4.

Do not use:

```text
1
2
3
4
5
```

as public resource identifiers.

---

# 13. Data Requirements

The API must contain realistic data.

Ten records are insufficient for demonstrating list behavior.

The assessment requires a few hundred records per resource.

Target seed volume:

| Resource   | Target |
| ---------- | -----: |
| Routes     |   300+ |
| Vehicles   |   300+ |
| Passengers |   300+ |
| Bookings   |   300+ |

The exact count may be configurable as long as production meets the required scale.

---

# 14. Seed Script

A repeatable seed script is mandatory.

The script must:

1. generate realistic data;
2. create routes;
3. create vehicles related to routes;
4. create passengers;
5. create bookings related to routes and passengers;
6. maintain valid relationships;
7. be safe to run repeatedly;
8. avoid duplicate records;
9. be committed to GitHub.

The database itself must not be committed as a dump.

The assessment specifically requires the seed script to be committed and prohibits committing a database dump.

---

# 15. API Versioning

Every endpoint must use:

```text
/api/v1/
```

Example:

```text
GET /api/v1/routes
```

Never expose an unversioned equivalent such as:

```text
GET /routes
```

Versioning must exist from the first implementation.

The assessment explicitly requires `/v1/` in every API path.

---

# 16. REST Resource Rules

Resource names must be plural nouns.

Examples:

```text
/routes
/vehicles
/passengers
/bookings
```

The HTTP method communicates the action.

Do not create action-heavy routes such as:

```text
/createBooking
/getRoutes
/updateBooking
```

---

# 17. Endpoint Specification

## 17.1 Routes

### List routes

```http
GET /api/v1/routes
```

Requirements:

* cursor pagination;
* filtering;
* sorting.

### Get route

```http
GET /api/v1/routes/:id
```

### Get route vehicles

```http
GET /api/v1/routes/:id/vehicles
```

This is the nested resource endpoint.

---

# 17.2 Vehicles

### List vehicles

```http
GET /api/v1/vehicles
```

Requirements:

* cursor pagination;
* filtering;
* sorting.

### Get vehicle

```http
GET /api/v1/vehicles/:id
```

---

# 17.3 Passengers

### List passengers

```http
GET /api/v1/passengers
```

Requirements:

* cursor pagination;
* filtering;
* sorting.

### Get passenger

```http
GET /api/v1/passengers/:id
```

---

# 17.4 Bookings

### List bookings

```http
GET /api/v1/bookings
```

Requirements:

* cursor pagination;
* filtering;
* sorting.

### Get booking

```http
GET /api/v1/bookings/:id
```

### Create booking

```http
POST /api/v1/bookings
```

### Update booking

```http
PATCH /api/v1/bookings/:id
```

### Delete booking

```http
DELETE /api/v1/bookings/:id
```

---

# 18. Collection Endpoint Requirements

Every list endpoint must provide:

* pagination;
* filtering on at least two fields;
* sorting.

This applies to:

* routes;
* vehicles;
* passengers;
* bookings;
* nested vehicle collections.

---

# 19. Pagination Contract

## Default

```text
limit = 20
```

## Maximum

```text
limit = 100
```

A request for more than 100 records must never return more than the configured maximum.

The assessment specifically requires a `limit=5000` request to be clamped rather than honored.

---

# 20. Cursor Pagination Contract

Use:

```text
limit
cursor
```

Example:

```http
GET /api/v1/routes?limit=20
```

Next page:

```http
GET /api/v1/routes?limit=20&cursor=<cursor>
```

---

# 21. Pagination Metadata

Every collection response must return:

* total count;
* limit;
* next cursor;
* whether another page exists.

Example:

```json
{
  "data": [
    {
      "id": "4a7d7f7d-9f8a-4b4a-bb6d-3a4f5e6a7b8c",
      "name": "Lagos to Ibadan Express",
      "origin": "Lagos",
      "destination": "Ibadan"
    }
  ],
  "meta": {
    "total": 340,
    "limit": 20,
    "nextCursor": "eyJpZCI6IjRhN2Q3ZjcifQ",
    "hasMore": true
  }
}
```

Final page:

```json
{
  "data": [],
  "meta": {
    "total": 340,
    "limit": 20,
    "nextCursor": null,
    "hasMore": false
  }
}
```

---

# 22. Filtering

Every collection endpoint must support filtering on at least two fields.

## Routes

Supported filters:

```text
origin
destination
status
```

Example:

```http
GET /api/v1/routes?origin=Lagos&status=active
```

---

## Vehicles

Supported filters:

```text
routeId
status
make
```

Example:

```http
GET /api/v1/vehicles?status=available&make=Toyota
```

---

## Passengers

Supported filters:

```text
firstName
lastName
email
```

Example:

```http
GET /api/v1/passengers?firstName=John&lastName=Smith
```

---

## Bookings

Supported filters:

```text
routeId
passengerId
status
```

Example:

```http
GET /api/v1/bookings?status=confirmed&routeId=<route-id>
```

---

# 23. Sorting

Every list endpoint must support:

```text
sort
order
```

Example:

```http
GET /api/v1/routes?sort=departureTime&order=desc
```

Allowed order values:

```text
asc
desc
```

Unknown sort fields must return `400`.

The API must not silently ignore an invalid sort field.

---

# 24. Success Response Envelope

All successful responses must use a consistent envelope.

## Collection

```json
{
  "data": [],
  "meta": {}
}
```

## Single resource

```json
{
  "data": {}
}
```

Different endpoints must not invent unrelated response structures.

---

# 25. Error Response Envelope

All API errors must use:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Route not found"
  }
}
```

The error shape must remain consistent.

Do not return:

```json
{
  "message": "Route not found"
}
```

on one endpoint and a different structure elsewhere.

---

# 26. HTTP Status Codes

The API must use honest status codes.

Required statuses:

| Situation                       | HTTP status |
| ------------------------------- | ----------: |
| Successful GET                  |         200 |
| Successful POST                 |         201 |
| Invalid request/query           |         400 |
| Resource not found              |         404 |
| Request body validation failure |         422 |
| Rate limit exceeded             |         429 |

Never return `200` when the request actually failed.

---

# 27. Request Validation

All request bodies and query parameters must be validated using Zod.

Validation must happen before business logic executes.

Validation schemas must define:

* accepted fields;
* field types;
* required fields;
* allowed values;
* pagination limits;
* supported filters;
* supported sort fields.

---

# 28. Ugly Input Requirements

Before deployment, explicitly test the following.

## 28.1 Excessive limit

Request:

```http
GET /api/v1/routes?limit=5000
```

Expected:

```text
limit = 100
```

The API must clamp the value to the configured maximum.

It must not attempt to return 5000 records.

---

## 28.2 Negative offset

The assessment specifically requires a negative offset to return `400`.

Because this implementation uses cursor pagination, offset should not be exposed as a supported pagination parameter.

If offset exists anywhere in the implementation, negative values must return:

```text
400 Bad Request
```

with a clear error.

---

## 28.3 Unknown sort field

Request:

```http
GET /api/v1/routes?sort=doesNotExist
```

Expected:

```text
400 Bad Request
```

---

## 28.4 Malformed identifier

Requesting an invalid identifier must return:

```text
400
```

or:

```text
404
```

It must never return:

```text
500
```

---

## 28.5 Missing required POST field

Example:

```http
POST /api/v1/bookings
```

with a required field omitted.

Expected:

```text
422 Unprocessable Entity
```

The error must identify the missing field.

---

# 29. Rate Limiting

The public API is unauthenticated.

It must use IP-based rate limiting.

Target:

```text
100 requests per minute
```

The assessment describes this as a target threshold rather than requiring the exact number.

For this implementation, use:

```text
100 requests / 60 seconds / IP
```

---

# 30. Rate Limit Configuration

The rate limit must not be hard-coded inside an API handler.

Use centralized configuration.

Example:

```env
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

The handler must consume the configuration.

---

# 31. Rate Limit Response

When the limit is exceeded:

```text
429 Too Many Requests
```

The response must include:

```http
Retry-After: <seconds>
```

The response body must use the normal error envelope:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Try again later."
  }
}
```

---

# 32. Consumer Application

The consumer is intentionally minimal.

It must contain:

### 1. Data list

Displays data retrieved from the API.

### 2. Filter

Allows the user to filter the displayed resource.

### 3. Next page

Requests the next cursor/page from the API.

The consumer must call the public deployed API URL.

It must not call:

```text
localhost
```

The assessment explicitly requires the consumer to call the public URL.

---

# 33. Consumer Empty State

If the API returns no records:

Display a clear empty state.

Example:

```text
No routes found.
Try changing your filters.
```

The exact wording is an implementation choice.

---

# 34. Consumer Error State

If the API request fails:

Display a clear error state.

Example:

```text
Unable to load routes.
Please try again.
```

The consumer must not silently fail.

Handling empty and error states is part of the Excellent-level target.

---

# 35. API Documentation

The README is the primary API documentation.

A developer who has never interacted with the project must be able to use the API from the README alone.

For every endpoint document:

* HTTP method;
* path;
* description;
* query parameters;
* parameter types;
* defaults;
* request body;
* curl example;
* example response;
* relevant errors.

---

# 36. README Design Decisions

The README must contain a section titled:

```text
Design decisions
```

It must explain:

### Why these resources?

Explain why routes, vehicles, passengers, and bookings form a coherent transport API.

### Why generated identifiers?

Explain the security problem with sequential public identifiers.

### Why cursor pagination?

Explain the choice and the tradeoff against offset pagination.

### Why the response envelope?

Explain why every endpoint uses a consistent response structure.

---

# 37. Deployment

The API must be deployed to a public URL.

Deployment stack:

```text
Next.js
   ↓
Vercel
   ↓
Neon PostgreSQL
```

Environment variables must be configured through the deployment platform.

Do not commit:

* database passwords;
* database URLs containing credentials;
* API secrets;
* deployment secrets.

---

# 38. Production Database

The production database must be a managed PostgreSQL database.

Use Neon.

The production seed script must be executed against the production database.

The deployed API must contain real seeded data before evidence is captured.

The assessment explicitly warns against deploying without running the seed because the live API can otherwise be empty.

---

# 39. External Verification

The deployed API must be tested outside the local development environment.

Verification should be performed from:

* another machine;
* another network;
* or a phone using mobile data.

The objective is to prove:

```text
Public Internet
      ↓
Public API URL
      ↓
Production database
```

not:

```text
Browser
   ↓
localhost
```

---

# 40. Evidence Requirements

The repository must contain evidence for the required claims.

## Evidence 1 — Live API

Capture:

* deployed URL;
* successful request.

---

## Evidence 2 — Paginated curl response

Capture a terminal screenshot showing curl hitting the public API and returning:

* data;
* pagination metadata;
* total count;
* next-page information.

---

## Evidence 3 — Rate limiting

Capture a screenshot showing:

```text
429 Too Many Requests
```

after exceeding the configured rate limit.

The screenshot should show the relevant response information, including `Retry-After`.

---

## Evidence 4 — Consumer

Capture the consumer displaying data from the deployed API.

The evidence must demonstrate that the consumer is using the public API rather than localhost.

---

## Evidence 5 — Seed script

The seed script must be committed to the repository.

---

# 41. Defence Preparation

The assessment provides four defence questions.

The implementation must be designed so each can be answered directly from the code/configuration.

---

## Defence Question 1

### Why did you choose cursor pagination, and when would the ot
