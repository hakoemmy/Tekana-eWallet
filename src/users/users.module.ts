import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";
import { AuthControllerV1 } from "./controllers/v1";
import { AuthService, UserService } from "./services";
import { EVK, NODE_ENV } from "../__helpers__";
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
  ],
})
export class UserModule implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async onModuleInit() {
    const env = this.configService.get<NODE_ENV>(EVK.NODE_ENV);

    // Upsert SuperAdmin User for dev environment
    if (env === NODE_ENV.DEV || env === NODE_ENV.TEST) {
      const superAdminUser = await this.prisma.user.findFirst({
        where: { username: "tekana" },
      });

      if (!superAdminUser) {
        try {
          await this.userService.createOne({
            email: "tekana-ewallet@email.com",
            username: "tekana",
            password: "12345678",
            Roles: ["SuperAdmin"],
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
}
