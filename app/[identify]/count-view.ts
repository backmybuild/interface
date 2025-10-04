"use server";

import prisma from "@database";

export const countView = async (identity: string) => {
  const [user] = await prisma.$transaction([
    prisma.user.upsert({
      where: { identity },
      create: { identity, totalView: 1 },
      update: { totalView: { increment: 1 } },
    }),
  ]);
  return user;
}
