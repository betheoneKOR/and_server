import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { MqttClient } from 'mqtt';
import { Subject } from 'rxjs';
import { MachinesService } from 'src/machines/machines.service';
import { errorTopic, eventTopic, returnTopic } from './topicList';

@Injectable()
export class MqttService implements OnModuleInit {
  private readonly logger = new Logger(MqttService.name);
  private readonly qosLevel = 2;
  private returnMessages: { [key: string]: Subject<any> } = {};

  constructor(
    @Inject('MQTT_CLIENT') private readonly mqttClient: MqttClient,
    private readonly machinesService: MachinesService,
  ) {}

  /**
   * Postgresql에서 동적 Machine 수에 따른 함수 사용
   */
  async getMachineCount(): Promise<number> {
    const count:number = await this.machinesService.getCount();
    return count;
  }

  /**
   * 모듈 초기 구성 시 동적 값에 따른 함수 구현
   */
  async onModuleInit() {
    const count = await this.getMachineCount()
    let i = 1;
    while (i < count + 1) {
      await Promise.all(
        returnTopic.map(async (topic) => {
          await this.subscribeToTopic(`${i}${topic}`);
        }),
      );

      await Promise.all(
        errorTopic.map(async (topic) => {
          await this.subscribeToTopic(`${i}${topic}`);
        }),
      );

      await Promise.all(
        eventTopic.map(async (topic) => {
          await this.subscribeToTopic(`${i}${topic}`);
        }),
      );
      i++;
    }

    this.mqttClient.on('message', (topic, message) => {
      if (this.returnMessages[topic]) {
        this.returnMessages[topic].next(message.toString());
      }
    });
    // setTimeout(() => {
    //   this.publish('Event', 'test');
    // }, 3000)
  }

  /**
   * Mqtt Subscribe
   * @param topics : string[]
   */
  async subscribeToTopic(topic: string): Promise<void> {
    this.mqttClient.subscribe(topic, { qos: this.qosLevel }, (err) => {
      if (err) {
        this.logger.error(`Failed to subscribe to topic ${topic}`, err);
      } else {
        this.logger.log(`Subscribed to topic ${topic}`);
      }

      // 각 토픽에 대해 Subject를 초기화
      if (!this.returnMessages[topic]) {
        this.returnMessages[topic] = new Subject<any>();
      }
    });
  }

  async publishAndReceive(topic: string, message: any): Promise<any> {
    this.mqttClient.publish(topic, message);

    // const response = await this.waitForReturnMessage();
    // return response;
  }

  // // "Return" 토픽에서 들어온 메시지 처리
  // private handleReturnMessage(message: any) {
  //   this.returnMessages.next(message);
  // }

  // 개별 토픽의 응답을 반환
  public getReturnMessage(topic: string): Promise<any> {
    return new Promise((resolve) => {
      if (this.returnMessages[topic]) {
        this.returnMessages[topic].subscribe((message) => {
          resolve(message);
        });
      }
    });
  }

  /**
   * Mqtt Publish
   * @param topic : string
   * @param message : any
   */
  async publish(topic: string, message: any): Promise<void> {
    this.mqttClient.publish(
      topic,
      Buffer.from(message),
      { qos: this.qosLevel },
      (err) => {
        if (err)
          this.logger.error(`Failed to publish message to topic ${topic}`, err);
      },
    );
  }
}
