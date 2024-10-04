import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { MqttClient } from 'mqtt';
import { Subject } from 'rxjs';
import { MachinesService } from 'src/machines/machines.service';

@Injectable()
export class MqttService implements OnModuleInit {
  private readonly logger = new Logger(MqttService.name);
  private readonly qosLevel = 2;
  private returnMessage$ = new Subject<any>();

  constructor(
    @Inject('MQTT_CLIENT') private readonly mqttClient: MqttClient,
    private readonly machinesService: MachinesService,
  ) {}

  /**
   * 모듈 초기 구성 시 동적 값에 따른 함수 구현
   */
  async onModuleInit() {
    const userNumber = await this.machinesService.getCount();
    let i=1;
    while(i<userNumber+1) {
      await this.subscribeToTopic([`${i}/Event`, `${i}/Error`, `${i}/Return`]);
      i++;
    }

    // setTimeout(() => {
    //   this.publish('Event', 'test');
    // }, 3000)
  }

  /**
   * Mqtt Subscribe
   * @param topics : string[]
   */
  async subscribeToTopic(topics: string[]): Promise<void> {
    topics.forEach((topic) => {
      this.mqttClient.subscribe(topic, { qos: this.qosLevel }, (err) => {
        if (err) {
          this.logger.error(`Failed to subscribe to topic ${topic}`, err);
        } else {
          this.logger.log(`Subscribed to topic ${topic}`);
        }
      });
    });

    this.mqttClient.on('message', (receivedTopic, message) => {
      if (receivedTopic === 'Return') {
        this.handleReturnMessage(message.toString());
      }

      // if (topics.includes(receivedTopic)) {
      //   this.logger.log(
      //     `Received message on ${receivedTopic}: ${message.toString()}`,
      //   );
      // }
    });
  }

  async publishAndReceive(topic: string, message: any): Promise<any> {
    this.mqttClient.publish(topic, message);

    // const response = await this.waitForReturnMessage();
    // return response;
  }

  // "Return" 토픽에서 들어온 메시지 처리
  private handleReturnMessage(message: any) {
    this.returnMessage$.next(message);
  }

  // "Return" 토픽에서 들어오는 첫 번째 메시지를 반환
  public getReturnMessage(): Promise<any> {
    return new Promise((resolve) => {
      this.returnMessage$.subscribe((message) => {
        resolve(message);
      });
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
