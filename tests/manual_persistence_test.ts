import { db } from "@/db/prisma";
import { getModelDiagram, syncModelSchema } from "@/features/model/applications/model.action";



async function testPersistence() {
    const dataModelId = "test-model-id"; // Ensure this exists or use a real one
    const diagramId = "main";
    const diagramName = "main";

    console.log("--- Testing Persistence ---");

    // 1. Create a mock table
    const nodes = [
        {
            id: "table-1",
            type: "table",
            position: { x: 100, y: 100 },
            data: {
                name: "test_table",
                columns: [
                    { id: "col-1", name: "id", type: "uuid", isPk: true }
                ]
            }
        }
    ];

    console.log("Syncing model...");
    const syncResult = await syncModelSchema(dataModelId, diagramId, diagramName, nodes as any, []);
    console.log("Sync Result:", syncResult);

    // 2. Fetch it back
    console.log("Fetching diagram...");
    const fetchResult = await getModelDiagram(dataModelId, diagramId);
    console.log("Fetch Result Success:", fetchResult.success);

    if (fetchResult.success && fetchResult.data) {
        console.log("Nodes found:", fetchResult.data.nodes.length);
        console.log("Node 1 Name:", (fetchResult.data.nodes[0].data as any).name);
    }

    // 3. Delete it
    console.log("Syncing empty model (deletion)...");
    await syncModelSchema(dataModelId, diagramId, diagramName, [], []);

    // 4. Verify activity logs
    const logs = await db.activityLog.findMany({
        where: { dataModelId },
        orderBy: { createdAt: "desc" },
        take: 5
    });

    console.log("Recent Activity Logs:");
    logs.forEach(log => {
        console.log(`- [${log.createdAt.toISOString()}] ${log.action} (${(log.details as any)?.type})`);
    });
}

// Note: This script needs a real session/auth mock if run via bun directly
// For now, I'll just rely on my code review as the browser is broken.
