import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

// Create adapter with DATABASE_URL from environment
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Initialize PrismaClient with adapter (required in Prisma v7)
const prisma = new PrismaClient({
  adapter,
});

/**
 * Seed script to populate database with predefined users
 * Creates:
 * - Admin user: admin@example.com / admin123
 * - Normal user: user@example.com / user123
 */
async function main() {
  console.log('🌱 Seeding database...');

  // Hash passwords using bcrypt
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPasswordHash,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created/updated:', admin.email);

  // Create Normal user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPasswordHash,
      role: 'USER',
    },
  });
  console.log('✅ Normal user created/updated:', user.email);

  console.log('✨ Database seeding completed!');
}

// Execute seed function
main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
