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
export class LogsController {

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

  // @Post()
  // @ApiOperation({ summary: 'CSV 파일 업로드' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads', // 파일 저장 경로
  //       filename: (req, file, callback) => {
  //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         callback(null, `${uniqueSuffix}-${file.originalname}`);
  //       },
  //     }),
  //     fileFilter: (req, file, callback) => {
  //       if (!file.originalname.match(/\.(csv)$/)) {
  //         return callback(new Error('Only CSV files are allowed!'), false);
  //       }
  //       callback(null, true);
  //     },
  //   }),
  // )
  // uploadCsv(@UploadedFile() file: Express.Multer.File): string {
  //   return `File ${file.originalname} uploaded successfully!`;
  // }
}