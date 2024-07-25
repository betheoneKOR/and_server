// mqtt.module.ts
import { Module, Global } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { connect, MqttClient } from 'mqtt';
import { mqttOptions } from './mqtt-config';
/**
 * MQTT_SERVICE를 글로벌 모듈로 설정
 * 'MQTT_SERVICE' 클라이언트 모듈을 애플리케이션에서 사용할 수 있게 명시
 */
@Global()
@Module({
  providers: [
    {
      provide: 'MQTT_CLIENT',
      useFactory: (): MqttClient => {
        const client = connect('mqtt://192.168.0.104:1883', mqttOptions);

        client.on('connect', () => {
          console.log('Connected to MQTT broker');
        });

        client.on('error', (err) => {
          console.error('MQTT Connection error:', err);
        });

        return client;
      },
    },
    // MqttService,
  ],
  // controllers: [MqttController],
  exports: ['MQTT_CLIENT'],
})
export class MqttModule {}
