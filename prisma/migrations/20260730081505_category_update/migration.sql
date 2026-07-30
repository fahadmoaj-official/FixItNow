/*
  Warnings:

  - Made the column `bio` on table `technicianProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `experienceYears` on table `technicianProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "technicianProfile" ALTER COLUMN "bio" SET NOT NULL,
ALTER COLUMN "bio" SET DEFAULT '',
ALTER COLUMN "experienceYears" SET NOT NULL,
ALTER COLUMN "experienceYears" SET DEFAULT 0;
