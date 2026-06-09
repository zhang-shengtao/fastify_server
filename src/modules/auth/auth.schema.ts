import { responseSchema } from "@/utils";
import { z } from "zod/v4";

export const loginBodySchema = z.object({
  username: z.string().min(1).describe("管理员用户名"),
  password: z.string().min(6).describe("管理员密码，至少 6 位"),
});

export type LoginBody = z.infer<typeof loginBodySchema>;

export const adminLoginResponseSchema = responseSchema(
  z.object({
    token: z.string().describe("管理员访问令牌"),
  }),
);
