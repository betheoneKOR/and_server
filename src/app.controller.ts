import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorator/role.decorator';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

/**
 * JwtAuthGuard를 통해 JWT데이터를 받음
 * RolesGuard를 통해 Role 검증을 실행함
 */
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Roles('ADMIN')
  getHello(): string {
    return this.appService.getHello();
  }
}