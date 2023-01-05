import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiCookieAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FastifyRequest } from "fastify";
import { UserService } from "../../../users/services";
import { TransactionsService } from "../../../transactions/services";
import { JwtATGuard } from "../../../users/guards";
import { HttpExceptionSchema, JWT_COOKIE_NAME } from "../../../__helpers__";
import {
  GetTransactionRes,
  PostTransactionReq,
  TransactionQueryParams,
  TransferFundsReq,
} from "./dto";
import { isEmail } from "class-validator";
import { WalletService } from "../../../wallets/services";

@ApiTags("wallets")
@Controller({ path: "wallets/transactions", version: "1" })
@ApiResponse({ type: HttpExceptionSchema, status: 500 })
export class TransactionsControllerV1 {
  constructor(
    private readonly transactionService: TransactionsService,
    private readonly userService: UserService,
    private readonly walletService: WalletService
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

    const senderWallet = await this.walletService.findOrCreate({
      userId: req.user.id,
      currency: data.currency,
    });

    if (data.amount > senderWallet.balance) {
      throw new ForbiddenException(
        `Insufficient funds, your current balance is ${senderWallet.balance} ${data.currency}`
      );
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

  @Get()
  @UseGuards(JwtATGuard)
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.FORBIDDEN })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ type: HttpExceptionSchema, status: HttpStatus.NOT_FOUND })
  @ApiResponse({ type: [GetTransactionRes], status: HttpStatus.OK })
  async getUserTransactions(
    @Req() req: FastifyRequest,
    @Query() query: TransactionQueryParams
  ) {
    const resp = await this.transactionService.getTransactions(
      req.user.id,
      query
    );

    return resp.map((transaction) => new GetTransactionRes(transaction));
  }
}
