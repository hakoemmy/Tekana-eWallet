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
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FastifyReply, FastifyRequest } from "fastify";
import { HttpExceptionSchema } from "../../../__helpers__";
import { GetUserRes, LoginReq, PostUserReq } from "./dto";
import {
  AuthAccessTokenCookieService,
  AuthRefreshTokenCookieService,
  UserService,
} from "../../services";
import { LocalAuthGuard } from "../../../users/guards";

@ApiTags("users")
@Controller({ path: "auth", version: "1" })
@ApiResponse({ type: HttpExceptionSchema, status: 500 })
export class AuthControllerV1 {
  constructor(
    private readonly userService: UserService,
    private readonly authAccessTokenCookieService: AuthAccessTokenCookieService,
    private readonly authRefreshTokenCookieService: AuthRefreshTokenCookieService
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
  async login(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Body() body: LoginReq
  ) {
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
}
