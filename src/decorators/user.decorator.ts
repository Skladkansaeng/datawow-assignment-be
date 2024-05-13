import {
  ExecutionContext,
  Logger,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const getToken = (authHeader?: string) => {
  const tokenArray = authHeader.split(' ', 2);
  if (!tokenArray[0] || tokenArray[0].toLowerCase() !== 'bearer') {
    throw new UnauthorizedException('Token type must be Bearer');
  }
  return tokenArray[1];
};

export const AuthUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<any> => {
    try {
      const request = ctx.switchToHttp().getRequest();

      const { authorization } = request.headers;
      let authorizationString = '';
      if (Array.isArray(authorization)) {
        authorizationString = authorization[0];
      } else {
        authorizationString = authorization;
      }

      return new JwtService().verify(getToken(authorizationString), {
        secret: 'secret',
      });
    } catch (err) {
      new Logger('AuthDecorator').error(err);
      throw new UnauthorizedException();
    }
  },
);
