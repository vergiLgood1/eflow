import { db } from "@/db/prisma";
import { requireUser } from "@/features/authentication/lib/auth-guard";
import { AppError } from "@/shared/lib/error";

/**
 * Resolve a workspace by the slug that appears in the URL and prove the current
 * user belongs to it.
 *
 * A slug is a client-controlled identifier, so it can never be the basis for a
 * read: every workspace-scoped query has to go through this helper first.
 *
 * @throws {AppError} 401 without a session, 404 when the slug is unknown, 403
 * when the caller is not a member.
 */
export async function requireWorkspaceMemberBySlug(slug: string) {
  const user = await requireUser();

  const workspace = await db.workspace.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      members: {
        where: { userId: user.id },
        select: { id: true },
      },
    },
  });

  if (!workspace) throw new AppError("Workspace not found", 404);

  if (workspace.members.length === 0) throw new AppError("Forbidden", 403);

  return { user, workspace: { id: workspace.id, slug: workspace.slug } };
}
