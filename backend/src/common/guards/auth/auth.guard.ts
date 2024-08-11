import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PRIVATE_ROUTE } from 'src/common/decorators/private-route.decorator';
import { UsersService } from 'src/users/users.service';
import { CustomExpressRequest } from 'src/utils/types/custom-express-request.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<CustomExpressRequest>();
    const isPrivateRoute = this.reflector.get<boolean>(
      PRIVATE_ROUTE,
      context.getHandler(),
    );
    if (isPrivateRoute) {
      const token = req.header('authorization')?.replace('Bearer ', '');
      if (!token)
        throw new UnauthorizedException('No token provided, please login');

      const user = await this.usersService.verifyToken(token);
      req.user = user;
      return true;
    } else {
      return true;
    }
  }
}
