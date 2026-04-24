<!-- BEGIN:server-actions -->
# Server Actions & Error Handling

To maintain a Single Source of Truth and consistency across all Server Actions, you MUST adhere to the following rules for any current or future server actions:

1. **Use `ActionResponse` for return types**: Every Server Action MUST return `Promise<ActionResponse>` from `@/shared/lib/error.ts`.
   \`\`\`ts
   export type ActionResponse<T = any> = 
       | { success: true; data?: T; message?: string }
       | { success: false; error: string };
   \`\`\`

2. **Wrap in `try...catch` and use `handleActionError`**: The entire body of the action must be wrapped in a \`try...catch\` block. Errors must be returned by calling \`return handleActionError(error)\`.

3. **Throw `AppError` for manual failures**: Do not manually return \`{ success: false, error: "..." }\`. Instead, throw an \`AppError\` (from \`@/shared/lib/error.ts\`), which will be cleanly formatted by \`handleActionError\`.
   \`\`\`ts
   if (!session.data) throw new AppError("Unauthorized", 401);
   \`\`\`

4. **Do NOT catch `NEXT_REDIRECT`**: \`handleActionError\` internally calls \`unstable_rethrow(err)\` from \`next/navigation\` so that redirects are handled seamlessly by Next.js. You can safely call \`redirect('/path')\` inside your \`try\` block.

### Boilerplate Example:

\`\`\`ts
"use server";

import { ActionResponse, handleActionError, AppError } from "@/shared/lib/error";

export async function myAction(data: any): Promise<ActionResponse> {
  try {
    // 1. Validation
    // 2. Business Logic
    // 3. Throw AppError on expected failures
    if (invalid) throw new AppError("Invalid State", 400);

    return { success: true, data: result, message: "Success!" };
  } catch (error) {
    return handleActionError(error);
  }
}
\`\`\`
<!-- END:server-actions -->
