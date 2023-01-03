-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('Pending', 'Failed', 'Successful');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT E'Pending';
