/*
  Warnings:

  - Added the required column `studentType` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StudentType" AS ENUM ('SECONDARY', 'TERTIARY');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "studentType" "StudentType" NOT NULL,
ALTER COLUMN "facultyId" DROP NOT NULL,
ALTER COLUMN "departmentId" DROP NOT NULL;
