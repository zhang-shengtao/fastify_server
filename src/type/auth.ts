// 生成token传递的 payload
export type JwtPayload = {
  uid: string;
};

// 解析token返回的 payload
export type DecodedJwtPayload = JwtPayload & {
  iss: string;
  iat: number;
  exp: number;
};
