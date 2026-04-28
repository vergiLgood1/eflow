-- AlterTable
ALTER TABLE "data_models" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "previewColor" TEXT;
