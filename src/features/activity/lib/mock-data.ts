import { ActivityItemData, ActivityStats } from "../types/activity";

export const MOCK_ACTIVITY_STATS: ActivityStats = {
    total: 248,
    creations: 12,
    updates: 184,
    deletions: 52
};

export const MOCK_ACTIVITY_ITEMS: ActivityItemData[] = [
    {
        id: "1",
        user: "Elden Ring",
        action: "Created",
        category: "Data Model",
        target: "core2",
        type: "create",
        relativeTime: "12 hours ago",
        timestamp: "Apr 27, 2026, 15:42"
    },
    {
        id: "2",
        user: "Elden Ring",
        action: "Updated",
        category: "Table Property",
        target: "core_users",
        type: "update",
        relativeTime: "14 hours ago",
        timestamp: "Apr 27, 2026, 13:15",
        changes: [
            { field: "changed_fields", newValue: "position, layout" },
            { field: "position", oldValue: "x: 120, y: 450", newValue: "x: 150, y: 480" },
            { field: "layout", oldValue: "empty", newValue: "compact" }
        ]
    },
    {
        id: "3",
        user: "Elden Ring",
        action: "Removed",
        category: "Table Column",
        target: "core_sessions.temp_id",
        type: "delete",
        relativeTime: "1 day ago",
        timestamp: "Apr 26, 2026, 18:22"
    },
    {
        id: "4",
        user: "Malenia Blade",
        action: "Updated",
        category: "Relationship",
        target: "users -> posts",
        type: "update",
        relativeTime: "2 days ago",
        timestamp: "Apr 25, 2026, 10:30",
        changes: [
            { field: "type", oldValue: "one-to-many", newValue: "one-to-one" },
            { field: "on_delete", oldValue: "restrict", newValue: "cascade" }
        ]
    },
    {
        id: "5",
        user: "Ranni Witch",
        action: "Created",
        category: "Workspace",
        target: "Dark Moon Project",
        type: "create",
        relativeTime: "3 days ago",
        timestamp: "Apr 24, 2026, 09:00"
    }
];
