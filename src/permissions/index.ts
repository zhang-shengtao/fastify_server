// 权限码集合
import { SYSTEM_PERMISSION_SEEDS, SYSTEM_PERMISSIONS } from "./system";

export const PERMISSIONS = {
  ...SYSTEM_PERMISSIONS,
} as const;

export const PERMISSION_SEEDS = [...SYSTEM_PERMISSION_SEEDS] as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
