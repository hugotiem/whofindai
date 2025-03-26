/*
  Warnings:

  - You are about to drop the column `nextBillingDate` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `previousBillingDate` on the `Billing` table. All the data in the column will be lost.
  - Added the required column `endAt` to the `Billing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `Billing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Billing" DROP COLUMN "nextBillingDate",
DROP COLUMN "previousBillingDate",
ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;
