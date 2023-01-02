import { Test, TestingModule } from '@nestjs/testing';
import { FastifyRequest } from 'fastify';
import { JwtATStrategy } from './jwt-access.strategy';
import { EVK } from '../../__helpers__';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload } from '../interfaces';
import { UserService } from '../services';

describe('JwtATStrategy', () => {
  let jwtAccessStrategy: JwtATStrategy;

  const req = {
      user: {
        id: 1,
      },
      cookies: {
        Authentication: '12345678',
      },
      Roles: ['Admin'],
    } as unknown as FastifyRequest,
    payload: AccessTokenPayload = {
      userId: 2,
      Roles: ['Admin']
    },
    expectedResponse = {
      id: payload.userId,
      Roles: payload.Roles,
    };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [JwtATStrategy],
    })
      .useMocker((token) => {
        switch (token) {
          case ConfigService:
            return {
              get: jest.fn().mockImplementation((type) => {
                switch (type) {
                  case EVK.JWT_AT_SECRET:
                    return 'JWT-AT-SECRET';
                }
              }),
            };
          case UserService:
            return {
              findOne: jest.fn().mockResolvedValue({}),
            };
        }
      })
      .compile();
    jwtAccessStrategy = await moduleRef.resolve(JwtATStrategy);
  });

  it('validate', async () => {
    const resp = await jwtAccessStrategy.validate(req, payload);
    expect(resp).toEqual({
      ...expectedResponse,
      email: undefined,
      username: undefined
    });
  });
});
