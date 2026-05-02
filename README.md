# Eflow: Professional Entity Relationship Modeler

Eflow is a high-fidelity, web-native Entity Relationship Diagram (ERD) modeling platform designed for database architects who demand precision, speed, and aesthetics. Built with Next.js and React Flow, it bridges the gap between complex enterprise tools and intuitive browser-based design.

## 📄 Project Summary
Eflow provides a sophisticated workspace for designing, visualizing, and exporting database schemas. It features a smart relationship engine that automates the tedious parts of modeling—like Foreign Key assignment and cardinality notation—while maintaining a premium, responsive user interface.

## ⚠️ The Problem
Traditional browser-based ERD tools often suffer from:
- **Fragile Relationship Logic**: Most tools assign FKs based on the order of user clicks (Source -> Target), which often contradicts actual database dependency rules.
- **Visual State Loss**: Canvas objects like "Groups" often lose their dimensions or nested child nodes upon page refresh.
- **Rendering Race Conditions**: Dynamic addition of columns and relationships often leads to "Missing Handle" errors in React Flow because the UI hasn't finished mounting the handles when the edge is created.

## 🎯 Project Goals
- **Smart Dependency Engine**: Automate FK assignments based on semantic naming and existing schema structure rather than interaction order.
- **Deep Persistence**: Ensure every visual detail—from group dimensions to nesting hierarchy—is preserved across reloads.
- **High-Fidelity Aesthetics**: Deliver a premium UX that follows modern design systems (Shadcn UI, Radix) and provides immediate visual feedback.
- **Seamless Integration**: Support for DBML and SQL imports to allow architects to bring existing schemas to life instantly.

## 🛠 Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Canvas Engine**: [React Flow / XYFlow](https://reactflow.dev/)
- **Database / ORM**: PostgreSQL (Neon) & Prisma
- **Styling**: Tailwind CSS & Vanilla CSS for premium micro-animations
- **UI Components**: Shadcn UI & Radix UI
- **State Management**: Zustand

## 🚀 Development Process
1. **Relational Engine Refactor**: We moved away from simple connection events to a centralized `detectRelationshipDependency` algorithm. This "brain" analyzes table names and column patterns to ensure the "Many" side always holds the Foreign Key.
2. **Schema-First Persistence**: Updated the database schema to support recursive `parentId` relations, enabling stable node nesting within Group nodes.
3. **Atomic Component Design**: Built the UI using a feature-based atomic structure, separating atoms (Relationship Markers) from organisms (Table Nodes, Group Nodes).
4. **Synchronization Layer**: Implemented a custom debounced sync hook that captures canvas changes and persists them to the PostgreSQL backend without impacting UI performance.

## 🧠 Key Challenges & Solutions
- **The "Handle 008" Error**: Encountered race conditions where edges were created before React Flow handles were rendered. **Solution**: Implemented a deferred state update strategy to ensure DOM readiness before edge instantiation.
- **Group Clipping**: Resizer handles were being cut off by parent containers. **Solution**: Refactored the `GroupNodeComponent` to remove restrictive `ovEflow-hidden` properties and standardized on the React Flow `NodeResizer`.
- **TypeScript Nullability**: Managing `string | undefined` vs `string | null` in React Flow's strict handle system. **Solution**: Enforced a `nullish coalescing` strategy in the canvas store to maintain runtime stability.

## ✨ Final Result
A robust, industry-standard modeling environment where:
- **Relationships just work**: Connecting `users` to `posts` automatically places `user_id` in the `posts` table with the correct cardinality.
- **Groups are stable**: Complex organizational groups maintain their size and containment across sessions.
- **UX is premium**: Smooth transitions, clear iconography, and a responsive layout that scales with complex schemas.

## 🎓 Lessons Learned
- **Architecture over Event-Handling**: Designing a declarative relationship engine is significantly more scalable than handling individual click events.
- **Schema Integrity**: In canvas applications, the database schema must strictly reflect the visual hierarchy (e.g., `parentId`) to ensure the "Source of Truth" remains consistent between the DB and the DOM.
- **Atomic Thinking**: Even in complex canvases, keeping components atomic (e.g., separating the Entity Action Box from the Table Card) makes debugging and styling significantly easier.

---

## 🛠 Getting Started

### Prerequisites
- [Bun](https://bun.sh) (Recommended) or Node.js
- PostgreSQL instance (Neon.tech recommended)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Run Prisma migrations:
   ```bash
   bunx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   bun --bun next dev
   ```

### 🧪 Quality Standards
Follow the rules in `.agents/rules/*.md` for code quality, naming conventions, and project structure. Always ensure TypeScript strict mode is satisfied.
