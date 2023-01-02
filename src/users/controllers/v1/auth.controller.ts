import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { FastifyReply, FastifyRequest } from "fastify";
import { HttpExceptionSchema, JWT_COOKIE_NAME } from "../../../__helpers__";
import { GetUserRes, LoginReq, PostUserReq } from "./dto";
import {
  AuthAccessTokenCookieService,
  AuthRefreshTokenCookieService,
  AuthService,
  UserService,
} from "../../services";
import { JwtATGuard, JwtRTGuard, LocalAuthGuard } from "../../../users/guards";
import { User } from "@prisma/client";
import { PrismaService } from "../../../common/services";

@ApiTags("users")
@Controller({ path: "auth", version: "1" })
@ApiResponse({ type: HttpExceptionSchema, status: 500 })
export class AuthControllerV1 {
  constructor(
    private readonly userService: UserService,
    private readonly authAccessTokenCookieService: AuthAccessTokenCookieService,
    private readonly authRefreshTokenCookieService: AuthRefreshTokenCookieService,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {}
  @Post("/register")
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ type: GetUserRes, status: HttpStatus.CREATED })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.BAD_REQUEST })
  async create(@Body() data: PostUserReq) {
    const resp = await this.userService.createOne(data);

    return new GetUserRes(resp);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBody({ type: LoginReq })
  @ApiResponse({
    type: GetUserRes,
    status: HttpStatus.ACCEPTED,
    headers: {
      "Set-Cookie": { schema: { type: "string" } },
    },
  })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.BAD_REQUEST })
  async login(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const atc = await this.authAccessTokenCookieService.getATCookie(
      req.user.id
    );
    const rtc = await this.authRefreshTokenCookieService.getRTCookie(
      req.user.id
    );

    res.header("Set-Cookie", atc.cookie);
    res.header("Set-Cookie", rtc.cookie);

    const resp: GetUserRes = {
      ...req.user,
    };

    delete resp.password;
    res.send(new GetUserRes(resp));
  }

  @Post("refresh")
  @UseGuards(JwtRTGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiCookieAuth(JWT_COOKIE_NAME.RT)
  @ApiAcceptedResponse({ type: GetUserRes })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.UNAUTHORIZED })
  async signAccessToken(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const atc = await this.authAccessTokenCookieService.getATCookie(
      req.user.id
    );
    res.header("Set-Cookie", atc.cookie);
    res.send(
      new GetUserRes(
        await this.prisma.user.findUnique({
          where: { id: req.user.id },
          include: { Wallet: true }
        })
      )
    );
  }

  @Post('logout')
  @UseGuards(JwtATGuard, JwtRTGuard)
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth(JWT_COOKIE_NAME.AT)
  @ApiCookieAuth(JWT_COOKIE_NAME.RT)
  @ApiOkResponse()
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.BAD_REQUEST })
  async logout(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const [atc, rtc] = await this.authService.getLogoutCookies(
      req.user.tokenId,
    );
    res.header('Set-Cookie', atc);
    res.header('Set-Cookie', rtc);
    res.send();
  }
}
