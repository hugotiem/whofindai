/*
  Warnings:

  - You are about to drop the column `achievements` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `background` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `companyDescription` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `currentOccupation` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `currentRoleSummary` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `headline` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `hobbiesAndPassions` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `linkedin` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `marketPosition` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `pictureUrl` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `productFit` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `prompt` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `recentDevelopments` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `Experience` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_profileId_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "achievements",
DROP COLUMN "background",
DROP COLUMN "companyDescription",
DROP COLUMN "currentOccupation",
DROP COLUMN "currentRoleSummary",
DROP COLUMN "description",
DROP COLUMN "headline",
DROP COLUMN "hobbiesAndPassions",
DROP COLUMN "linkedin",
DROP COLUMN "location",
DROP COLUMN "marketPosition",
DROP COLUMN "pictureUrl",
DROP COLUMN "productFit",
DROP COLUMN "prompt",
DROP COLUMN "recentDevelopments",
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "profileData" JSONB;

-- DropTable
DROP TABLE "Experience";
