import { z } from "zod";

export const columnSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Column name is required"),
  type: z.string().min(1, "Type is required"),
  isPk: z.boolean().default(false),
  isFk: z.boolean().default(false),
  isIdx: z.boolean().default(false),
  nullable: z.boolean().default(true),
  defaultValue: z.string().optional(),
});

export const tableSchema = z.object({
  name: z.string().min(1, "Table name is required"),
  columns: z.array(columnSchema),
  dbType: z.string().optional(),
  color: z.string().optional(),
});

export type ColumnFormData = z.infer<typeof columnSchema>;
export type TableFormData = z.infer<typeof tableSchema>;
