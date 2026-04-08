import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

/**
 * Provides user lookup primitives used by auth and task services.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email: email.toLowerCase().trim(),
      },
    });
  }

  findById(id: number) {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findAll() {
    const rows = await this.usersRepository.find({
      order: {
        id: 'ASC',
      },
    });

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      createdAt: row.createdAt,
    }));
  }
}
