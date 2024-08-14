-- CreateEnum
CREATE TYPE "Category" AS ENUM ('AAAAA', 'BBBBB', 'CCCCC', 'DDDDD', 'EEEEE', 'FFFFF');

-- CreateTable
CREATE TABLE "Startup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "actualInvest" INTEGER NOT NULL DEFAULT 0,
    "simInvest" INTEGER NOT NULL DEFAULT 0,
    "revenue" INTEGER NOT NULL DEFAULT 0,
    "employees" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "category" "Category" NOT NULL,

    CONSTRAINT "Startup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "name" VARCHAR(10) NOT NULL,
    "InvestAmount" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT NOT NULL,
    "password" VARCHAR(40) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
