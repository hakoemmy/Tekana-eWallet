import { Test, TestingModule } from "@nestjs/testing";
import { FastifyRequest } from "fastify";
import { RefreshTokenPayload } from "../interfaces";
import { JwtRTStrategy } from "./jwt-refresh.strategy";
import { ConfigService } from "@nestjs/config";
import { EVK } from "../../__helpers__";
import { AuthService } from "../services/auth.service";

describe("JwtRTStrategy", () => {
  let jwtRefreshStrategy: JwtRTStrategy;

  const req = {
      user: {
        id: 1,
      },
      cookies: {
        Refresh: "12345678",
      },
    } as unknown as FastifyRequest,
    refreshTokenPayload: RefreshTokenPayload = {
      tokenId: 1,
      userId: 1,
    };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [JwtRTStrategy],
    })
      .useMocker((token) => {
        switch (token) {
          case ConfigService:
            return {
              get: jest.fn().mockImplementation((type) => {
                switch (type) {
                  case EVK.JWT_RT_SECRET:
                    return "JWT-RT-SECRET";
                }
              }),
            };
          case AuthService:
            return {
              getRefreshTokenById: jest.fn().mockResolvedValue({
                value:
                  "$2b$10$jj.M9ac9uDdSp1pm/r3CR.h57jnwDfLnSKXwBe8wmSceKQS4/OqU.",
                User: {
                  id: 1,
                  type: "User",
                },
              }),
            };
          default:
            return {};
        }
      })
      .compile();

    jwtRefreshStrategy = await moduleRef.resolve(JwtRTStrategy);
  });

  it("validate", async () => {
    const resp = await jwtRefreshStrategy.validate(req, refreshTokenPayload);
    expect(resp.id).toEqual(refreshTokenPayload.userId);
  });
});
