import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { MqttClient } from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private readonly logger = new Logger(MqttService.name);
  private readonly qosLevel = 2;

  constructor(@Inject('MQTT_CLIENT') private readonly mqttClient: MqttClient) {}

  async onModuleInit() {
    await this.subscribeToTopic(['Event', 'Error', 'Return']);

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
      if (topics.includes(receivedTopic)) {
        this.logger.log(
          `Received message on ${receivedTopic}: ${message.toString()}`,
        );
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
