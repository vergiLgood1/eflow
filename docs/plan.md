# Core Feature Database Integration Plan

## Overview
Currently, the Eflow canvas (Eflow) manages schema data (tables, columns, relationships) mostly in-memory using a Zustand store. The persistence layer (`saveDiagram` action) only saves diagram layout metadata (node positions) and does not persist the actual database schema structure to the Prisma models (`Table`, `Column`, `Relationship`, etc.).

This plan outlines the steps to integrate the visual editor with the database persistence layer to ensure a fully functional and persistent database design experience.

## Audit Findings
- **Prisma Schema**: Already contains models for `Table`, `Column`, `Relationship`, `View`, `Trigger`, `Procedure`, `Group`, and `Note`.
- **Canvas Types**: `TableNodeData` and `RelationshipEdgeData` are well-defined and compatible with the Prisma models.
- **Persistence Layer**: `saveDiagram` only handles `TableNode` (position sync). It lacks logic for the underlying schema objects.
- **Missing Features**: UI for Views, Triggers, and Procedures is documentation-only or partially implemented without DB logic.

## Implementation Steps

### Phase 1: Core Schema Persistence (Tables & Columns)
- **Action**: Create `model.action.ts` in `src/features/model/applications`.
- **Goal**: Implement granular actions for Table and Column CRUD that sync directly with the DB.
- **Tasks**:
    - `createTableAction(dataModelId, tableData)`: Create `Table` and its initial `Column` (usually `id`).
    - `updateTableAction(tableId, updates)`: Rename or update table metadata.
    - `deleteTableAction(tableId)`: Remove table and associated columns/nodes.
    - `upsertColumnAction(tableId, columnData)`: Handle column additions and modifications.
    - `deleteColumnAction(columnId)`: Remove a column.

### Phase 2: Relationship & Index Persistence
- **Goal**: Persist table relationships and indexes defined on the canvas.
- **Tasks**:
    - `upsertRelationshipAction(relationshipData)`: Map React Flow edges to the `Relationship` model.
    - `deleteRelationshipAction(relationshipId)`: Remove relationships.
    - `syncIndexesAction(tableId, indexes)`: Persist index definitions.

### Phase 3: Diagram Elements (Groups & Notes)
- **Goal**: Persist visual organizational elements to the `Group` and `Note` models.
- **Tasks**:
    - Update `saveDiagram` to handle `Group` and `Note` upserts/deletes alongside `TableNode`.

### Phase 4: Advanced Objects (Views, Triggers, Procedures)
- **Goal**: Implement persistence and versioning for database objects.
- **Tasks**:
    - Implement `View` CRUD with SQL parsing and `VersionHistory`.
    - Implement `Trigger` and `Procedure` management.

### Phase 5: Checkpoints & Migrations
- **Goal**: Implement the snapshot system described in the documentation.
- **Tasks**:
    - Create a `Checkpoint` when the user clicks "Create Checkpoint".
    - Implement a diff engine to generate SQL migrations between checkpoints.

## Proposed GitHub Issues

1. **[Core] Implement Table & Column Persistence Layer**
   - Create server actions for Table/Column CRUD.
   - Refactor `useTableActions` to call these server actions.
   - Ensure Zustand store stays in sync with DB state.

2. **[Core] Implement Relationship Persistence**
   - Create server actions for Relationship CRUD.
   - Connect React Flow edge creation/deletion to the `Relationship` model.

3. **[UI/UX] Persist Groups and Notes to Diagram**
   - Update `saveDiagram` payload to include Groups and Notes.
   - Implement DB persistence for these visual elements.

4. **[Feature] Views, Triggers & Procedures Integration**
   - Build CRUD actions for Views, Triggers, and Procedures.
   - Add `VersionHistory` tracking for these objects.

5. **[Feature] Schema Checkpoints & Migration Generator**
   - Implement snapshot logic for `Checkpoint` model.
   - Basic SQL migration generator (diff between two snapshots).
yes