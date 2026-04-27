/*
  Warnings:

  - You are about to drop the column `tags` on the `data_models` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "data_models" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "data_model_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dataModelId" TEXT NOT NULL,

    CONSTRAINT "data_model_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "data_model_tags_dataModelId_name_key" ON "data_model_tags"("dataModelId", "name");

-- AddForeignKey
ALTER TABLE "data_model_tags" ADD CONSTRAINT "data_model_tags_dataModelId_fkey" FOREIGN KEY ("dataModelId") REFERENCES "data_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;
