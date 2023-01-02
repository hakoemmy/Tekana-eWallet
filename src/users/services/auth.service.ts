import * as bcrypt from 'bcrypt';
import { Prisma, Token, TokenType, User } from '@prisma/client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_COOKIE_NAME } from '../../__helpers__/enums';
import { EVK } from '../../__helpers__';
import { PrismaService } from '../../common/services';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  /**
   * @param tokenId the resfresh token id
   * @returns cleared cookies
   */

  async getLogoutCookies(tokenId: number): Promise<[string, string]> {
    await this.prisma.token.delete({ where: { id: tokenId } });

    return [
      `${JWT_COOKIE_NAME.AT}=; HttpOnly; Path=/; Max-Age=0`,
      `${JWT_COOKIE_NAME.RT}=; HttpOnly; Path=/; Max-Age=0`,
    ];
  }

  /**
   * @param tokenId the resfresh token id
   * @returns the record of refresh token
   */

  async getRefreshTokenById(tokenId: number) {
    return this.prisma.token.findUnique({
      where: { id: tokenId },
      include: { User: { include: { Wallet: true } } },
    });
  }

}

