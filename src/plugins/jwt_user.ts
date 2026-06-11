import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { env } from "@/config/env";
import type { JwtPayload } from "@/type/auth";
import { AppError, BusinessCode } from "@/common/app-error";

async function userJwtPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyJwt, {
    namespace: "user",
    secret: env.USER_JWT_SECRET,
    sign: {
      iss: env.JWT_ISSUER_USER,
      expiresIn: env.ACCESS_TOKEN_TTL,
    },
    verify: {
      allowedIss: env.JWT_ISSUER_USER,
    },
  });

  fastify.addHook("preHandler", async (request, reply) => {
    if (!request.url.startsWith("/api")) return;
    const config = request.routeOptions.schema?.config;
    if (config?.is_auth === false) return;
    try {
      const authorization = request.headers.authorization;
      if (!authorization) throw new AppError(BusinessCode.UNAUTHORIZED, "授权失败请登录");
      const [scheme, token] = authorization.split(" ");
      if (scheme !== "Bearer" || !token) {
        throw new AppError(BusinessCode.UNAUTHORIZED, "授权失败请登录");
      }
      const payload = fastify.jwt.user.verify<JwtPayload>(token);
      if (!payload?.uid) {
        throw new AppError(BusinessCode.UNAUTHORIZED, "授权失败请登录");
      }
      const cachedToken = await fastify.redis.get(payload.uid);
      if (!cachedToken) {
        throw new AppError(BusinessCode.UNAUTHORIZED, "授权失败请登录");
      }
      request.user = payload;
    } catch (error) {
      reply.send(error);
    }
  });
}

export default fp(userJwtPlugin, {
  name: "user_jwt_plugin",
});
