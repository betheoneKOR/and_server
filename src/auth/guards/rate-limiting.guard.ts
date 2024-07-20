import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

/**
 * RedisModule에서 제공되는 'REDIS_CLIENT'를 주입함
 * Redis에서 요청 ip의 요청 수를 관리하고 증가시킴
 * 요청 수가 1이면, 해당 키에 TTL(Time to Live)을 설정하고 해당 시간이 지나면 자동으로 해당 키가 삭제됨
 * 설정 값 이상 요청이 오게되면 Http 429 예외를 던짐
 */
@Injectable()
export class RateLimitingGuard implements CanActivate {
  private readonly MAX_REQUESTS = 10;
  private readonly WINDOW_SIZE_IN_SECONDS = 60;

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;

    const currentRequests = await this.redisClient.incr(ip);

    if (currentRequests === 1) {
      await this.redisClient.expire(ip, this.WINDOW_SIZE_IN_SECONDS);
    }

    if (currentRequests > this.MAX_REQUESTS) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    return true;
  }
}
