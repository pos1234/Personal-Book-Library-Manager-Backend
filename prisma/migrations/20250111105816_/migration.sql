/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Bookmarks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bookmarks_key_key" ON "Bookmarks"("key");
