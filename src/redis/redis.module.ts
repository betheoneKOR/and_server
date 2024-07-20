import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * REDIS_CLIENT를 글로벌 모듈로 설정
 * 'REDIS_CLIENT' 프로바이더를 애플리케이션에서 사용할 수 있게 명시
 * useFactory: Redis client를 생성
 */
@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const redis = new Redis({
          host: 'localhost',
          port: 6379,
        });

        redis.on('connect', () => {
          console.log('Connected to Redis');
        });

        redis.on('error', (err) => {
          console.error('Redis error:', err);
        });

        return redis;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
