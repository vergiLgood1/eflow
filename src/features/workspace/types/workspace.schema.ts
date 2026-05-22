import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
});

export const createDataModelSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  tags: z
    .array(
      z
        .string()
        .min(1, "Tag must be at least 1 character")
        .max(30, "Tag must not exceed 30 characters")
        .transform((tag) => tag.toLowerCase().trim()),
    )
    .max(10, "Maksimal 10 tag")
    .optional(),
  dbType: z.enum(["POSTGRESQL", "MYSQL", "ORACLE", "SQLSERVER", "SQLITE"], {
    message: "Please select a valid database type",
  }),
});

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;
export type CreateDataModelSchema = z.infer<typeof createDataModelSchema>;
