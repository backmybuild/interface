"use server"
import prisma from "@database";

/** Create a tip and roll up aggregates on the recipient (atomic). */
export const createTip = async (toUser: string, amount: number, fromUser?: string, message?: string) => {
  if (!toUser) throw new Error("toUser is required");
  if (Number.isNaN(amount)) throw new Error("amount must be a positive integer");

  const result = await prisma.$transaction(async (tx: any) => {
    // 1) ensure recipient exists
    await tx.user.upsert({
      where: { identity: toUser },
      create: { identity: toUser },
      update: {},
    });

    // 2) write the tip
    const tip = await tx.tips.create({
      data: { toUser, amount, fromUser, message },
    });

    // 3) update recipient aggregates
    const updatedUser = await tx.user.update({
      where: { identity: toUser },
      data: {
        totalTips: { increment: 1 },
        totalEarnings: { increment: amount },
      },
    });

    return { tip, user: updatedUser };
  });

  return result;
}
