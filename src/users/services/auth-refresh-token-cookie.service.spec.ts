import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { EVK } from '../../__helpers__';
import { PrismaService } from '../../common/services';
import { AuthRefreshTokenCookieService } from './auth-refresh-token-cookie.service';
import { TokenType } from '@prisma/client';
import { JWT_COOKIE_NAME } from '../../__helpers__/enums';

describe('AuthRefreshTokenCookieService', () => {
  let service: AuthRefreshTokenCookieService, prisma: PrismaService;
  const userId = 1,
    hashedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIlJvbGVzIjpbIkFkbWluIl0sImlhdCI6MTY2MTI1MzcwNSwiZXhwIjoxNjYxMjU3MzA1fQ.I5q32UMr41_G16XcmI03veFNHP4XvEyKrt7-xKAPnVY';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthRefreshTokenCookieService],
    })
      .useMocker((token) => {
        switch (token) {
          case PrismaService:
            return {
              token: {
                update: jest.fn(),
                create: jest.fn(),
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
                  case EVK.JWT_RT_SECRET:
                    return 'secret';
                  case EVK.NODE_ENV:
                    return 'dev';
                  case EVK.JWT_RT_EXP:
                    return 3600;
                }
              }),
            };
        }
      })
      .compile();

    service = await moduleRef.resolve(AuthRefreshTokenCookieService);
    prisma = moduleRef.get(PrismaService);
  });

  it('getCookie', () => {
    const cookieName = JWT_COOKIE_NAME.RT;
    const result = service.getCookie(cookieName, hashedToken, 3600);
    expect(result).toEqual(
      `Refresh=${hashedToken}; HttpOnly;  Path=/;  Max-Age=3600;`,
    );
  });

  it('updateRefreshToken', async () => {
    const tokenId = 1;
    await service.updateRefreshToken(tokenId, hashedToken);
    expect(prisma.token.update).toHaveBeenCalledWith({
      where: { id: tokenId },
      data: { value: hashedToken },
    });
  });

  it('createRefreshTokenRecord', async () => {
    await service.createRefreshTokenRecord(userId, 'USER');

    expect(prisma.token.create).toHaveBeenLastCalledWith({
      data: { userId, type: TokenType.Refresh, value: '' },
    });
  });

  it('hashRefreshToken', async () => {
    service.hashRefreshToken = jest.fn().mockResolvedValue(hashedToken);
    await service.hashRefreshToken(accessToken);

    expect(service.hashRefreshToken).toHaveBeenCalledWith(accessToken);
  });

  it('getRTCookie', async () => {
    service.createRefreshTokenRecord = jest
      .fn()
      .mockResolvedValue({ userId: 1, tokenId: 2 });
    service.signJwt = jest.fn().mockResolvedValue(accessToken);
    service.hashRefreshToken = jest.fn().mockResolvedValue(hashedToken);

    const result = await service.getRTCookie(userId);

    expect(result).toHaveProperty('cookie');
    expect(result).toHaveProperty('token');
  });
});
