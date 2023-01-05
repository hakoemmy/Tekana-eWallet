import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiCookieAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Currency, Role } from "@prisma/client";
import { FastifyRequest } from "fastify";
import { WalletService } from "src/wallets/services";
import { JwtATGuard } from "../../../users/guards";
import {
  HttpExceptionSchema,
  JWT_COOKIE_NAME,
  RbacGuard,
  Roles,
} from "../../../__helpers__";
import { WalletBalanceRes } from "./dto";

@ApiTags("wallets")
@Controller({ path: "/", version: "1" })
@ApiResponse({ type: HttpExceptionSchema, status: 500 })
export class WalletControllerV1 {
  constructor(private readonly walletService: WalletService) {}

  @Get(":currency")
  @UseGuards(JwtATGuard, RbacGuard)
  @Roles(Role.Customer)
  @ApiCookieAuth(JWT_COOKIE_NAME.AT)
  @ApiResponse({ type: WalletBalanceRes, status: HttpStatus.ACCEPTED })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.BAD_REQUEST })
  async getWalletBalance(
    @Req() req: FastifyRequest,
    @Param("currency") currency: Currency
  ) {
    if (!Object.values(Currency).includes(currency)) {
      throw new BadRequestException(
        "Currency not supported, supported currencies: RWF AND USD"
      );
    }
    const resp = await this.walletService.findOrCreate({
      userId: req.user.id,
      currency,
    });

    return new WalletBalanceRes(resp);
  }

  @Get()
  @UseGuards(JwtATGuard, RbacGuard)
  @Roles(Role.Customer)
  @ApiCookieAuth(JWT_COOKIE_NAME.AT)
  @ApiResponse({ type: [WalletBalanceRes], status: HttpStatus.ACCEPTED })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.BAD_REQUEST })
  async getUserWallets(@Req() req: FastifyRequest) {
    const resp = await this.walletService.getUserWallets(req.user.id);
    return resp.map((wallet) => new WalletBalanceRes(wallet));
  }
}
