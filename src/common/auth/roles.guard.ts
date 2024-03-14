
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/user/enum/role.enum';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const authenticated = await super.canActivate(context); //JwtStrategy 활성화
    if (!authenticated) {
      return false; 
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [ //컨트롤러 메서드 또는 컨트롤러 클래스에 지정된 역할(Role) 정보를 가져오는 부분
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest(); //JwtStrategy에서 반환한 사용자 정보
    return requiredRoles.some((role) => user.role === role);
  }
}