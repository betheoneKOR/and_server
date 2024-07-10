import { Controller, Get, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  private readonly logger = new Logger(AuthController.name);

  /**
   * LocalAuthGuard의 LocalStrategy를 통과해야 접근 가능함
   * 참고 : local.strategy.ts
   */
  @UseGuards(LocalAuthGuard)
  @Post('local-login')
  async local_login(@Req() req: Request, @Res() res: Response) {
    return res.send(await this.authService.validateUser(req.body.username, req.body.password));
  }

  /**
   * LocalAuthGuard를 통과 후, JWT토큰 발급
   * @returns access_token 형식으로 return
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    return res.send(await this.authService.login(req.body));
  }

  /**
   * JwtAuthGuard를 검증하는 함수
   * 참고 : jwt.strategy.ts
   * @returns 
   */
  @UseGuards(JwtAuthGuard)
  @Get('check-login')
  async CheckLogin(@Req() req: Request, @Res() res: Response) {
    return res.send(req.user);
  }
}