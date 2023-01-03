import { Currency } from '@prisma/client';

export interface WalletFindOrCreateParams {
  userId: number;
  currency: Currency;
};

