import { db } from "@/db/prisma";
import { NextResponse, type NextRequest } from "next/server";

import { auth } from "./features/authentication/lib/auth-server";

export default async function middleware(request: NextRequest) {
  const session = await auth.getSession();
  const { pathname } = request.nextUrl;

  if (!session.data) {
    if (pathname === "/") {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  const userId = session.data.user.id;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { hasCompleteOnboarding: true },
  });

  if (!user) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (pathname === "/") {
    const latestWorkspace = await db.workspace.findFirst({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (latestWorkspace) {
      return NextResponse.redirect(
        new URL(`/workspaces/${latestWorkspace.slug}`, request.url),
      );
    }

    return NextResponse.redirect(
      new URL("/workspaces/onboarding", request.url),
    );
  }

  if (user.hasCompleteOnboarding && pathname === "/workspaces/onboarding") {
    const latestWorkspace = await db.workspace.findFirst({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (latestWorkspace) {
      return NextResponse.redirect(
        new URL(`/workspaces/${latestWorkspace.slug}`, request.url),
      );
    }
    return NextResponse.redirect(new URL("/workspaces", request.url));
  }

  if (pathname === "/workspaces/onboarding") {
    return NextResponse.next();
  }

  const latestWorkspace = await db.workspace.findFirst({
    where: {
      members: {
        some: {
          userId: userId,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!latestWorkspace && !user?.hasCompleteOnboarding) {
    if (pathname !== "/workspaces/onboarding") {
      return NextResponse.redirect(
        new URL("/workspaces/onboarding", request.url),
      );
    }
    return NextResponse.next();
  }

  if (pathname === "/workspaces" || pathname === "/workspaces/onboarding") {
    if (latestWorkspace) {
      return NextResponse.redirect(
        new URL(`/workspaces/${latestWorkspace.slug}`, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes requiring authentication
    "/",
    "/account/:path*",
    "/workspaces/:path*",
  ],
};
