import { auth } from "./features/authentication/lib/auth-server";

export default auth.middleware({
    // Redirects unauthenticated users to sign-in page
    loginUrl: '/auth/sign-in',
});

export const config = {
    matcher: [
        // Protected routes requiring authentication
        '/account/:path*',
        // '/workspaces/:path*',
    ],
};