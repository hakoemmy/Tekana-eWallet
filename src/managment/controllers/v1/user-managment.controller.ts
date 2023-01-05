import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "src/users/services";
import { RbacGuard, Roles } from "../../../__helpers__";
import { GetUserRes } from "../../../users/controllers/v1/dto";
import { JwtATGuard } from "../../../users/guards";
import { HttpExceptionSchema } from "../../../__helpers__";
import { UserManagmentQueryParams } from "./dto";
import { Role } from "@prisma/client";
import { CreateUserReq } from "./dto/user-managment.req.dto";

@ApiTags("managment")
@Controller({ path: "users", version: "1" })
@ApiResponse({ type: HttpExceptionSchema, status: 500 })
export class UserManagmentControllerV1 {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtATGuard, RbacGuard)
  @Roles(Role.Admin)
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.FORBIDDEN })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.NOT_FOUND })
  @ApiResponse({ type: [GetUserRes], status: HttpStatus.OK })
  async getUsersReport(@Query() query: UserManagmentQueryParams) {
    const users = await this.userService.findMany(query);

    return users.map((user) => new GetUserRes(user));
  }

  @Post()
  @UseGuards(JwtATGuard, RbacGuard)
  @Roles(Role.SuperAdmin)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ type: GetUserRes, status: HttpStatus.CREATED })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.BAD_REQUEST })
  async create(@Body() data: CreateUserReq) {
    const checkEmail = await this.userService.findOne({
      email: data.email,
    });

    if (checkEmail) {
      throw new ConflictException("Email already in use");
    }

    const checkUsername = await this.userService.findOne({
      username: data.username,
    });

    if (checkUsername) {
      throw new ConflictException("Username already in use");
    }

    const checkPhoneNumber = await this.userService.findOne({
      phoneNumber: data.phoneNumber,
    });

    if (checkPhoneNumber && data.phoneNumber) {
      throw new ConflictException("Phone number already in use");
    }

    const resp = await this.userService.createOne({
      ...data,
    });

    return new GetUserRes(resp);
  }
}
