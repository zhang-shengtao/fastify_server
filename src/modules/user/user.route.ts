import UserService from "./user.service";
import { user_list_schema } from "./user.schema";
export default async function authRoutes(fastify: FastifyInstance) {
  const authService = new UserService(fastify);

  fastify.get("/admin/user/list", { ...user_list_schema }, async function (request, reply) {
    const reslt = await authService.get_user_list(request.query);
    reply.success(reslt);
  });
}
