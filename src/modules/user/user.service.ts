import { paginate } from "@/utils/pagination";
import type { PageQuery } from "@/utils/pagination";
import { admin_user } from "@/db/admin_user";

import { count, desc, eq, like, and, ne } from "drizzle-orm";

export default class UserService {
  constructor(private readonly fastify: FastifyInstance) {}

  async get_user_list(query: PageQuery) {
    const where = and();
    return await paginate(query, {
      list: ({ limit, offset }) => this.fastify.db.select().from(admin_user).where(where).orderBy(desc(admin_user.user_id)).limit(limit).offset(offset),
      total: () => this.fastify.db.select({ total: count() }).from(admin_user).where(where),
    });
  }
}
