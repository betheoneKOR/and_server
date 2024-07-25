import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorator/role.decorator';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RateLimitingGuard } from './auth/guards/rate-limiting.guard';
import { MqttService } from './mqtt/mqtt.service';

/**
 * JwtAuthGuard를 통해 JWT데이터를 받음
 * RolesGuard를 통해 Role 검증을 실행함
 * RateLimitingGuard를 통해 요청 제한을 실행함
 */
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard, RateLimitingGuard)
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private readonly mqttService: MqttService
  ) {}
  
  @Get()
  @Roles('ADMIN', 'MASTER')
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Routing path에 따른 컨트롤러 구현
   */

  // #region System
  @Get('getMachineName')
  @Roles('MASTER', 'ADMIN', 'USER', 'CLIENT')
  getMachineName(): Promise<void> {
    return this.mqttService.publish('System/MachineName', '2');
  }

  @Get('getMachineModel')
  @Roles('MASTER', 'ADMIN', 'USER', 'CLIENT')
  getMachineModel(): Promise<void> {
    return this.mqttService.publish('System/MachineModel', '2');
  }
  // #endregion System

  // #region Status
  @Get('getHealthCheck')
  @Roles('MASTER', 'ADMIN', 'USER')
  getHealthCheck(): Promise<void> {
    return this.mqttService.publish('Status/HealthCheck', '2');
  }

  @Get('getIsRun')
  @Roles('MASTER', 'ADMIN', 'USER', 'CLIENT')
  getIsRun(): Promise<void> {
    return this.mqttService.publish('Status/IsRun', '2');
  }
  // #endregion

  // #region Actual
  @Get('getFeedrate')
  @Roles('MASTER', 'ADMIN')
  getFeedrate(): Promise<void> {
    return this.mqttService.publish('Actual/Feedrate', '2');
  }

  @Get('getSpindleSpeed')
  @Roles('MASTER', 'ADMIN')
  getSpindleSpeed(): Promise<void> {
    return this.mqttService.publish('Actual/SpindleSpeed', '2');
  }

  @Get('getLoadmeterSvPer')
  @Roles('MASTER', 'ADMIN')
  getLoadmeterSvPer(): Promise<void> {
    return this.mqttService.publish('Actual/LoadmeterSvPer', '2');
  }
  
  @Get('getLoadmeterSvAm')
  @Roles('MASTER', 'ADMIN')
  getLoadmeterSvAm(): Promise<void> {
    return this.mqttService.publish('Actual/LoadmeterSvAm', '2');
  }
  
  @Get('getLoadmeterSpPer')
  @Roles('MASTER', 'ADMIN')
  getLoadmeterSpPer(): Promise<void> {
    return this.mqttService.publish('Actual/getLoadmeterSpPer', '2');
  }
  
  @Get('getLoadmeterSvAv')
  @Roles('MASTER', 'ADMIN')
  getLoadmeterSvAv(): Promise<void> {
    return this.mqttService.publish('Actual/LoadmeterSvAv', '2');
  }

  @Get('getPos')
  @Roles('MASTER', 'ADMIN')
  getPos(): Promise<void> {
    return this.mqttService.publish('Actual/Pos', '2');
  }
  // #endregion

  // #region Modal
  @Get('getSequenceNumber')
  @Roles('MASTER', 'ADMIN', 'USER')
  getSequenceNumber(): Promise<void> {
    return this.mqttService.publish('Modal/SequenceNumber', '2');
  }
  
  @Get('getM_Feedrate')
  @Roles('MASTER', 'ADMIN', 'USER')
  getM_Feedrate(): Promise<void> {
    return this.mqttService.publish('Modal/M_Feedrate', '2');
  }

  @Get('getM_Spindle')
  @Roles('MASTER', 'ADMIN', 'USER')
  getM_Spindle(): Promise<void> {
    return this.mqttService.publish('Modal/M_Spindle', '2');
  }

  @Get('getM_Tool')
  @Roles('MASTER', 'ADMIN', 'USER')
  getM_Tool(): Promise<void> {
    return this.mqttService.publish('Modal/M_Tool', '2');
  }

  @Get('getM_Gcode')
  @Roles('MASTER', 'ADMIN', 'USER')
  getM_Gcode(): Promise<void> {
    return this.mqttService.publish('Modal/M_Gcode', '2');
  }
  
  @Get('getProgramNumber')
  @Roles('MASTER', 'ADMIN', 'USER')
  getProgramNumber(): Promise<void> {
    return this.mqttService.publish('Modal/ProgramNumber', '2');
  }

  @Get('getCycleTime')
  @Roles('MASTER', 'ADMIN', 'USER')
  getCycleTime(): Promise<void> {
    return this.mqttService.publish('Modal/CycleTime', '2');
  }
  // #endregion
}
