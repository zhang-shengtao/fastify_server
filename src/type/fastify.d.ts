import type {
  FastifyBaseLogger,
  FastifyInstance as FastifyInstanceBase,
  FastifyReply as FastifyReplyBase,
  FastifyRequest as FastifyRequestBase,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import type { FastifyJwtNamespace } from "@fastify/jwt";
import type { FastifyRedis } from "@fastify/redis";
import type { MySql2Database } from "drizzle-orm/mysql2";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { BusinessCode } from "@/common/app-error";
import type { JwtPayload } from "./auth";
import { PermissionCode } from "@/permissions";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
  }
}

declare module "fastify" {
  interface FastifyContextConfig {
    isAuth?: boolean;
    permission?: PermissionCode;
  }
  interface FastifyInstance extends FastifyJwtNamespace<{ namespace: "admin" }>, FastifyJwtNamespace<{ namespace: "user" }> {
    redis: FastifyRedis;
    db: MySql2Database;
  }

  interface FastifyReply {
    success<T>(data: T, message?: string, code?: BusinessCode): FastifyReplyBase;
    errors(message: string, code?: BusinessCode): FastifyReplyBase;
  }
}

declare global {
  type FastifyInstance = FastifyInstanceBase<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    FastifyBaseLogger,
    ZodTypeProvider
  >;
  type FastifyRequest = FastifyRequestBase;
  type FastifyReply = FastifyReplyBase;
}
