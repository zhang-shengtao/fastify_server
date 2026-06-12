import type {
  FastifyBaseLogger as FastifyBaseLoggerBase,
  FastifyInstance as FastifyInstanceBase,
  FastifyReply as FastifyReplyBase,
  FastifyRequest as FastifyRequestBase,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import type { JWT } from "@fastify/jwt";
import type { FastifyRedis } from "@fastify/redis";
import type { MySql2Database } from "drizzle-orm/mysql2";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { BusinessCode } from "@/common/app-error";
import type { JwtPayload } from "./auth";
import { PermissionCode } from "@/permissions";

type JwtNamespace = Omit<JWT, "admin" | "user">;
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
  }
  interface JWT {
    admin: JwtNamespace;
    user: JwtNamespace;
  }
}

declare module "fastify" {
  interface FastifyContextConfig {
    is_auth?: boolean;
    permission?: PermissionCode;
  }

  interface FastifyInstance {
    redis: FastifyRedis;
    db: MySql2Database;
    user?: JwtPayload;
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
    FastifyBaseLoggerBase,
    ZodTypeProvider
  >;
  type FastifyRequest = FastifyRequestBase;
  type FastifyReply = FastifyReplyBase;
  type FastifyBaseLogger = FastifyBaseLoggerBase;
}
