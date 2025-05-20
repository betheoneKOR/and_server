import {
  Controller,
  Get,
  Query,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';

@ApiTags('RTData API')
@Controller('RTData')
export class RTDataController {
  private readonly logsDir = '/mnt/data/collected_logs';

  // ✅ 파일 리스트 제공 (year, month 선택 가능)
  @Get('list')
  getList(
    @Query('year') year?: string,
    @Query('month') month?: string,
  ): string[] {
    const files = fs
      .readdirSync(this.logsDir)
      .filter((file) => /^\d{4}-\d{2}-\d{2}\.\d{2}\.\d{2}\.\d{2}_/.test(file));

    if (year && month) {
      const pattern = `${year}-${month}`;
      return files.filter((file) => file.startsWith(pattern));
    }

    return files;
  }

  // ✅ 파일 다운로드 (단일 or 다중 압축)
  @Get('download')
  async download(
    @Res() res: Response,
    @Query('file') file?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    // ✅ 특정 파일 하나 다운로드
    if (file) {
      const filePath = path.join(this.logsDir, file);
      if (fs.existsSync(filePath)) {
        return res.download(filePath);
      } else {
        return res.status(404).json({ message: 'File not found' });
      }
    }

    // ✅ 연/월 기반 zip 압축 다운로드
    if (year && month) {
      const allFiles = fs.readdirSync(this.logsDir);
      const matchedFiles = allFiles.filter((f) =>
        f.startsWith(`${year}-${month}`),
      );

      if (matchedFiles.length === 0) {
        return res
          .status(404)
          .json({ message: 'No files found for that month' });
      }

      const zipName = `RTData_${year}-${month}.zip`;
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipName}"`,
      });

      const archive = archiver('zip');
      archive.pipe(res);

      for (const file of matchedFiles) {
        const fullPath = path.join(this.logsDir, file);
        archive.file(fullPath, { name: file });
      }

      await archive.finalize();
      return;
    }

    // ❌ 아무 것도 안 보낸 경우
    throw new BadRequestException(
      'You must provide either "file" or "year"+"month" query parameter.',
    );
  }
}
