/*
  Warnings:

  - You are about to drop the column `subscriptionCreatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "subscriptionCreatedAt",
ADD COLUMN     "nextBillingDate" TIMESTAMP(3),
ADD COLUMN     "subscriptionStartedAt" TIMESTAMP(3);
