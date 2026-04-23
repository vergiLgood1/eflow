import { auth } from "@/features/authentication/lib/auth-server";

export const { GET, POST } = auth.handler();
