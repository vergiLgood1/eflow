import { db } from "@/db/prisma";

export async function generateSlug(baseSlug: string) {
  const record = await db.workspaceSlug.upsert({
    where: { base: baseSlug },
    update: { count: { increment: 1 } },
    create: { base: baseSlug, count: 0 },
  });

  if (record.count === 0) {
    return baseSlug;
  }

  return `${baseSlug}-${record.count}`;
}
