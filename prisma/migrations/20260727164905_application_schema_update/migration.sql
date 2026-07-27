/*
  Warnings:

  - You are about to drop the column `TechnicianId` on the `application` table. All the data in the column will be lost.
  - Added the required column `technicianId` to the `application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "application" DROP CONSTRAINT "application_TechnicianId_fkey";

-- AlterTable
ALTER TABLE "application" DROP COLUMN "TechnicianId",
ADD COLUMN     "technicianId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
