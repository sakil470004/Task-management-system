import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AuditModule } from './audits/audit.module';

/**
 * App Module
 * Root module that imports all feature modules
 */
@Module({
  imports: [
    AuthModule,
    UsersModule,
    TasksModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
