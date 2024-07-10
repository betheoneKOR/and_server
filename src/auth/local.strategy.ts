import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * PassportStrategy를 상속받아 LocalStrategy를 제공함
 * local-passport는 생성자에게 전달할 인자가 없으므로 super()만 사용
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(LocalStrategy.name);

    constructor(private authService: AuthService) {
        super();
    }

    /**
     * AuthGuard('local')를 호출 시 validate 함수를 실행함
     * validateUser를 통해 user를 반환함
     * @param username : string
     * @param password : string
     * @returns any
     */
    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}