export type ActivityType = "create" | "update" | "delete";

/**
 * A single field edit recorded in an activity entry.
 *
 * Declared as a type alias rather than an interface because it is persisted in
 * the `details` jsonb column: only object *types* get an implicit index
 * signature, which is what makes them comparable to Prisma's JSON input types
 * without an `as any` escape hatch.
 */
export type ActivityFieldChange = {
  field: string;
  oldValue?: string;
  newValue: string;
};

export interface ActivityItemData {
  id: string;
  user: string;
  action: string;
  category: string;
  target: string;
  type: ActivityType;
  timestamp: string;
  relativeTime: string;
  changes?: ActivityFieldChange[];
}

export interface ActivityStats {
  total: number;
  creations: number;
  updates: number;
  deletions: number;
}
