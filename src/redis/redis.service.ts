import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  getClient(): Redis {
    return this.redisClient;
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }
}
