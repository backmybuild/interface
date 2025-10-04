"use server";
import prisma from "@database"

const getRecentTips = async (toUser: string, limit = 10) => {
  return prisma.tips.findMany({
    where: { toUser },
    orderBy: { timestamp: "desc" },
    take: limit,
  });
}

export const fetchUserAnalytics = async (identity: string) => {
  const [user, tips] = await Promise.all([
    prisma.user.findUnique({ where: { identity: identity } }),
    getRecentTips(identity, 10),
  ]);

  return {
    user, // { totalView, totalTips, totalEarnings, ... }
    tips,
  };
}
