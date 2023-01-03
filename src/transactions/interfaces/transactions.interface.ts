import { Currency, PrismaPromise } from "@prisma/client";

export interface DepositFundsParams<T> {
  userId: number;
  amount: number;
  currency: Currency;
  transactionDate: Date;
};

