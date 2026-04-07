import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

/**
 * Users Service
 * Handles user-related database operations
 */
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find a user by email
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find a user by ID
   */
  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  /**
   * Get all users (for admin purposes)
   */
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  /**
   * Find user with full details (including password for auth)
   */
  async findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
