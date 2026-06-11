import { responseSchema, errorResponseSchema } from "@/utils";
import { z } from "zod/v4";

export const login_schema = {
  tags: ["管理员认证"],
  summary: "管理员登录",
  description: "使用用户名和密码登录后台管理系统",
  body: z.object({
    username: z.string().min(1).describe("管理员用户名"),
    password: z.string().min(6).describe("管理员密码，至少 6 位"),
  }),
  response: {
    200: responseSchema(
      z.object({
        token: z.string().describe("管理员访问令牌"),
      }),
    ),
    400: errorResponseSchema,
    401: errorResponseSchema,
    500: errorResponseSchema,
  },
  config: {
    is_auth: false, // 禁用全局的认证 验证token
  },
};
