import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { EVK } from "../../__helpers__";
import { PrismaService } from "../../common/services";
import { AccessTokenPayload } from "../interfaces";
import { AuthAccessTokenCookieService } from "./auth-access-token-cookie.service";
import { JWT_COOKIE_NAME } from "../../__helpers__";

describe("AuthAccessTokenCookieService", () => {
  let service: AuthAccessTokenCookieService, prisma: PrismaService;

  const userId = 1,
    accessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIlJvbGVzIjpbIkFkbWluIl0sImlhdCI6MTY2MTI1MzcwNSwiZXhwIjoxNjYxMjU3MzA1fQ.I5q32UMr41_G16XcmI03veFNHP4XvEyKrt7-xKAPnVY";

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthAccessTokenCookieService],
    })
      .useMocker((token) => {
        switch (token) {
          case PrismaService:
            return {
              user: {
                findUnique: jest.fn(),
              },
            };
          case JwtService:
            return {
              sign: jest.fn(),
            };
          case ConfigService:
            return {
              get: jest.fn().mockImplementation((type) => {
                switch (type) {
                  case EVK.JWT_AT_SECRET:
                    return "secret";
                  case EVK.NODE_ENV:
                    return "dev";
                  case EVK.JWT_AT_EXP:
                    return 3600;
                }
              }),
            };
        }
      })
      .compile();

    service = await moduleRef.resolve(AuthAccessTokenCookieService);
    prisma = moduleRef.get(PrismaService);
  });

  it("findUserRecord", () => {
    service.findUserRecord(userId);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });
  });

  it("signJwt", () => {
    const payload: AccessTokenPayload = {
      userId,
      Roles: ["Admin"],
    };
    const signOptions: JwtSignOptions = {
      secret: "secret",
      expiresIn: 3600,
    };
    service.signJwt = jest.fn().mockResolvedValue(accessToken);

    const result = service.signJwt(payload, signOptions);

    expect(service.signJwt).toHaveBeenCalledWith(payload, signOptions);
    expect(result).toBeDefined();
  });

  it("getCookie", () => {
    const cookieName = JWT_COOKIE_NAME.AT;
    const result = service.getCookie(cookieName, accessToken, 3600);
    expect(result).toEqual(
      `Authentication=${accessToken}; HttpOnly;  Path=/;  Max-Age=3600;`
    );
  });

  it("getATCookie", async () => {
    service.findUserRecord = jest
      .fn()
      .mockResolvedValue({ id: 1, Roles: ["Admin"] });

    service.signJwt = jest.fn().mockResolvedValue(accessToken);

    const result = await service.getATCookie(userId);

    expect(result).toHaveProperty("cookie");
    expect(result).toHaveProperty("token");
  });
});
