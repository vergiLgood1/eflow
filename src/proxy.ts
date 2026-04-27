import { db } from "@/db/prisma";
import { NextResponse, type NextRequest } from "next/server";

import { auth } from "./features/authentication/lib/auth-server";

export default async function middleware(request: NextRequest) {
    const session = await auth.getSession();

    if (!session.data) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    const userId = session.data.user.id;
    const { pathname } = request.nextUrl;

    if (pathname === '/workspaces/onboarding') {
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
            updatedAt: 'desc',
        },
    });

    if (!latestWorkspace) {
        if (pathname !== '/workspaces/onboarding') {
            return NextResponse.redirect(new URL('/workspaces/onboarding', request.url));
        }
        return NextResponse.next();
    }

    if (pathname === '/workspaces/onboarding') {
        return NextResponse.redirect(new URL(`/workspaces/${latestWorkspace.slug}`, request.url));
    }

    return NextResponse.next();
}



export const config = {
    matcher: [
        // Protected routes requiring authentication
        '/account/:path*',
        '/workspaces/:path*',
    ],
};