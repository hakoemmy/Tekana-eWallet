import { InternalServerErrorException, Scope } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../common/services";
import { AccessTokenPayload } from "../interfaces";
import { AbstractAuthCookieService } from "../../__helpers__/classes";
import { EVK } from "../../__helpers__";
import { JWT_COOKIE_NAME } from "../../__helpers__";

@Injectable({ scope: Scope.REQUEST })
export class AuthAccessTokenCookieService extends AbstractAuthCookieService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService
  ) {
    super(configService.get(EVK.NODE_ENV));
  }

  async findUserRecord(userId: number) {
    try {
      return await this.prisma.user.findUnique({ where: { id: userId } });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async setPayloadForUser(userId: number) {
    const user = await this.findUserRecord(userId);

    const payload: AccessTokenPayload = {
      userId: user.id,
      Roles: user.Roles,
    };

    return payload;
  }

  async getATCookie(id: number) {
    let payload: AccessTokenPayload;

    payload = await this.setPayloadForUser(id);

    const signOptions: JwtSignOptions = {
      secret: this.configService.get(EVK.JWT_AT_SECRET),
      expiresIn: this.configService.get(EVK.JWT_AT_EXP),
    };

    const token = this.signJwt(payload, signOptions);
    const cookie = this.getCookie(
      JWT_COOKIE_NAME.AT,
      token,
      this.configService.get(EVK.JWT_AT_EXP)
    );

    return { cookie, token };
  }
}
