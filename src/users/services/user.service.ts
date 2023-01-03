import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/services";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @param options Prisma.UserFindUniqueArgs["where"]
   * @returns found user
   */

  async findOne(options: Prisma.UserFindUniqueArgs["where"]) {
    return await this.prisma.user.findFirst({
      where: {
        id: options.id || undefined,
        email: options.email
          ? { equals: options.email, mode: "insensitive" }
          : undefined,
        username: options.username
          ? { equals: options.username, mode: "insensitive" }
          : undefined,
      },
      include: {
        Wallet: true,
      },
    });
  }

  /**
   * @param data the user data
   * @returns created user resp
   */
  async createOne(data: Partial<Prisma.UserCreateInput>) {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          username: data.username,
          email: data.email,
          password: await bcrypt.hash(data.password, 10),
          phoneNumberVerified: false,
          emailVerified: false,
          flagged: false,
        },
      });
      
      // Create user USD and RWF wallets
      await this.prisma.$transaction([
        this.prisma.wallet.create({
          data: {
            currency: "RWF",
            User: { connect: { id: user.id } },
          },
        }),
        this.prisma.wallet.create({
          data: {
            currency: "USD",
            User: { connect: { id: user.id } },
          },
        }),
      ]);

      return user;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
