import { errorResponseSchema } from "@/utils";
import { adminLoginResponseSchema, loginBodySchema } from "./auth.schema";
import AuthService from "./auth.service";
import { PERMISSIONS } from "@/permissions";

export default async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService({ logger: fastify.log, userJwtSign: fastify.userJwtSign, db: fastify.db, redis: fastify.redis });
  fastify.post(
    "/admin/auth/login",
    {
      schema: {
        tags: ["管理员认证"],
        summary: "管理员登录",
        description: "使用用户名和密码登录后台管理系统",
        body: loginBodySchema,
        response: {
          200: adminLoginResponseSchema,
          400: errorResponseSchema,
          401: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
      config: {
        isAuth: false, // 禁用全局的认证 验证token
        permission: PERMISSIONS.SYSTEM_PERMISSION_RULE_APPLY, // 权限标识
      },
    },
    async function (request, reply) {
      const body = request.body;
      const result = await authService.login(body.username, body.password);
      return reply.success(result);
    },
  );
}
