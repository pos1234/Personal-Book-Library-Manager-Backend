/*
  Warnings:

  - Added the required column `key` to the `Bookmarks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bookmarks" ADD COLUMN     "key" TEXT NOT NULL;
