import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
});

export const createDataModelSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dbType: z.enum(["POSTGRESQL", "MYSQL", "SQLITE", "SQLSERVER", "MONGODB"], {
    message: "Please select a valid database type",
  }),
});

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;
export type CreateDataModelSchema = z.infer<typeof createDataModelSchema>;
