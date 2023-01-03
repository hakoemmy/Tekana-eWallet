import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../../common/services";
import { WalletFindOrCreateParams } from "../interfaces";

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
}
