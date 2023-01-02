import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {
  ExtractJwt,
  Strategy,
  StrategyOptions,
  JwtFromRequestFunction,
} from "passport-jwt";
import { EVK } from "../../__helpers__";
import { JWT_COOKIE_NAME, STRATEGY } from "../../__helpers__/enums";
import { AccessTokenPayload } from "../interfaces";
import { FastifyRequest } from "fastify";
import { UserPayload } from "index";
import { UserService } from "../services";

const jwtExtractor: JwtFromRequestFunction = ({ cookies }) => {
  if (cookies) return cookies[JWT_COOKIE_NAME.AT];
};

@Injectable()
export class JwtATStrategy extends PassportStrategy(Strategy, STRATEGY.JWT_AT) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractor]),
      secretOrKey: configService.get(EVK.JWT_AT_SECRET),
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(req: FastifyRequest, payload: AccessTokenPayload) {
    req.user = req.user || ({} as FastifyRequest["user"]);

    const user = await this.userService.findOne({ id: payload.userId });
    req.user = {
      id: payload.userId,
      Roles: payload.Roles,
      email: user.email,
      username: user.username,
    } as UserPayload;

    return req.user;
  }
}
