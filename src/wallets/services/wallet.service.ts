import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../../common/services";
import {
  FindWalletByUserNameParams,
  WalletFindOrCreateParams,
} from "../interfaces";

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
  async getWallets(userId: number) {
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
   * @params { username, currency }: FindWalletByUserNameParams
   * - Get wallet by username
   * @returns user wallet
   */
  async findWalletByUsername({
    username,
    currency,
  }: FindWalletByUserNameParams) {
    try {
      return await this.prisma.wallet.findFirst({
        where: { User: { username }, currency },
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
        balance: { increment: amount }
      },
    });
  }
}
