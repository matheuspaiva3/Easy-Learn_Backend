/*
  Warnings:

  - The `filename` column on the `files` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `path` column on the `files` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "filename",
ADD COLUMN     "filename" TEXT[],
DROP COLUMN "path",
ADD COLUMN     "path" TEXT[];
