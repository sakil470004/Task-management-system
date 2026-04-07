import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * PrismaService manages database connections using Prisma v7 with PostgreSQL adapter.
 * Prisma v7 requires an explicit adapter for direct database connections.
 *
 * This fixes: "PrismaClient needs to be constructed with non-empty valid PrismaClientOptions"
 * Root cause: Without adapter, PrismaClient cannot initialize in Docker with PostgreSQL
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor() {
    // Create PrismaPg adapter with DATABASE_URL from environment
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    // Initialize PrismaClient with adapter (REQUIRED in Prisma v7)
    this.prisma = new PrismaClient({
      adapter,
      log: ['info', 'warn', 'error'],
    });
  }

  /**
   * Connect to database when NestJS module initializes
   */
  async onModuleInit() {
    await this.prisma.$connect();
  }

  /**
   * Disconnect from database when NestJS module destroys
   */
  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  /**
   * Proxy Prisma model operations for type-safe access
   */
  get user() {
    return this.prisma.user;
  }

  get task() {
    return this.prisma.task;
  }

  get auditLog() {
    return this.prisma.auditLog;
  }

  /**
   * Proxy Prisma client methods
   */
  get $transaction() {
    return this.prisma.$transaction.bind(this.prisma);
  }

  get $connect() {
    return this.prisma.$connect.bind(this.prisma);
  }

  get $disconnect() {
    return this.prisma.$disconnect.bind(this.prisma);
  }
}
