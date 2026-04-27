/*
  Warnings:

  - The primary key for the `data_model_tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `data_model_tags` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `data_model_tags` table. All the data in the column will be lost.
  - Added the required column `tagId` to the `data_model_tags` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `dbType` on the `data_models` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `workspace_members` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'MEMBER');

-- CreateEnum
CREATE TYPE "DatabaseType" AS ENUM ('POSTGRESQL', 'MYSQL', 'ORACLE', 'SQLSERVER', 'SQLITE');

-- DropIndex
DROP INDEX "data_model_tags_dataModelId_name_key";

-- AlterTable
ALTER TABLE "data_model_tags" DROP CONSTRAINT "data_model_tags_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "tagId" TEXT NOT NULL,
ADD CONSTRAINT "data_model_tags_pkey" PRIMARY KEY ("dataModelId", "tagId");

-- AlterTable
ALTER TABLE "data_models" DROP COLUMN "dbType",
ADD COLUMN     "dbType" "DatabaseType" NOT NULL;

-- AlterTable
ALTER TABLE "workspace_members" DROP COLUMN "role",
ADD COLUMN     "role" "WorkspaceRole" NOT NULL;

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE INDEX "activity_logs_dataModelId_idx" ON "activity_logs"("dataModelId");

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "activity_logs"("userId");

-- CreateIndex
CREATE INDEX "checkpoints_dataModelId_idx" ON "checkpoints"("dataModelId");

-- CreateIndex
CREATE INDEX "columns_tableId_idx" ON "columns"("tableId");

-- CreateIndex
CREATE INDEX "data_model_tags_tagId_idx" ON "data_model_tags"("tagId");

-- CreateIndex
CREATE INDEX "data_model_tags_dataModelId_idx" ON "data_model_tags"("dataModelId");

-- CreateIndex
CREATE INDEX "data_models_workspaceId_idx" ON "data_models"("workspaceId");

-- CreateIndex
CREATE INDEX "diagrams_dataModelId_idx" ON "diagrams"("dataModelId");

-- CreateIndex
CREATE INDEX "groups_diagramId_idx" ON "groups"("diagramId");

-- CreateIndex
CREATE INDEX "indexes_tableId_idx" ON "indexes"("tableId");

-- CreateIndex
CREATE INDEX "notes_diagramId_idx" ON "notes"("diagramId");

-- CreateIndex
CREATE INDEX "procedures_dataModelId_idx" ON "procedures"("dataModelId");

-- CreateIndex
CREATE INDEX "relationships_dataModelId_idx" ON "relationships"("dataModelId");

-- CreateIndex
CREATE INDEX "table_nodes_tableId_idx" ON "table_nodes"("tableId");

-- CreateIndex
CREATE INDEX "tables_dataModelId_idx" ON "tables"("dataModelId");

-- CreateIndex
CREATE INDEX "triggers_tableId_idx" ON "triggers"("tableId");

-- CreateIndex
CREATE INDEX "views_dataModelId_idx" ON "views"("dataModelId");

-- CreateIndex
CREATE INDEX "workspace_members_userId_idx" ON "workspace_members"("userId");

-- AddForeignKey
ALTER TABLE "data_model_tags" ADD CONSTRAINT "data_model_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
