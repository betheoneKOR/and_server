import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { MqttService } from './mqtt.service';

@Controller('mqtt')
export class MqttController {
  private readonly logger = new Logger(MqttController.name);


}

