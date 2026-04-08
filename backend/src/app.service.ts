import { Injectable } from '@nestjs/common';

/**
 * Keeps root endpoint output stable for health and observability checks.
 */
@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'taskmanager-api',
      timestamp: new Date().toISOString(),
    };
  }
}
