<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


<!-- BEGIN:bun-rules-runtime -->
Always use bun to run scripts. Example: `bun --bun next dev` instead of `npm run dev`.
<!-- END:bun-rules-runtime -->

<!-- BEGIN:user-rules -->
Always read the rules from `.agents/rules/*.md` before doing any action.
<!-- END:user-rules -->

<!-- BEGIN:project-structure -->
use feature-based folder structure with atomic design for spesific feature

example:
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── shared/
│   ├── components/ # no need atomic for shared components
│   │   ├── ui/
│   │   └── ...
│   ├── hooks/
│   ├── lib/
│   └── ...
├── features/
│   ├── authentication/
│   │   ├── components/
│   │   │   ├── atoms/
│   │   │   ├── molecules/
│   │   │   ├── organisms/
│   │   │   └── templates/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── types/
│   │   ├── applications/ # here you can use layered architecture (controller.ts, service.ts, repository.ts, model.[name].ts)
│   │   └── ...
│   └── ...
└── ...

<!-- END:project-structure -->

<!-- BEGIN:shadcn-rules -->
Always use shadcn ui with tailwind css components. 
- Avoid custom component if there is a shadcn ui component that can be used.
- if the shadcn ui component can't fulfill the requirements, create a new component in the shared/components/ui or in the feature spesific components folder following the shadcn ui naming convention. only create atomic component if spesific feature.
<!-- END:shadcn-rules -->

<!-- BEGIN:zod -->
zod is the main validation library in this project. use it for form validation and data validation. if needed use @felte/zod for form integration. create zod schema for each feature or use zod-prisma to generate zod schema from prisma schema.
<!-- END:zod -->    