import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // 모든 출처 허용 (보안상 주의)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // IP 주소와 포트 설정
  const host = '0.0.0.0'; // 모든 IP에서 접근 가능
  const port = 3000; // NestJS 서버가 사용할 포트

  await app.listen(port, host); // IP 주소와 포트를 함께 설정
  console.log(`Application is running on: http://${host}:${port}`);
}
bootstrap();
