import { Controller, Get, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Currency } from "@prisma/client";
import { FastifyRequest } from "fastify";
import { WalletService } from "src/wallet/services";
import { JwtATGuard } from "../../../users/guards";
import { HttpExceptionSchema, JWT_COOKIE_NAME } from "../../../__helpers__";
import { WalletBalanceRes } from "./dto";

@ApiTags("wallet")
@Controller({ path: "/balance", version: "1" })
@ApiResponse({ type: HttpExceptionSchema, status: 500 })
export class WalletControllerV1 {
  constructor(private readonly walletService: WalletService) {}
  @Get()
  @UseGuards(JwtATGuard)
  @ApiCookieAuth(JWT_COOKIE_NAME.AT)
  @ApiResponse({ type: WalletBalanceRes, status: HttpStatus.ACCEPTED })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.BAD_REQUEST })
  async getWalletBalance(@Req() req: FastifyRequest) {
    const resp = await this.walletService.findOrCreate({
      userId: req.user.id,
      currency: Currency.RWF,
    });

    return new WalletBalanceRes(resp);
  }
}
