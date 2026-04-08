import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Provides lightweight health metadata for container readiness checks.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth() {
    return this.appService.getHealth();
  }
}
