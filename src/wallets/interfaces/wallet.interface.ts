import { Currency } from '@prisma/client';

export interface WalletFindOrCreateParams {
  userId: number;
  currency: Currency;
};

export interface FindWalletByUserNameParams {
  currency: Currency;
  emailOrUsername: string;
};


