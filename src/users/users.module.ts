import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { RedisModule } from 'src/redis/redis.module';
import { UsersService } from './users.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [RedisModule],
  controllers: [UsersController],
  providers: [UsersService, RedisService],
  exports: [UsersService]
})
export class UsersModule {}
