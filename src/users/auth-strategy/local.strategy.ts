import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';
import { PrismaService } from '../../common/services';
import { STRATEGY, STRATEGY_LOCAL } from '../../__helpers__/enums';
import { Prisma, User } from '@prisma/client';
import { isEmail } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, STRATEGY.LOCAL) {
  constructor(private readonly prisma: PrismaService) {
    super({
      usernameField: STRATEGY_LOCAL.usernameField,
      passwordField: STRATEGY_LOCAL.passwordField,
    } as IStrategyOptions);
  }

  async validate(emailOrUsername: string, password: string) {
    let user: User;
    const include: Prisma.UserInclude = {
      Wallet: true
    };

    if (isEmail(emailOrUsername))
      user = await this.prisma.user.findUnique({
        where: { email: emailOrUsername.toLowerCase() },
        include,
      });
    else
      user = await this.prisma.user.findFirst({
        where: { username: { equals: emailOrUsername, mode: 'insensitive' } },
        include,
      });

    if (!user) throw new BadRequestException('Wrong credentials');

    if (!(await bcrypt.compare(password, user.password)))
      throw new BadRequestException('Wrong credentials');

    return { ...user, type: 'USER' };
  }
}
