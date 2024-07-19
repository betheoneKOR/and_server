import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * jwt-passport를 상속 후 JwtAuthGuard 클래스를 제공함
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
