import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Machine } from 'src/postgresql/entities/machine.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'betheone',
      password: '1234',
      database: 'focas',
      entities: [User, Machine],
      synchronize: true, // Only use in dev
    }),
    TypeOrmModule.forFeature([User, Machine]),
  ],
})
export class PostgresqlModule {}
