import { z } from "zod";

export const columnSchema = z.object({
  name: z.string().trim().min(1, "Column name is required"),
  type: z.string().trim().min(1, "Column type is required"),
  isPk: z.boolean().optional(),
  isUnique: z.boolean().optional(),
  isAutoIncrement: z.boolean().optional(),
  isUuid: z.boolean().optional(),
  nullable: z.boolean().optional(),
  defaultValue: z.string().optional(),
  notes: z.string().optional(),
});

export const indexSchema = z.object({
  name: z.string().trim().min(1, "Index name is required"),
  columns: z
    .array(z.string().trim().min(1))
    .min(1, "Select at least one column"),
  type: z.enum(["btree", "hash", "gist", "gin"]).optional(),
  isUnique: z.boolean().optional(),
});

export const tableSchema = z.object({
  name: z.string().trim().min(1, "Table name is required"),
  color: z.string().optional(),
});

export const groupSchema = z.object({
  name: z.string().trim().min(1, "Group name is required"),
  description: z.string().optional(),
});

export const viewSchema = z.object({
  name: z.string().trim().min(1, "View name is required"),
  query: z.string().trim().min(1, "Query is required"),
});
