import * as bcrypt from "bcrypt";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { FastifyRequest } from "fastify";
import {
  ExtractJwt,
  JwtFromRequestFunction,
  StrategyOptions,
} from "passport-jwt";
import { Strategy } from "passport-jwt";
import { EVK } from "../../__helpers__";
import { JWT_COOKIE_NAME, STRATEGY } from "../../__helpers__/enums";
import { RefreshTokenPayload } from "../interfaces";
import { AuthService } from "../services";
import { UserPayload } from "index";

const jwtExtractor: JwtFromRequestFunction = ({ cookies }) => {
  if (cookies) return cookies[JWT_COOKIE_NAME.RT];
};

@Injectable()
export class JwtRTStrategy extends PassportStrategy(Strategy, STRATEGY.JWT_RT) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractor]),
      secretOrKey: configService.get(EVK.JWT_RT_SECRET),
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(
    req: FastifyRequest,
    payload: RefreshTokenPayload
  ): Promise<FastifyRequest["user"]> {
    const given = req.cookies[JWT_COOKIE_NAME.RT];
    const existing = await this.authService.getRefreshTokenById(
      payload.tokenId
    );

    if (!existing) throw new BadRequestException("Please login again");

    if (existing.User) {
      const isMatch = await bcrypt.compare(given, existing.value);
      if (!isMatch) throw new BadRequestException("Please login again");

      return {
        id: existing.User.id,
        Roles: existing.User.Roles,
        tokenId: existing.id,
      } as UserPayload;
    }
  }
}
