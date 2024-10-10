import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';
import { MqttModule } from './mqtt/mqtt.module';
import { MqttService } from './mqtt/mqtt.service';
import { PostgresqlModule } from './postgresql/postgresql.module';
import { MachinesModule } from './machines/machines.module';


@Module({
  imports: [AuthModule, RedisModule, MqttModule, MachinesModule, PostgresqlModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, MqttService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}