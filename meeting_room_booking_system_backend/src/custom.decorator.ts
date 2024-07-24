import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
export const RequireLogin = () => {
  return SetMetadata('require-login', true);
};

export const RequirePermission = (...permissions: string[]) => {
  return SetMetadata('require-permission', permissions);
};

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user) {
      return data ? request.user[data] : request.user;
    } else {
      return null;
    }
  },
);
