-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "description" TEXT,
ADD COLUMN     "expandedHeight" DOUBLE PRECISION,
ADD COLUMN     "isCollapsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "table_nodes" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "views" ADD COLUMN     "parentId" TEXT;
