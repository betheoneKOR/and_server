import { Module } from '@nestjs/common';
import { RTDataController } from './RTData/api.controller';

@Module({
    imports: [],
      controllers: [RTDataController],
      providers: []
})
export class ApiModule {}
