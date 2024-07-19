import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = 'roles';
/**
 * Roles 데코레이트를 사용하여 엔드포인트를 보호함
 * @param roles 
 * @returns 
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);