import { Role } from "@prisma/client";

export interface AccessTokenPayload {
  userId: number;
  Roles: Role[];
}

export interface RefreshTokenPayload {
  tokenId: number;
  userId: number;
}
