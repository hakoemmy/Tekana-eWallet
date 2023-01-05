import { Controller, Get, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { WalletBalanceRes } from "../../../wallets/controllers/v1/dto";
import { JwtATGuard } from "../../../users/guards";
import { WalletService } from "../../../wallets/services";
import { HttpExceptionSchema, RbacGuard, Roles } from "../../../__helpers__";
import { WalletManagmentQueryParams } from "./dto";

@ApiTags("managment")
@Controller({ path: "wallets", version: "1" })
@ApiResponse({ type: HttpExceptionSchema, status: 500 })
export class WalletManagmentControllerV1 {
    constructor(private readonly walletService: WalletService) {}

  @Get()
  @UseGuards(JwtATGuard, RbacGuard)
  @Roles(Role.Admin)
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.FORBIDDEN })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.NOT_FOUND })
  @ApiResponse({ type: [WalletBalanceRes], status: HttpStatus.OK })
  async getUsersReport(@Query() query: WalletManagmentQueryParams) {
    const wallets = await this.walletService.findMany(query);

    return wallets.map((user) => new WalletBalanceRes(user));
  }
}
