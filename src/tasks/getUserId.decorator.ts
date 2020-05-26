import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Decorator that returns userId from req.user object on authenticated requests
export const GetUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.id;
  },
);
