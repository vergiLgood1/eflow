import { auth } from "./features/authentication/lib/auth-server";

export default auth.middleware({
    loginUrl: '/auth/sign-in',

});

export const config = {
    matcher: [
        '/workspaces/:path*',
        '/auth/:path*',
    ],
};