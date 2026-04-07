import "dotenv/config";

// Prisma v7 configuration with database URL for migrations
export default {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
