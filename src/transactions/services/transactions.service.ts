import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Currency, Prisma } from "@prisma/client";
import { WalletService } from "../../wallets/services";
import { PrismaService } from "../../common/services";
import { DepositFundsParams, TransferFundsParams } from "../interfaces";
import { TransactionQueryParams } from "../controllers/v1/dto";
import { TransactionManagmentQueryParams } from "../../managment/controllers/v1/dto";

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService
  ) {}

  /**
   * @params  userId: the id of a user who wants to deposit funds in their wallet
   * @params  amount: funds to be deposited in a wallet
   * @params  currency: This specifies which wallet that will receive funds
   * @params  date: The date of when the deposit was made
   * - Deposit in a wallet
   * @returns credited wallet
   */
  async deposit<T>({
    userId,
    amount,
    currency,
    transactionDate,
  }: DepositFundsParams<T>) {
    try {
      const tekanaWallet = await this.walletService.findWalletByUsernameOrEmail(
        {
          emailOrUsername: "tekana",
          currency,
        }
      );

      const userWallet = await this.walletService.findOrCreate({
        userId,
        currency,
      });

      /* - Note:  
         1. Let's assume that a transaction has been successfuly, but in real life
         A user should be charged from a certain payment method and wait for the transaction to reflect in TEKANA e-wallet before
         Debitting it and Crediting user's e-walllet

         2. All below operations in $transaction array should pass for the queries to be committed otherwise,
         therewill be rollback, in this case the tranaction should be ATOMIC that obeys ACID which is the expected behaviour, 
         we'll never lose customer's money
      */
      const [uTransaction, tWallet, uWallet] = await this.prisma.$transaction([
        this.prisma.transaction.create({
          data: {
            amount: amount,
            fromWallet: { connect: { id: tekanaWallet.id } },
            toWallet: { connect: { id: userWallet.id } },
            purpose: "Deposit",
            createdAt: transactionDate,
            status: "Successful",
          },
        }),
        this.walletService.debitWallet(tekanaWallet.id, amount),
        this.walletService.creditWallet(userWallet.id, amount),
      ]);

      return {
        ...uTransaction,
        toWallet: uWallet,
        fromWallet: tWallet,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * @params  userId: the id of a user who wants to deposit funds in their wallet
   * @params  amount: funds to be deposited in a wallet
   * @params  currency: This specifies which wallet that will receive funds
   * @params  date: The date of when the deposit was made
   * - Transfer funds from one user to another user
   * @returns credited wallet
   */
  async transfer<T>({
    userId,
    amount,
    currency,
    transactionDate,
    emailOrUsername,
  }: TransferFundsParams<T>) {
    try {
      const receiverWallet =
        await this.walletService.findWalletByUsernameOrEmail({
          emailOrUsername,
          currency,
        });

      const senderWallet = await this.walletService.findOrCreate({
        userId,
        currency,
      });

      /* - Note: 
         1. All below operations in $transaction array should pass for the queries to be committed otherwise,
         therewill be rollback, in this case the tranaction should be ATOMIC that obeys ACID which is the expected behaviour, 
         we'll never lose customer's money
      */
      const [uTransaction, tWallet, uWallet] = await this.prisma.$transaction([
        this.prisma.transaction.create({
          data: {
            amount: amount,
            fromWallet: { connect: { id: senderWallet.id } },
            toWallet: { connect: { id: receiverWallet.id } },
            purpose: "Transfer",
            createdAt: transactionDate,
            status: "Successful",
          },
        }),
        this.walletService.debitWallet(senderWallet.id, amount),
        this.walletService.creditWallet(receiverWallet.id, amount),
      ]);

      return {
        ...uTransaction,
        toWallet: uWallet,
        fromWallet: tWallet,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * @params  userId: the id of a user
   * - Get user transactions
   * @returns user transactions
   */

  async getUserTransactions(userId: number, query: TransactionQueryParams) {
    try {
      const where: Prisma.TransactionWhereInput = {
        OR: [
          {
            toWallet: { userId },
          },
          {
            fromWallet: { userId },
          },
        ],
      };

      if (query.currency)
        where.OR = {
          OR: [
            {
              toWallet: { userId, currency: query.currency },
            },
            {
              fromWallet: { userId, currency: query.currency },
            },
          ],
        };
      if (query.purpose) where.purpose = { equals: query.purpose };
      if (query.status) where.status = { equals: query.status };

      return await this.prisma.transaction.findMany({
        where: { ...where },
        include: {
          toWallet: {
            select: {
              userId: true,
              User: {
                select: {
                  firstName: true,
                  lastName: true,
                  username: true,
                  email: true,
                },
              },
            },
          },
          fromWallet: {
            select: {
              userId: true,
              User: {
                select: {
                  firstName: true,
                  lastName: true,
                  username: true,
                  email: true,
                },
              },
            },
          },
        },
        take: query.take,
        skip: query.skip,
        orderBy: { createdAt: "desc" },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * @params  query: TransactionQueryParams
   * - Get all transactions
   * @returns found transactions
   */

  async findMany(query: TransactionManagmentQueryParams) {
    try {
      const where: Prisma.TransactionWhereInput = {};

      if (query.currency)
        where.OR = {
          OR: [
            {
              toWallet: { currency: query.currency },
            },
            {
              fromWallet: { currency: query.currency },
            },
          ],
        };
      if (query.purpose) where.purpose = { equals: query.purpose };
      if (query.status) where.status = { equals: query.status };
      if (query.userId)
        where.OR = {
          OR: [
            {
              toWallet: { userId: query.userId },
            },
            {
              fromWallet: { userId: query.userId },
            },
          ],
        };

      if (query.username)
        where.OR = {
          OR: [
            {
              toWallet: { User: { username: query.username } },
            },
            {
              fromWallet: { User: { username: query.username } },
            },
          ],
        };
      if (query.email)
        where.OR = {
          OR: [
            {
              toWallet: { User: { email: query.email } },
            },
            {
              fromWallet: { User: { email: query.email } },
            },
          ],
        };

      return await this.prisma.transaction.findMany({
        where: { ...where },
        include: {
          toWallet: {
            select: {
              userId: true,
              User: {
                select: {
                  firstName: true,
                  lastName: true,
                  username: true,
                  email: true,
                },
              },
            },
          },
          fromWallet: {
            select: {
              userId: true,
              User: {
                select: {
                  firstName: true,
                  lastName: true,
                  username: true,
                  email: true,
                },
              },
            },
          },
        },
        take: query.take,
        skip: query.skip,
        orderBy: { createdAt: "desc" },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
