import * as bcrypt from "bcrypt";
import { Test, TestingModule } from "@nestjs/testing";
import { Prisma } from "@prisma/client";
import { LocalStrategy } from "./local.strategy";
import { HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "../../common/services";

describe("LocalStrategy", () => {
  const data: Prisma.UserCreateInput = {
    email: "tekana-ewallet@email.com",
    username: "tekana-user",
    password: "12345678",
  };

  let service: LocalStrategy,
    user: Prisma.UserCreateInput,
    prisma: PrismaService;

  user = {
    ...data,
    password: bcrypt.hashSync(data.password, 10),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalStrategy],
    })
      .useMocker((token) => {
        switch (token) {
          case PrismaService:
            return {
              user: {
                findFirst: jest.fn(),
                findUnique: jest.fn(),
              },
            };
          default:
            return {};
        }
      })
      .compile();

    service = module.get<LocalStrategy>(LocalStrategy);
    prisma = module.get(PrismaService);
  });

  it("Error on wrong password", async () => {
    try {
      const result = await service.validate(user.username, "12345678");
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error?.status).toBe(HttpStatus.BAD_REQUEST);
      expect(error?.message).toBe("Wrong credentials");
    }
  });

  it("Error on wrong username", async () => {
    try {
      await service.validate(data.password, data.password);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error?.status).toBe(HttpStatus.BAD_REQUEST);
      expect(error?.message).toBe("Wrong credentials");
    }
  });

  it("Error on wrong email", async () => {
    try {
      await service.validate(data.email, data.password);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error?.status).toBe(HttpStatus.BAD_REQUEST);
      expect(error?.message).toBe("Wrong credentials");
    }
  });

  it("Can login with email", async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue({
      id: 1,
      password: user.password,
    });
    const result = await service.validate(user.email, data.password);
    expect(result.id).toBe(1);
  });

  it("Can login with username (insensitive)", async () => {
    prisma.user.findFirst = jest.fn().mockResolvedValue({
      id: 1,
      password: user.password,
    });

    const result = await service.validate(
      user.username.toUpperCase(),
      data.password
    );
    expect(result.id).toBe(1);
  });
});
