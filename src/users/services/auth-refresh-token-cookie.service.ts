import { InternalServerErrorException, Scope } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { PrismaService } from "../../common/services";
import { AbstractAuthCookieService } from "../../__helpers__/classes";
import { EVK } from "../../__helpers__";
import { JWT_COOKIE_NAME } from "../../__helpers__/enums";
import { TokenType } from "@prisma/client";
import { RefreshTokenPayload } from "../interfaces";

@Injectable({ scope: Scope.REQUEST })
export class AuthRefreshTokenCookieService extends AbstractAuthCookieService {
  private readonly JWT_RT_EXP_DEFAULT = 2147483647;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService
  ) {
    super(configService.get(EVK.NODE_ENV));
  }

  async updateRefreshToken(tokenId: number, hashedToken: string) {
    await this.prisma.token.update({
      where: { id: tokenId },
      data: { value: hashedToken },
    });
  }

  async createRefreshTokenRecord(id: number) {
    try {
      return await this.prisma.token.create({
        data: { userId: id, type: TokenType.Refresh, value: "" },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async hashRefreshToken(token: string) {
    return await bcrypt.hash(token, 10);
  }

  async getRTTokenPayload(id: number) {
    const refreshTokenRecord = await this.createRefreshTokenRecord(id);

    let payload: RefreshTokenPayload;

    return {
      userId: id,
      tokenId: refreshTokenRecord.id,
    };
  }

  async getRTCookie(id: number) {
    const payload = await this.getRTTokenPayload(id);

    const expiresIn =
      this.configService.get<number>(EVK.JWT_RT_EXP) || this.JWT_RT_EXP_DEFAULT;

    const signOptions: JwtSignOptions = {
      secret: this.configService.get(EVK.JWT_RT_SECRET),
      expiresIn,
    };

    const token = this.signJwt(payload, signOptions);
    const cookie = this.getCookie(JWT_COOKIE_NAME.RT, token, expiresIn);
    const hashedToken = await this.hashRefreshToken(token);

    await this.updateRefreshToken(payload.tokenId, hashedToken);

    return { cookie, token };
  }
}
