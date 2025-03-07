-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'email',
ADD COLUMN     "usedCredits" INTEGER NOT NULL DEFAULT 0;
