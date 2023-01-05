import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { FastifyRequest } from "fastify";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorators";

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;
      requiredRoles.unshift("SuperAdmin");
    const { user } = context.switchToHttp().getRequest<FastifyRequest>();

    return requiredRoles.some((role) => user.Roles?.includes(role));
  }
}
