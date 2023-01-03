import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiCookieAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FastifyRequest } from "fastify";
import { TransactionsService } from "../../../transactions/services";
import { JwtATGuard } from "../../../users/guards";
import { HttpExceptionSchema, JWT_COOKIE_NAME } from "../../../__helpers__";
import { GetTransactionRes, PostTransactionReq } from "./dto";

@ApiTags("wallets")
@Controller({ path: "wallets/transactions", version: "1" })
@ApiResponse({ type: HttpExceptionSchema, status: 500 })
export class TransactionsControllerV1 {
  constructor(private readonly transactionService: TransactionsService) {}
  @Post("/deposit")
  @UseGuards(JwtATGuard)
  @ApiCookieAuth(JWT_COOKIE_NAME.AT)
  @ApiResponse({ type: GetTransactionRes, status: HttpStatus.ACCEPTED })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.BAD_REQUEST })
  async getWalletBalance(
    @Req() req: FastifyRequest,
    @Body() data: PostTransactionReq
  ) {
    const resp = await this.transactionService.deposit({
      userId: req.user.id,
      amount: data.amount,
      currency: data.currency,
      transactionDate: new Date(),
    });

    return new GetTransactionRes(resp);
  }
}
