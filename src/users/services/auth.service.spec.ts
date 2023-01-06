import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { PrismaService } from "../../common/services";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

describe("AuthService", () => {
  let service: AuthService, prisma: PrismaService, jwtService: JwtService;
  const tokenId = 2;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        switch (token) {
          case PrismaService:
            return {
              token: {
                delete: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                findFirst: jest.fn(),
              }
            };
         case ConfigService: 
           return {};
         case JwtService: 
           return {};
        }
      })
      .compile();

    service = moduleRef.get<AuthService>(AuthService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  it("getLogoutCookies", async () => {
    const expectedResult = [
      "Authentication=; HttpOnly; Path=/; Max-Age=0",
      "Refresh=; HttpOnly; Path=/; Max-Age=0",
    ];

    const result = await service.getLogoutCookies(tokenId);
    expect(prisma.token.delete).toHaveBeenCalledWith({
      where: { id: tokenId },
    });
    expect(result).toEqual(expectedResult);
  });

  it("getRefreshTokenWithUserId", async () => {
    await service.getRefreshTokenById(tokenId);

    expect(prisma.token.findUnique).toHaveBeenCalledWith({
      where: { id: tokenId },
      include: { User: { include: { Wallet: true } } },
    });
  });
});
