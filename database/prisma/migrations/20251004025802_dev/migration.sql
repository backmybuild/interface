-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "identity" TEXT NOT NULL,
    "totalView" INTEGER NOT NULL DEFAULT 0,
    "totalTips" INTEGER NOT NULL DEFAULT 0,
    "TotalEarnings" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tips" (
    "id" SERIAL NOT NULL,
    "fromUser" TEXT,
    "toUser" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "message" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_identity_key" ON "User"("identity");
