Documentation
Everything you need to know about Eflow

On this page
🗄️
Getting Started
📊
Tables & Columns
🔗
Relationships & Foreign Keys
⚙️
Views, Triggers & Procedures
🎨
Visual Editor & Canvas
🤖
Collaboration
📥
Importing SQL
🚀
Checkpoints & Migrations
📜
Version History
⌨️
Keyboard Shortcuts

🗄️
Getting Started
Learn the basics of ER Flow — workspaces, data models, and the visual editor.

Workspaces
A workspace is the top-level container in ER Flow. When you sign up, you'll create your first workspace. Each workspace can hold multiple data models and team members.

Think of a workspace like an organization — if you have a company called "Acme Corp", create a workspace for it. All data models for Acme Corp's projects live inside that workspace.

From the Workspace Dashboard you can create new data models, manage team members, view activity logs, and configure workspace settings.

Data Models
A data model is a single schema — a collection of tables, columns, relationships, views, triggers, and procedures. Each data model belongs to one workspace.

When creating a data model, you choose a database type. ER Flow supports 5 databases:

PostgreSQL — includes types like uuid, jsonb, serial, bigserial, array, bytea. Index types: BTREE, HASH, GIN, GIST, BRIN.
MySQL — includes tinyint, mediumtext, longtext, enum, binary, varbinary. Index types: BTREE, HASH, FULLTEXT.
Oracle — includes number, varchar2, clob, nclob, raw. Index types: BTREE, BITMAP.
SQL Server — includes nvarchar, nchar, ntext, uniqueidentifier, money. Index types: CLUSTERED, NONCLUSTERED.
SQLite — simplified type system: integer, real, text, blob, numeric.
The database type determines which column types, index types, and features are available. You can switch database types at any time — ER Flow will check compatibility and auto-convert column types where possible.

The Visual Editor
After creating a data model, you enter the visual editor — a canvas-based interface where you design your schema. The editor has these main areas:

Toolbar (top) — tools for adding tables, views, relationships, notes, groups, plus undo/redo, zoom, import SQL, and checkpoints
Sidebar (left) — lists all tables and columns; click to select and edit
Canvas (center) — the main drawing area where tables are displayed as cards connected by relationship lines
Diagram Tabs (top, below toolbar) — switch between multiple diagrams within the same data model

📊
Tables & Columns
Create tables, define column types, set constraints, primary keys, and manage your schema.

Creating Tables
To add a table, click the Table icon in the toolbar or right-click the canvas and select "Add Table". Click on the canvas to place it. Enter the table name and confirm.

Every new table is created with a default id column — an auto-increment integer primary key. You can modify or remove this column.

Column Types
ER Flow provides database-specific column types. Common types available across all databases:

Numeric: int, bigint, smallint, decimal, float, double
Text: varchar (with length), char (with length), text
Date/Time: date, datetime, timestamp, time
Other: boolean, json, blob, custom
Database-specific types are only available when the corresponding database is selected. For example, uuid and jsonb are PostgreSQL-only, while tinyint and enum are MySQL-only.

The custom type lets you enter any type string manually — useful for database-specific types not yet in the UI.

Column Properties
Each column has these configurable properties:

Type — the data type (e.g., varchar, int, timestamp)
Length — for types that support it (e.g., varchar(255), char(36))
Precision / Scale — for decimal types (e.g., decimal(10,2))
Nullable — whether the column allows NULL values
Default Value — a default value expression
Unique — adds a unique constraint
Auto Increment — for integer primary keys
Unsigned — MySQL-specific, for numeric types
Custom Type — free-text type when using the custom type
Click on any column in the sidebar or on the table card to open the Column Popover where you can edit all properties.

Primary Keys
Mark one or more columns as the primary key. For composite primary keys, select multiple columns. The primary key is displayed with a key icon next to the column name on the table card.

Database Type Switching
When you switch a data model's database type (e.g., from MySQL to PostgreSQL), ER Flow performs automatic type conversion:

Compatible types are kept as-is (e.g., varchar exists in both MySQL and PostgreSQL)
Auto-convertible types are mapped to equivalents (e.g., MySQL tinyint → PostgreSQL smallint, MySQL longtext → PostgreSQL text)
Incompatible types without a mapping are marked as custom for manual review
ER Flow handles conversions between all 5 databases with a comprehensive type mapping table covering types like uuid ↔ char, jsonb ↔ json, serial ↔ int, nvarchar ↔ varchar, number ↔ numeric, and many more.


🔗
Relationships & Foreign Keys
Define foreign keys, configure cascade rules, and visualize table relationships.

Creating Relationships
To create a foreign key relationship, click the Link icon in the toolbar to enter "relate" mode. Then click on the source table (the table that holds the FK column), and then click on the target table (the referenced table).

ER Flow will automatically create a foreign key from the source table's appropriate column to the target table's primary key. If no matching column exists, it will suggest creating one.

You can also create foreign keys manually from the table's column popover or via the context menu.

Cascade Rules
Each foreign key supports ON DELETE and ON UPDATE cascade rules:

CASCADE — automatically delete/update related rows
SET NULL — set the FK column to NULL when the referenced row is deleted/updated
SET DEFAULT — set the FK column to its default value
RESTRICT — prevent deletion/update if related rows exist
NO ACTION — similar to RESTRICT (default behavior)
Click on a relationship line on the canvas to open the Foreign Key Popover and configure these rules.

Visual Representation
Relationships appear as lines connecting tables on the canvas. The line style indicates cardinality:

One-to-many — the most common relationship, shown with a crow's foot notation
One-to-one — when the FK column has a unique constraint
Lines automatically route around tables and update position when you move tables on the canvas.


⚙️
Views, Triggers & Procedures
Create database views with AI assistance, define triggers, and manage stored procedures.

Database Views
Views are virtual tables defined by a SQL SELECT statement. In ER Flow, views appear on the canvas like tables but with a distinct visual style.

To create a view, click the View icon in the toolbar or right-click the canvas and select "Add View". The Create View Modal opens with a two-step process:

Step 1 — Define the SQL: - Enter a view name - Write the SQL SELECT statement manually, or - Use the AI-assisted generation: type a natural language prompt (e.g., "Show all active users with their post count") and ER Flow's AI will analyze your existing tables and generate the SQL for you Step 2 — Review and confirm: - ER Flow parses the SELECT columns and displays them - Select which column serves as the primary identifier - Confirm to create the view on the canvas

Views also support version history — you can view previous versions of a view's SQL and restore them.

Triggers
Triggers are actions that execute automatically when a specific database event occurs. Right-click on a table and select "Add Trigger" to create one.

Each trigger has: - Name — unique identifier - Event — INSERT, UPDATE, or DELETE - Timing — BEFORE or AFTER the event - Body — the SQL code to execute - For Each — ROW or STATEMENT level

Triggers appear in the table card below the columns section. Click on a trigger to edit its properties.

Stored Procedures
ER Flow supports full stored procedure modeling. Open the Procedure Modal from the sidebar to create or edit procedures.

Procedure properties: - Name — the procedure identifier - Description — optional documentation - Language — varies by database (e.g., SQL, PL/pgSQL for PostgreSQL) - Security Type — DEFINER or INVOKER - SQL Data Access — CONTAINS SQL, READS SQL DATA, MODIFIES SQL DATA, or NO SQL - Deterministic — whether the procedure always returns the same result for the same inputs - Body — the SQL implementation - Parameters — input/output parameters with name, type, mode (IN, OUT, INOUT), and optional default values

Available options (languages, security types, parameter modes) adapt based on your selected database type. Procedures also have full version history.


🎨
Visual Editor & Canvas
Master the canvas tools — groups, notes, multiple diagrams, and navigation.

Toolbar Tools
The toolbar at the top of the editor provides these tools:

Cursor — default selection mode; click tables to select, drag to move
Add Table — click on canvas to place a new table
Add View — click on canvas to create a new database view
Relate — click two tables to create a foreign key relationship
Note — click on canvas to place a text note
Group — click and drag to create a group container
Checkpoints — open the checkpoints/migration modal
Import SQL — open the SQL import modal
Undo / Redo — step through change history
Zoom In / Zoom Out — adjust the canvas zoom level
Canvas Navigation
Pan — click and drag on the canvas background
Zoom — scroll wheel, or use the +/- toolbar buttons
Zoom range — 20% to 250%
Viewport — your current zoom and pan position is saved per data model and restored when you reopen it
Context Menu
Right-click anywhere on the canvas to open the context menu:

On the canvas background — Add Table, Add View, Add Note, Add Group
On a table — Edit Properties, Add Column, Add Trigger, Rename, Delete, Hide from Diagram
On a column — Edit Column, Delete Column
On a group — Edit Group, Delete Group
Groups
Groups are visual containers that organize related tables. Create a group from the toolbar (Layers icon) or the context menu. Groups have:

Name — displayed as a header on the canvas
Color — choose from a palette to visually distinguish different logical areas
Resize — drag edges to adjust size
Move — drag the header to move the group and all contained tables
Notes
Notes are free-text annotations on the canvas. Use them to document design decisions, TODOs, or context. Notes are:

Freely positionable on the canvas
Saved with the diagram
Visible to all collaborators
Editable by double-clicking
Multiple Diagrams
Each data model can have multiple diagrams — different visual arrangements of the same underlying schema. Use the Diagram Tabs at the top of the editor:

Click "+" to create a new diagram
Each diagram has its own table positions, groups, and notes
The underlying schema is shared — column changes in one diagram reflect everywhere
Use this to create focused views: "Full Schema", "User Module", "Payment Flow", etc.
A special "Draft (pending approval)" diagram exists for AI-suggested changes

👥
Collaboration
Real-time collaboration with CRDT sync, presence, and permission management.

Real-Time Sync
ER Flow uses CRDTs (Conflict-free Replicated Data Types) powered by Yjs for real-time collaboration. This means:

Multiple editors can modify different parts of the schema simultaneously without conflicts
Changes propagate instantly via WebSocket
No "save" button needed — all changes are synchronized automatically
Offline changes are merged when you reconnect
Sharing a Data Model
Click the Share button in the editor header to open the Share modal. You can share via:

Share Link — Generate a unique URL. Anyone with the link can access the diagram with the permissions you set. Email Invite — Enter a teammate's email to send a direct invitation.

Permission Levels
Editor — Full access: create, modify, and delete schema elements. Can import SQL, create checkpoints, generate migrations, and use all editor features. Viewer — Read-only access: can see the diagram and all live changes but cannot modify anything. The toolbar buttons (add table, relate, import, etc.) are disabled. Attempting to edit shows a read-only notification.

Presence
When collaborators are connected:

Avatars appear in the toolbar showing who's online
Live cursors show each collaborator's pointer position on the canvas
Up to 4 avatars are shown in the toolbar; additional collaborators are indicated with a count badge
Workspaces & Teams
From the Workspace Dashboard you can manage your team:

Invite new members by email
Set roles: Owner (full admin access) or Member
View all workspace members and their status
Remove members or transfer ownership
Track activity across all data models in the workspace via the Activity Log

📥
Importing SQL
Import existing schemas from SQL files or paste CREATE TABLE statements.

Opening the Import Modal
Click the Upload icon in the toolbar to open the Import SQL modal. You need editor permissions to import.

Input Methods
File Upload — Drag and drop a .sql or .txt file onto the drop zone, or click to browse. The file is read entirely in the browser. Text Paste — Switch to the "Text" tab and paste your SQL directly.

Supported SQL Syntax
The parser handles standard SQL from PostgreSQL, MySQL, and SQLite:

CREATE TABLE with all column definitions
Column constraints: PRIMARY KEY, UNIQUE, NOT NULL, DEFAULT, AUTO_INCREMENT
FOREIGN KEY ... REFERENCES with ON DELETE / ON UPDATE cascade rules
CREATE INDEX and CREATE UNIQUE INDEX (standalone statements)
Schema-qualified names: public.users, dbo.orders
Quoted identifiers: "users", ` users , [users]`
MySQL-specific: ENGINE=InnoDB, CHARSET=utf8mb4
Comments: -- single-line and /* */ multi-line (ignored)
Preview
The parser runs in real-time as you type or upload. A preview panel shows: - Number of tables detected - Table names with column counts - Parse errors (if any)

Import Logic
When you click Import, ER Flow:

Creates new tables for names not already in the schema
Reuses existing tables by name — adds missing columns, skips existing ones
Creates foreign keys between tables, resolving references
Creates indexes (both inline constraints and standalone CREATE INDEX)
Creates stub tables for FK targets not included in the SQL
Auto-detects id integer PKs without AUTO_INCREMENT and marks them as auto-increment
After Import
A success toast shows stats: tables created vs. reused
Warnings appear if there were conflicts or stub tables
All changes are undoable with Ctrl+Z
Tables appear on the canvas — arrange them by dragging

🚀
Checkpoints & Migrations
Create schema snapshots, diff changes, and generate migration files.

Checkpoints
A checkpoint is a complete snapshot of your schema at a point in time. Open the Checkpoints modal by clicking the Flag icon in the toolbar.

Each checkpoint captures: all tables, columns, indexes, foreign keys, triggers, and procedures. Checkpoints are stored on the server and can be used to:

Generate migrations (diff between checkpoint and current state)
Track schema evolution over time
Roll back to a previous state as a reference
Create checkpoints before major changes, after production deployments, or at any meaningful milestone.

Schema Diff Engine
When generating a migration, ER Flow's diff engine compares two schema snapshots and detects:

table.create — new table added
table.drop — table removed
table.rename — table renamed
column.add — new column in an existing table
column.drop — column removed
column.rename — column renamed
column.modify — column type, constraints, or properties changed
index.add / index.drop — index created or removed
fk.add / fk.drop — foreign key created or removed
pk.set — primary key changed
Migration Generators
ER Flow supports two migration generators:

Migration Workflow
Create a checkpoint (your baseline)
Make schema changes in the visual editor
Open the migration modal from the checkpoint
Review the detected changes and generated code
Copy to clipboard, download as a file, or apply (marks current schema as the new baseline)
Add the migration file to your project and run it with your framework's migration command

📜
Version History
Track changes to individual objects and restore previous versions.

Per-Object Versioning
ER Flow tracks version history for individual schema objects — views, triggers, and procedures. Each time you save a change, a new version is recorded with:

Version number
Timestamp
Author (who made the change)
Full snapshot of the object's state
Viewing History
Click the History button when editing a view or procedure to open the Version History panel. You'll see a chronological list of all versions.

Diff View
Select any version to see a diff against the current state:

Field changes — properties that were added, modified, or removed
Body diff — line-by-line comparison of SQL body changes (added lines in green, removed in red)
SQL diff — for views, shows changes to the SELECT statement
Parameter changes — for procedures, shows added/removed/modified parameters
Restoring a Version
Click "Restore" on any version to revert the object to that state. A confirmation dialog appears before restoring. The restore operation:

Applies the old version's state as new operations
Is itself versioned (so you can undo a restore)
Syncs to all collaborators in real-time


⌨️
Keyboard Shortcuts
Speed up your workflow with keyboard shortcuts.

General
Ctrl+Z / Cmd+Z — Undo
Ctrl+Shift+Z / Cmd+Shift+Z — Redo
Escape — Cancel current tool / deselect
Delete / Backspace — Delete selected element
Canvas
Scroll wheel — Zoom in/out
Click + drag (background) — Pan
Click (table) — Select table
Double-click (table header) — Rename table
Double-click (note) — Edit note text
Double-click (group header) — Rename group
Editing
Enter — Confirm/save in popovers and modals
Escape — Cancel/close popovers and modals
Tab — Navigate between fields in column and property editors
Ctrl+Z / Cmd+Z — Undo
Ctrl+Shift+Z / Cmd+Shift+Z — Redo
Escape — Cancel current tool / deselect
Delete / Backspace — Delete selected element
Canvas
Scroll wheel — Zoom in/out
Click + drag (background) — Pan
Click (table) — Select table
Double-click (table header) — Rename table
Double-click (note) — Edit note text
Double-click (group header) — Rename group
Editing
Enter — Confirm/save in popovers and modals
Escape — Cancel/close popovers and modals
Tab — Navigate between fields in column and property editors