import { Controller, Get, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { GetTransactionRes } from "../../../transactions/controllers/v1/dto";
import { TransactionsService } from "../../../transactions/services";
import { JwtATGuard } from "../../../users/guards";
import { HttpExceptionSchema, RbacGuard, Roles } from "../../../__helpers__";
import { TransactionManagmentQueryParams } from "./dto";

@ApiTags("managment")
@Controller({ path: "transactions", version: "1" })
@ApiResponse({ type: HttpExceptionSchema, status: 500 })
export class TransactionManagmentControllerV1 {
  constructor(private readonly transactionService: TransactionsService) {}
  @Get()
  @UseGuards(JwtATGuard, RbacGuard)
  @Roles(Role.Admin)
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.FORBIDDEN })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.NOT_FOUND })
  @ApiResponse({ type: [GetTransactionRes], status: HttpStatus.OK })
  async getUsersReport(@Query() query: TransactionManagmentQueryParams) {
    const users = await this.transactionService.findMany(query);

    return users.map((user) => new GetTransactionRes(user));
  }
}
