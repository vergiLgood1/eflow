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

/**
 * Model name submitted on its own by the rename action.
 *
 * Shares the create-model rule so a rename cannot accept a value the original
 * form would reject.
 */
export const dataModelNameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters");

const dataModelTagSchema = z
  .string()
  .trim()
  .min(1, "Tag must be at least 1 character")
  .max(30, "Tag must not exceed 30 characters")
  .transform((tag) => tag.toLowerCase());

export const dataModelTagsSchema = z
  .array(dataModelTagSchema)
  .max(10, "A data model can have at most 10 tags");

export const createDataModelSchema = z.object({
  name: dataModelNameSchema,
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
  tags: dataModelTagsSchema.optional(),
  dbType: z.enum(["POSTGRESQL", "MYSQL", "ORACLE", "SQLSERVER", "SQLITE"], {
    message: "Please select a valid database type",
  }),
});

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;
export type CreateDataModelSchema = z.input<typeof createDataModelSchema>;
