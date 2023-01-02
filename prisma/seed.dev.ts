import { Currency, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createMasterTekanaWallet(currency: Currency) {
  const masterWallet = await prisma.wallet.findFirst({
    where: { User: { username: "tekana" }, currency },
  });
  if (!masterWallet) {
    await prisma.wallet.create({
      data: {
        User: { connect: { username: "tekana" } },
        currency,
      },
    });
  }
}

async function run() {
  await createMasterTekanaWallet("RWF");
}

run();
