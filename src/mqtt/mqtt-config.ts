import { MqttOptions, Transport } from '@nestjs/microservices';
import { IClientOptions, MqttClient } from 'mqtt/*';

/**
 * Mqtt Option
 * @param clean: 클라이언트가 구독한 모든 주제의 메시지는 브로커에 저장되지 않으며, 클라이언트가 연결할 때마다 모든 메시지와 구독 정보가 초기화
 * @param connectTimeout: (ms) 연결을 시도할때, 성공 또는 실패를 판별하는데 걸리는 시간
 * @param reconnectPeriod: (ms) 연결이 끊어진 후 재연결 시도를 하는 시간
 * @param keepalive: (s) Broker에게 주기적으로 ping을 보내는 간격
 * @param wiil: 연결이 불확실하게 끊겼을 때 보내는 유언
 */
export const mqttOptions: IClientOptions = {
  clientId: 'betheone',
  clean: true,
  connectTimeout: 5000,
  username: 'betheone',
  // password: 'password',
  reconnectPeriod: 3000,
  keepalive: 60,
  will: {
    topic: 'WillMsg',
    payload: Buffer.from('Connection Closed abnormally..!'),
    qos: 0,
    retain: false,
  },
};