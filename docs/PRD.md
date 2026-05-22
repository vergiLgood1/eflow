# Product Requirements Document (PRD): EFlow

## 1. Project Overview

EFlow (Enterprise Flow) is a modern, web-based visual database design and workflow management platform. It allows users to design, visualize, and manage complex database schemas across multiple database types (PostgreSQL, MySQL, Oracle, SQL Server, SQLite) with real-time collaboration and AI-assisted tools.

## 2. Technical Stack

This project uses a cutting-edge, futuristic tech stack. Agents MUST strictly adhere to these versions and patterns.

- **Framework**: [Next.js 16.2.4](https://nextjs.org/) (App Router)
- **Library**: [React 19.2.4](https://react.dev/)
- **Styling**: [Tailwind CSS 4.0.0](https://tailwindcss.com/) with PostCSS 4
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/), [Base UI](https://base-ui.com/react/), [Vaul](https://vaul.emilkowal.ski/) (Drawers)
- **Utilities**: `class-variance-authority`, `clsx`, `tailwind-merge`
- **Animations**: `tw-animate-css`
- **Database**: [Neon Postgres](https://neon.tech/) (Serverless)
- **ORM**: [Prisma 7.8.0](https://www.prisma.io/)
  - **Adapter**: `@prisma/adapter-neon`
  - **Pattern**: Singleton client in `src/db/prisma.ts`
- **Authentication**: [Neon Auth](https://neon.tech/docs/guides/neon-auth) (Managed)
- **Real-time Sync**: [Yjs](https://yjs.dev/) / CRDTs for collaborative editing
- **Validation**: [Zod](https://zod.dev/)
- **Runtime**: [Bun](https://bun.sh/) (Mandatory for all scripts)

## 3. Core Features

### 3.1 Visual Schema Editor

- **Canvas-based Interface**: Infinite canvas for designing ER diagrams.
- **Table Management**: Create/Edit/Delete tables and columns with database-specific types.
- **Relationships**: Visualizing foreign keys with cardinality notation (Crow's foot).
- **Organizational Tools**: Groups (colored containers) and Notes (annotations).
- **Multiple Diagrams**: Different views of the same underlying schema.

### 3.2 Database Engine Support

- Native support for **PostgreSQL, MySQL, Oracle, SQL Server, and SQLite**.
- Automatic type mapping when switching between database types.

### 3.3 Advanced Database Objects

- **Views**: SQL-based virtual tables with AI-assisted generation.
- **Triggers**: Table-level automated actions.
- **Stored Procedures**: Full modeling of procedures with parameters and version history.

### 3.4 Collaboration & Versioning

- **Real-time Sync**: Multi-user editing with live cursors and presence.
- **Checkpoints**: Point-in-time schema snapshots.
- **Migrations**: Automated diffing and SQL migration generation.
- **Version History**: Per-object history for Views, Triggers, and Procedures.

### 3.5 AI Integration

- **Natural Language to SQL**: Generating views and procedures from prompts.
- **Schema Suggestions**: AI-driven architectural improvements.

## 4. Project Structure (Atomic Design + Feature-Based)

Follow the structure defined in `AGENTS.md` and `PRD.md`:

```
src/
├── app/               # Next.js App Router
├── shared/            # Reusable cross-feature code
│   ├── components/    # Common UI components (shadcn)
│   ├── hooks/
│   ├── lib/
│   └── ...
├── features/          # Encapsulated business logic
│   ├── authentication/
│   ├── canvas/
│   ├── schema-editor/
│   └── ...
└── db/                # Database and ORM configuration
```

## 5. Agent Instructions & Rules

1. **Strict Type Safety**: Never use `any`. Use `unknown` and type guards.
2. **Issue-First Workflow**: Create a GitHub issue for every task before starting.
3. **Prisma 7 Patterns**: Connection URLs MUST live in `prisma.config.ts`, not `schema.prisma`. Use the Neon adapter in the Prisma client.
4. **Auth Patterns**: Use `@neondatabase/auth` for all authentication logic. Middleware must use `auth.middleware(req)`.
5. **Component Standards**: Use Shadcn UI. Avoid custom components if a Shadcn version exists.
6. **File Limits**: Functions ≤ 40 lines, Files ≤ 300 lines.

## 6. Success Metrics

- Seamless real-time sync without conflicts.
- Accurate migration generation between checkpoints.
- Zero-latency feel on the canvas with >100 tables.
- High-fidelity UI following modern enterprise aesthetics.
