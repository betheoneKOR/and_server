import {
  Controller,
  Get,
  Query,
  Res 
} from '@nestjs/common';
import { Response } from 'express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('RTData API')
@Controller('RTData')
export class RTDataController {

  private readonly logsDir = '/mnt/data/collected_logs';

  @Get()
  getLogs(@Query('year') year?: string, @Query('month') month?: string) {
    const files = fs.readdirSync(this.logsDir).filter(file => file.startsWith('Log_'));

    if (year && month) {
      const pattern = `Log_${year}-${month}`;
      return files.filter(file => file.startsWith(pattern));
    }

    return files;
  }

  @Get('download')
  downloadLog(@Query('file') file: string, @Res() res: Response) {
    const filePath = path.join(this.logsDir, file);

    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  }
}