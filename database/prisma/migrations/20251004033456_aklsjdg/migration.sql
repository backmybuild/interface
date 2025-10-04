/*
  Warnings:

  - You are about to drop the column `TotalEarnings` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "TotalEarnings",
ADD COLUMN     "totalEarnings" INTEGER NOT NULL DEFAULT 0;
