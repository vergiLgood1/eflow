-- AlterTable
ALTER TABLE "indexes" ADD COLUMN     "isUnique" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "relationships" ADD COLUMN     "cardinality" TEXT NOT NULL DEFAULT '1:n',
ADD COLUMN     "fkName" TEXT;

-- AlterTable
ALTER TABLE "table_nodes" ADD COLUMN     "hiddenColumns" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "tables" ADD COLUMN     "color" TEXT,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "views" ADD COLUMN     "x" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "y" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "table_records" (
    "id" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "table_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "record_values" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "columnName" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "record_values_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "table_records_tableId_idx" ON "table_records"("tableId");

-- CreateIndex
CREATE INDEX "record_values_recordId_idx" ON "record_values"("recordId");

-- AddForeignKey
ALTER TABLE "table_records" ADD CONSTRAINT "table_records_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record_values" ADD CONSTRAINT "record_values_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "table_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
