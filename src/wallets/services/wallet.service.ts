import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../../common/services";
import { Prisma } from "@prisma/client";
import {
  FindWalletByUserNameParams,
  WalletFindOrCreateParams,
} from "../interfaces";
import { isEmail } from "class-validator";
import { WalletManagmentQueryParams } from "../../managment/controllers/v1/dto";

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @params { userId, currency }: WalletFindOrCreateParams
   * - Get wallet by userId
   * - It will create a new wallet if user doesn't have one
   * @returns user wallet
   */
  async findOrCreate({ userId, currency }: WalletFindOrCreateParams) {
    try {
      const resp = await this.prisma.wallet.upsert({
        where: { userId_currency: { userId, currency } },
        create: { User: { connect: { id: userId } }, currency },
        update: {},
      });

      return resp;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * @params  userId: the id of a user to get wallets for
   * - Get available user wallets
   * @returns users's wallets
   */
  async getUserWallets(userId: number) {
    try {
      return await this.prisma.wallet.findMany({
        where: { userId },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * @params { emailOrUsername, currency }: FindWalletByUserNameParams
   * - Get wallet by username
   * @returns user wallet
   */
  async findWalletByUsernameOrEmail({
    emailOrUsername,
    currency,
  }: FindWalletByUserNameParams) {
    try {
      return isEmail(emailOrUsername)
        ? await this.prisma.wallet.findFirst({
            where: {
              User: { email: emailOrUsername },
              currency,
            },
          })
        : await this.prisma.wallet.findFirst({
            where: {
              User: { username: emailOrUsername },
              currency,
            },
          });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * @params debitWalletId: The Id of the wallet to be debited
   * - It debits wallet
   * @returns debited wallet
   */

  debitWallet(debitWalletId: number, amount: number) {
    return this.prisma.wallet.update({
      where: { id: debitWalletId },
      data: {
        balance: { decrement: amount },
      },
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
    });
  }

  /**
   * @params creditWalletId: The Id of the wallet to be credited
   * - It credits wallet
   * @returns credited wallet
   */

  creditWallet(creditWalletId: number, amount: number) {
    return this.prisma.wallet.update({
      where: { id: creditWalletId },
      data: {
        balance: { increment: amount },
      },
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
    });
  }

  /**
   * @param query:  WalletManagmentQueryParams
   * @returns found wallets
   */

  async findMany(query: WalletManagmentQueryParams) {
    const where: Prisma.WalletWhereInput = {};

    if (query.currency) where.currency = { equals: query.currency };
    if (query.balance) where.balance = { equals: query.balance };
    if (query.userId) where.userId = { equals: query.userId };
    if (query.username) where.User = { username: query.username };
    if (query.email) where.User = { email: query.email };
    return await this.prisma.wallet.findMany({
      take: query.take,
      skip: query.skip,
      where: { ...where },
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }
}
