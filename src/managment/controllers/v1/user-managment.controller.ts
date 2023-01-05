import { Controller, Get, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "src/users/services";
import { RbacGuard, Roles } from "../../../__helpers__";
import { GetUserRes } from "../../../users/controllers/v1/dto";
import { JwtATGuard } from "../../../users/guards";
import { HttpExceptionSchema } from "../../../__helpers__";
import { UserManagmentQueryParams } from "./dto/user-managment.res.dto";
import { Role } from "@prisma/client";

@ApiTags("managment")
@Controller({ path: "users", version: "1" })
@ApiResponse({ type: HttpExceptionSchema, status: 500 })
export class UserManagmentControllerV1 {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtATGuard, RbacGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.FORBIDDEN })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.NOT_FOUND })
  @ApiResponse({ type: [GetUserRes], status: HttpStatus.OK })
  async getUsersReport(@Query() query: UserManagmentQueryParams) {
    const users = await this.userService.findMany(query);

    return users.map((user) => new GetUserRes(user));
  }
}
