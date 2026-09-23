import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const existingRoutesCount = await prisma.route.count();
  
  if (existingRoutesCount > 0) {
    console.log('Database already seeded, skipping to prevent duplicates.');
    return;
  }

  // Set a seed for deterministic faker data
  faker.seed(1234);

  const RECORD_COUNT = 300;

  // 1. Routes
  console.log('Seeding Routes...');
  const routesData = [];
  for (let i = 0; i < RECORD_COUNT; i++) {
    const origin = faker.location.city();
    let destination = faker.location.city();
    while (destination === origin) {
      destination = faker.location.city();
    }
    
    // Future dates for departures/arrivals
    const departureTime = faker.date.soon({ days: 30 });
    const arrivalTime = new Date(departureTime.getTime() + faker.number.int({ min: 3600000, max: 18000000 })); // +1 to 5 hours

    routesData.push({
      id: faker.string.uuid(),
      name: `${origin} to ${destination} Express`,
      origin,
      destination,
      status: faker.helpers.arrayElement(['active', 'active', 'inactive']),
      departureTime,
      arrivalTime,
      fareMinor: faker.number.int({ min: 1000, max: 15000 }), // $10.00 to $150.00
      currency: 'USD',
    });
  }

  await prisma.route.createMany({
    data: routesData,
  });

  const createdRoutes = await prisma.route.findMany({ select: { id: true } });

  // 2. Vehicles
  console.log('Seeding Vehicles...');
  const vehiclesData = [];
  for (let i = 0; i < RECORD_COUNT; i++) {
    const route = faker.helpers.arrayElement(createdRoutes) as { id: string };
    
    vehiclesData.push({
      id: faker.string.uuid(),
      routeId: route.id,
      registrationNumber: faker.vehicle.vrm(),
      make: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      capacity: faker.number.int({ min: 20, max: 60 }),
      status: faker.helpers.arrayElement(['available', 'available', 'maintenance', 'inactive']),
    });
  }

  await prisma.vehicle.createMany({
    data: vehiclesData,
  });

  const createdVehicles = await prisma.vehicle.findMany({ select: { id: true, capacity: true, routeId: true } });

  // 3. Passengers
  console.log('Seeding Passengers...');
  const passengersData = [];
  for (let i = 0; i < RECORD_COUNT; i++) {
    passengersData.push({
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    });
  }

  await prisma.passenger.createMany({
    data: passengersData,
  });

  const createdPassengers = await prisma.passenger.findMany({ select: { id: true } });

  // 4. Bookings
  console.log('Seeding Bookings...');
  const bookingsData = [];
  for (let i = 0; i < RECORD_COUNT; i++) {
    const passenger = faker.helpers.arrayElement(createdPassengers) as { id: string };
    const vehicle = faker.helpers.arrayElement(createdVehicles) as { id: string, capacity: number, routeId: string };
    
    // Assign booking to the same route the vehicle is assigned to, for consistency
    const routeId = vehicle.routeId;
    
    // Find the actual route to get the fare (optional, but let's just mock the fare)
    const fareMinor = faker.number.int({ min: 1000, max: 15000 });
    
    bookingsData.push({
      id: faker.string.uuid(),
      routeId: routeId,
      passengerId: passenger.id,
      vehicleId: vehicle.id,
      bookingReference: faker.string.alphanumeric(8).toUpperCase(),
      seatNumber: `${faker.number.int({ min: 1, max: vehicle.capacity })}${faker.helpers.arrayElement(['A', 'B', 'C', 'D'])}`,
      status: faker.helpers.arrayElement(['pending', 'confirmed', 'confirmed', 'cancelled']),
      fareMinor: fareMinor,
      currency: 'USD',
      bookedAt: faker.date.recent({ days: 15 }),
    });
  }

  await prisma.booking.createMany({
    data: bookingsData,
  });

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
