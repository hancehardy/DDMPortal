import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin'
    }
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'user'
    }
  });

  console.log('Created users:', { admin, user });

  // Create door styles
  const doorStyles = [
    { name: 'Shaker', available: true },
    { name: 'Raised Panel', available: true },
    { name: 'Flat Panel', available: true },
    { name: 'Slab', available: true }
  ];

  for (const doorStyle of doorStyles) {
    await prisma.doorStyle.upsert({
      where: { name: doorStyle.name },
      update: {},
      create: doorStyle
    });
  }

  console.log('Created door styles');

  // Create manufacturers
  const manufacturers = [
    { name: 'Sherwin Williams' },
    { name: 'Benjamin Moore' },
    { name: 'Minwax' },
    { name: 'Natural Wood' }
  ];

  for (const manufacturer of manufacturers) {
    await prisma.manufacturer.upsert({
      where: { name: manufacturer.name },
      update: {},
      create: manufacturer
    });
  }

  console.log('Created manufacturers');

  // Create finishes
  const finishes = [
    { name: 'White', manufacturer: 'Sherwin Williams', sqftPrice: 12.50 },
    { name: 'Oak', manufacturer: 'Natural Wood', sqftPrice: 15.75 },
    { name: 'Cherry', manufacturer: 'Natural Wood', sqftPrice: 18.25 },
    { name: 'Maple', manufacturer: 'Natural Wood', sqftPrice: 16.50 }
  ];

  for (const finish of finishes) {
    await prisma.finish.upsert({
      where: { 
        name_manufacturer: {
          name: finish.name,
          manufacturer: finish.manufacturer
        }
      },
      update: {},
      create: finish
    });
  }

  console.log('Created finishes');

  // Create glass types
  const glassTypes = [
    { name: 'Clear', sqftPrice: 10, sqftMinimum: 1 },
    { name: 'Frosted', sqftPrice: 15, sqftMinimum: 1 },
    { name: 'Textured', sqftPrice: 20, sqftMinimum: 1 }
  ];

  for (const glassType of glassTypes) {
    await prisma.glassType.upsert({
      where: { name: glassType.name },
      update: {},
      create: glassType
    });
  }

  console.log('Created glass types');

  // Create size parameters
  const sizeParameters = [
    { name: 'Standard Height', inches: 30, mm: 762 },
    { name: 'Standard Width', inches: 24, mm: 610 },
    { name: 'Minimum Height', inches: 10, mm: 254 },
    { name: 'Maximum Height', inches: 96, mm: 2438 }
  ];

  for (const sizeParameter of sizeParameters) {
    await prisma.sizeParameter.upsert({
      where: { name: sizeParameter.name },
      update: {},
      create: sizeParameter
    });
  }

  console.log('Created size parameters');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 