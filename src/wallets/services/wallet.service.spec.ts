import { Currency } from "@prisma/client";
import { Test, TestingModule } from "@nestjs/testing";
import { WalletService } from "./wallet.service";
import { PrismaService } from "../../common/services";
import { WalletFindOrCreateParams } from "../interfaces";

describe("WalletService", () => {
  let service: WalletService, prisma: PrismaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletService],
    })
      .useMocker((token) => {
        switch (token) {
          case PrismaService:
            return {
              wallet: {
                upsert: jest.fn(),
              },
            };
          default:
            return {};
        }
      })
      .compile();

    service = module.get<WalletService>(WalletService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("findOrCreate", async () => {
    const walletFindOrCreateParams: WalletFindOrCreateParams = {
      userId: 1,
      currency: Currency.RWF,
    };

    await service.findOrCreate(walletFindOrCreateParams);

    expect(prisma.wallet.upsert).toHaveBeenCalledTimes(1);
  });
});
