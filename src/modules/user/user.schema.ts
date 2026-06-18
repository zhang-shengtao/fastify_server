import { z } from "zod/v4";
import { responseSchema, errorResponseSchema } from "@/utils";

export const user_list_schema = {
  schema: {
    tags: ["用户相关"],
    summary: "用户列表",
    description: "获取用户列表",
    querystring: z.object({
      page: z.coerce.number().int().min(1).default(1).describe("页码"),
      limit: z.coerce.number().int().min(1).max(100).default(10).describe("每页数量"),
    }),
    response: {
      200: responseSchema(
        z.object({
          total: z.number().describe("总条数"),
          list: z.array(
            z.object({
              user_id: z.number().describe("用户ID"),
              account: z.string().describe("用户账号"),
              nickname: z.string().describe("用户昵称"),
              status: z.string().describe("用户状态"),
              created_at: z.date().describe("创建时间"),
            }),
          ),
          page: z.number().describe("当前页码"),
          limit: z.number().describe("每页数量"),
        }),
      ),
      400: errorResponseSchema,
      401: errorResponseSchema,
      500: errorResponseSchema,
    },
  },
  config: {
    is_auth: false, // 禁用全局的认证 验证token
  },
};
