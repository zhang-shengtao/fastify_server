import { admin_user } from "@/db/admin_user";
import { eq } from "drizzle-orm";
import { AppError, BusinessCode } from "@/common/app-error";
import { randomUUID } from "node:crypto";
import { DecodedJwtPayload } from "@/type/auth";

export default class AuthService {
  constructor(private readonly fastify: FastifyInstance) {}
  async login(username: string, password: string) {
    const users = await this.fastify.db.select().from(admin_user).where(eq(admin_user.account, username));
    if (users.length === 0) throw new AppError(BusinessCode.PARAM_ERROR, "账号或密码错误");
    const item = users.find((item) => item.password === password);
    if (!item) throw new AppError(BusinessCode.PARAM_ERROR, "账号或密码错误.");
    const uid = randomUUID();
    const token = await this.fastify.jwt.admin.sign({ uid });
    const decode = this.fastify.jwt.admin.decode<DecodedJwtPayload>(token);
    if (!decode || !decode?.exp) throw new AppError(BusinessCode.INTERNAL_ERROR, "服务器错误");
    const ttl = decode.exp - Math.floor(Date.now() / 1000);
    await this.fastify.redis.set(`auth:${uid}`, JSON.stringify(item), "EX", ttl);
    return token;
  }
}
