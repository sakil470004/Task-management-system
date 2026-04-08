import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity } from '../entities/audit-log.entity';

/**
 * Centralizes audit writes and read formatting for API consumers.
 */
@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  async log(userId: number | null, action: string, details: string) {
    const entity = this.auditLogRepository.create({
      userId,
      action,
      details,
    });

    await this.auditLogRepository.save(entity);
  }

  async findAll() {
    const rows = await this.auditLogRepository.find({
      relations: {
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return rows.map((row) => ({
      id: row.id,
      timestamp: row.createdAt.toISOString(),
      userName: row.user?.name ?? 'system',
      action: row.action,
      details: row.details,
    }));
  }
}
