import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * local-passport를 상속 후 LocalAuthGuard 클래스를 제공함
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
}