import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorator/role.decorator";

/**
 * CanActivate 인터페이스의 canActivate 메서드는 특정 요청이 핸들러에 접근할 수 있는지 결정
 * 1. requiredRoles는 reflector에서 ROLES_KEY에 대한 메타 데이터를 가져옴
 * 2. 만약 설정된 Role이 없다면 패스
 * 3. 요청 객체에서 user객체를 가져옴
 * 4. 사용자의 역할이 존재하는지 확인
 * 참고 : app.controller.ts
 */
@Injectable()
export class RolesGuard implements CanActivate {
    private readonly logger = new Logger(RolesGuard.name);
    constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    this.logger.debug(`User: ${JSON.stringify(user)}`);
    this.logger.debug(`User: ${JSON.stringify(user?.roles)}`);

    if (!user || !user.roles) {
        return false; // user 객체가 없거나 roles 속성이 없으면 접근 거부
      }
      
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}