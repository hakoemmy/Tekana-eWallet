import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/services";
import * as bcrypt from "bcrypt";
import { UserManagmentQueryParams } from "../../managment/controllers/v1/dto";

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
        phoneNumber: options.phoneNumber
          ? { equals: options.phoneNumber }
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
          flagged: false
        }
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

  /**
   * @param query: UserQueryParams
   * @returns available users
   */

  async findMany(query: UserManagmentQueryParams) {
    const where: Prisma.UserWhereInput = {};

    if (query.emailVerified)
      where.emailVerified = { equals: query.emailVerified };
    if (query.phoneNumberVerified)
      where.phoneNumberVerified = { equals: query.phoneNumberVerified };
    if (query.flagged) where.flagged = { equals: query.flagged };
    if (query.Roles) where.Roles = { hasSome: query.Roles };
    return await this.prisma.user.findMany({
      take: query.take,
      skip: query.skip,
      where: { ...where },
    });
  }
}
