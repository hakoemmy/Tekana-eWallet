import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { FastifyRequest } from "fastify";
import { HttpExceptionSchema } from "../../../__helpers__";
import { GetUserRes, PostUserReq } from "./dto";
import { UserService } from "../../services";

@ApiTags("users")
@Controller({ path: "auth", version: "1" })
@ApiResponse({ type: HttpExceptionSchema, status: 500 })
export class AuthControllerV1 {
  constructor(private readonly userService: UserService) {}
  @Post("/register")
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ type: GetUserRes, status: HttpStatus.CREATED })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.BAD_REQUEST })
  async create(@Req() req: FastifyRequest, @Body() data: PostUserReq) {
    const resp = await this.userService.createOne(data);

    return new GetUserRes(resp);
  }
}
