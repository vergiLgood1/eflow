export type ActivityType = "create" | "update" | "delete";

export interface ActivityFieldChange {
    field: string;
    oldValue?: string;
    newValue: string;
}

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
