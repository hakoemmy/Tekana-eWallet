import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";
import { AuthControllerV1 } from "./controllers/v1";
import {
  AuthService,
  UserService,
  AuthAccessTokenCookieService,
  AuthRefreshTokenCookieService,
} from "./services";
import { EVK } from "../__helpers__";
import { JwtATStrategy, JwtRTStrategy, LocalStrategy } from "./auth-strategy";
import { CommonModule } from "../common/common.module";
import { PassportModule } from "@nestjs/passport";
import { PrismaService } from "../common/services";

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    HttpModule,
    CommonModule,
    PassportModule.register({}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(EVK.JWT_AT_SECRET),
        signOptions: {
          expiresIn: configService.get(EVK.JWT_AT_EXP) + "s",
        },
      }),
    }),
  ],
  controllers: [AuthControllerV1],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtATStrategy,
    JwtRTStrategy,
    AuthAccessTokenCookieService,
    AuthRefreshTokenCookieService,
  ],
})
export class UserModule implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private configService: ConfigService
  ) {}

  async onModuleInit() {
    // Upsert SuperAdmin User, this user will be used to create master e-wallet
    // that is essential to debit it and credit customers's wallets after successful funds deposit
    // Also this user can be used to do any other super admin related activities
    const superAdminUser = await this.prisma.user.findFirst({
      where: { username: this.configService.get(EVK.SUPER_ADMIN_USERNAME) },
    });

    if (!superAdminUser) {
      try {
        await this.userService.createOne({
          email: this.configService.get(EVK.SUPER_ADMIN_EMAIL),
          username: this.configService.get(EVK.SUPER_ADMIN_USERNAME),
          password: this.configService.get(EVK.SUPER_ADMIN_PASSWORD),
          Roles: ["SuperAdmin"]
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}
