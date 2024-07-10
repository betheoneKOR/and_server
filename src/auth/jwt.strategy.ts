import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';

/**
 * PassportStrategy를 상속받아 JwtStrategy 제공함
 * 생성자에게 super내부의 인자를 상속인자로 전달
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secretKey'
        });
    }

    /**
     * AuthGuard('jwt')를 호출 시 validate 함수를 실행함
     * login시 발급받은 jwt토큰의 값을 return
     */
    async validate(payload: any) {
        return { id: payload.sub, username: payload.username };
      }
}