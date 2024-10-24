/*
  Warnings:

  - You are about to drop the column `fullName` on the `Student` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('SECONDARY', 'TERTIARY');

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "schoolType" "SchoolType" NOT NULL DEFAULT 'TERTIARY';

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "fullName",
ADD COLUMN     "guardianFullName" TEXT;
