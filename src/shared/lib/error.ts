import { NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { ZodError } from "zod";

export class AppError extends Error {
    constructor(public message: string, public statusCode: number = 400) {
        super(message);
    }
}

export type ActionResponse<T = any> = 
    | { success: true; data?: T; message?: string }
    | { success: false; error: string };

export function handleError(err: unknown) {
    if (err instanceof AppError) {
        return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    if (err instanceof ZodError) {
        return NextResponse.json({ error: err.flatten().fieldErrors }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export function handleActionError(err: unknown): ActionResponse {
    unstable_rethrow(err);
    if (err instanceof AppError) {
        return { success: false, error: err.message };
    }
    if (err instanceof ZodError) {
        return { success: false, error: err.issues[0]?.message || "Validation failed" };
    }
    if (err instanceof Error) {
        return { success: false, error: err.message };
    }
    return { success: false, error: "An unexpected error occurred" };
}