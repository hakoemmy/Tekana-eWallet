import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiCookieAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FastifyRequest } from "fastify";
import { UserService } from "../../../users/services";
import { TransactionsService } from "../../../transactions/services";
import { JwtATGuard } from "../../../users/guards";
import { HttpExceptionSchema, JWT_COOKIE_NAME } from "../../../__helpers__";
import { GetTransactionRes, PostTransactionReq, TransferFundsReq } from "./dto";
import { isEmail } from "class-validator";

@ApiTags("wallets")
@Controller({ path: "wallets/transactions", version: "1" })
@ApiResponse({ type: HttpExceptionSchema, status: 500 })
export class TransactionsControllerV1 {
  constructor(
    private readonly transactionService: TransactionsService,
    private readonly userService: UserService
  ) {}

  @Post("/deposit")
  @UseGuards(JwtATGuard)
  @ApiCookieAuth(JWT_COOKIE_NAME.AT)
  @ApiResponse({ type: GetTransactionRes, status: HttpStatus.ACCEPTED })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.BAD_REQUEST })
  async depositFundsInWallet(
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

  @Post("/transfer")
  @UseGuards(JwtATGuard)
  @ApiCookieAuth(JWT_COOKIE_NAME.AT)
  @ApiResponse({ type: GetTransactionRes, status: HttpStatus.ACCEPTED })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.BAD_REQUEST })
  async transferFundsToWallet(
    @Req() req: FastifyRequest,
    @Body() data: TransferFundsReq
  ) {
    const user = isEmail(data.emailOrUsername)
      ? await this.userService.findOne({ email: data.emailOrUsername })
      : await this.userService.findOne({ username: data.emailOrUsername });

    if (!user) {
      throw new NotFoundException("Email or username not found");
    }
    const resp = await this.transactionService.transfer({
      userId: req.user.id,
      amount: data.amount,
      currency: data.currency,
      transactionDate: new Date(),
      emailOrUsername: data.emailOrUsername,
    });

    return new GetTransactionRes(resp);
  }
}
