import {
  Controller,
  Get,
  Logger,
  OnModuleInit,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorator/role.decorator';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RateLimitingGuard } from './auth/guards/rate-limiting.guard';
import { MqttService } from './mqtt/mqtt.service';
import { Response } from 'express';
import { MachinesService } from './machines/machines.service';
import { topicMaps } from './mqtt/topicMap';

/**
 * JwtAuthGuard를 통해 JWT데이터를 받음
 * RolesGuard를 통해 Role 검증을 실행함
 * RateLimitingGuard를 통해 요청 제한을 실행함
 */
@Controller()
// @UseGuards(JwtAuthGuard, RolesGuard, RateLimitingGuard)
export class AppController implements OnModuleInit {
  private readonly logger = new Logger(AppController.name);
  private machineCount = 0;
  private readonly topicMaps = topicMaps;
  constructor(
    private readonly appService: AppService,
    private readonly mqttService: MqttService,
    private readonly machinesService: MachinesService,
  ) {}

  @Get()
  // @Roles('ADMIN', 'MASTER')
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Postgresql에서 동적 Machine 수에 따른 함수 사용
   */
  async getMachineCount(): Promise<void> {
    this.machineCount = await this.machinesService.getCount();
  }

  async onModuleInit() {
    await this.getMachineCount();
  }

  /**
   * Routing path에 따른 컨트롤러 구현
   * Routing path, Mqtt pub, sub routing은 topicMaps.ts 참조
   */
  // #region System
  @Get(`${topicMaps.MachineName.path}/:machineNumber`)
  // @Roles('MASTER', 'ADMIN', 'USER', 'CLIENT')
  async getMachineName(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response,
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.MachineName.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.MachineName.return}`,
    );
    return res.send(response);
  }

  @Get(`${topicMaps.MachineModel.path}/:machineNumber`)
  // @Roles('MASTER', 'ADMIN', 'USER', 'CLIENT')
  async getMachineModel(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.MachineModel.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.MachineModel.return}`,
    );
    return res.send(response);
  }
  // #endregion System

  // #region Status
  @Get(`${topicMaps.HealthCheck.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN', 'USER')
  async getHealthCheck(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.HealthCheck.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.HealthCheck.return}`,
    );
    return res.send(response);
  }

  @Get(`${topicMaps.GetIsRun.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN', 'USER', 'CLIENT')
  async getIsRun(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.GetIsRun.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.GetIsRun.return}`,
    );
    return res.send(response);
  }
  // #endregion

  // #region Actual
  @Get(`${topicMaps.GetFeedrate.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN')
  async getFeedrate(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.GetFeedrate.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.GetFeedrate.return}`,
    );
    return res.send(response);
  }

  @Get(`${topicMaps.GetSpindleSpeed.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN')
  async getSpindleSpeed(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.GetSpindleSpeed.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.GetSpindleSpeed.return}`,
    );
    return res.send(response);
  }

  @Get(`${topicMaps.GetLoadmeterSvPer.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN')
  async getLoadmeterSvPer(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.GetLoadmeterSvPer.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.GetLoadmeterSvPer.return}`,
    );
    return res.send(response);
  }

  @Get(`${topicMaps.GetLoadmeterSvAm.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN')
  async getLoadmeterSvAm(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.GetLoadmeterSvAm.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.GetLoadmeterSvAm.return}`,
    );
    return res.send(response);
  }

  @Get(`${topicMaps.GetLoadmeterSpPer.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN')
  async getLoadmeterSpPer(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.GetLoadmeterSpPer.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.GetLoadmeterSpPer.return}`,
    );
    return res.send(response);
  }

  @Get(`${topicMaps.GetLoadmeterSpAv.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN')
  async getLoadmeterSpAv(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.GetLoadmeterSpAv.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.GetLoadmeterSpAv.return}`,
    );
    return res.send(response);
  }

  @Get(`${topicMaps.GetPos.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN')
  async getPos(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.GetPos.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.GetPos.return}`,
    );
    return res.send(response);
  }
  // #endregion

  // #region Modal
  @Get(`${topicMaps.GetSequenceNumber.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN', 'USER')
  async getSequenceNumber(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.GetSequenceNumber.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.GetSequenceNumber.return}`,
    );
    return res.send(response);
  }

  @Get(`${topicMaps.GetM_Feedrate.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN', 'USER')
  async getM_Feedrate(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.GetM_Feedrate.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.GetM_Feedrate.return}`,
    );
    return res.send(response);
  }

  @Get(`${topicMaps.GetM_Spindle.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN', 'USER')
  async getM_Spindle(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.GetM_Spindle.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.GetM_Spindle.return}`,
    );
    return res.send(response);
  }

  @Get(`${topicMaps.GetM_Tool.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN', 'USER')
  async getM_Tool(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.GetM_Tool.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.GetM_Tool.return}`,
    );
    return res.send(response);
  }

  @Get(`${topicMaps.GetM_Gcode.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN', 'USER')
  async getM_Gcode(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.GetM_Gcode.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.GetM_Gcode.return}`,
    );
    return res.send(response);
  }

  @Get(`${topicMaps.GetProgramNumber.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN', 'USER')
  async getProgramNumber(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.GetProgramNumber.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.GetProgramNumber.return}`,
    );
    return res.send(response);
  }

  @Get(`${topicMaps.GetCycleTime.path}/:machineNumber`)
  @Roles('MASTER', 'ADMIN', 'USER')
  async getCycleTime(
    @Param('machineNumber') machineNumber: string,
    @Res() res: Response
  ): Promise<Response> {
    this.mqttService.publish(`${machineNumber}${this.topicMaps.GetCycleTime.system}`, '2');
    const response = await this.mqttService.getReturnMessage(
      `${machineNumber}${this.topicMaps.GetCycleTime.return}`,
    );
    return res.send(response);
  }
  // #endregion
}
