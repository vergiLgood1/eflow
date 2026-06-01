import { EflowLogoIcon } from "@/shared/components/eflow-logo-icon";
import Link from "next/link";

const schemaTables = [
  { name: "users", rows: ["id uuid", "email text", "role enum"] },
  { name: "projects", rows: ["id uuid", "owner_id uuid", "name text"] },
  { name: "tasks", rows: ["id uuid", "project_id uuid", "status text"] },
];

const capabilities = ["Visual ERD", "SQL import/export", "Checkpoints"];

export function AuthBrandPanel() {
  return (
    <aside className="bg-muted hidden overflow-hidden p-12 lg:relative lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_34%),radial-gradient(circle_at_75%_72%,rgba(16,185,129,0.18),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30" />
      <div className="from-background/80 absolute inset-0 bg-linear-to-t via-transparent to-black/30" />

      <div className="relative z-10 flex items-center gap-2 text-white/90">
        <div className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-sm">
          <EflowLogoIcon className="size-4" />
        </div>
        <span className="text-sm font-medium">Schema planning workspace</span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/25 p-5 shadow-2xl backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex gap-2">
              <span className="size-2.5 rounded-full bg-red-400/70" />
              <span className="size-2.5 rounded-full bg-yellow-400/70" />
              <span className="size-2.5 rounded-full bg-emerald-400/70" />
            </div>
            <span className="font-mono text-[10px] text-white/35">
              launch_model.eflow
            </span>
          </div>

          <div className="relative h-80 overflow-hidden rounded-2xl border border-white/10 bg-black/25">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-50" />

            <SchemaNode
              className="absolute top-8 left-8"
              name={schemaTables[0].name}
              rows={schemaTables[0].rows}
            />
            <SchemaNode
              className="absolute top-6 right-8"
              name={schemaTables[1].name}
              rows={schemaTables[1].rows}
            />
            <SchemaNode
              className="absolute bottom-9 left-20"
              name={schemaTables[2].name}
              rows={schemaTables[2].rows}
            />

            <div className="bg-background/85 absolute right-6 bottom-6 w-44 rounded-xl border border-white/10 p-3 shadow-xl">
              <p className="text-primary font-mono text-[10px]">DBML</p>
              <div className="mt-2 space-y-1 font-mono text-[10px] text-white/45">
                <p>Table projects &#123;</p>
                <p className="pl-3">id uuid [pk]</p>
                <p className="pl-3">owner_id uuid</p>
                <p>&#125;</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {capabilities.map((capability) => (
              <div
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-[11px] text-white/65"
                key={capability}
              >
                {capability}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 space-y-4">
        <h2 className="max-w-xl text-4xl leading-tight font-bold tracking-tight text-white">
          Plan database changes before they become migrations.
        </h2>
        <p className="max-w-md text-lg text-white/60">
          Sketch tables, review relationships, inspect DBML, and save
          checkpoints in one focused workspace.
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-4 text-xs text-white/40">
        <span>&copy; 2026 EFlow Inc.</span>
        <span>&bull;</span>
        <Link className="transition-colors hover:text-white" href="#">
          Privacy
        </Link>
        <span>&bull;</span>
        <Link className="transition-colors hover:text-white" href="#">
          Terms
        </Link>
      </div>
    </aside>
  );
}

interface SchemaNodeProps {
  readonly className?: string;
  readonly name: string;
  readonly rows: readonly string[];
}

function SchemaNode({ className = "", name, rows }: SchemaNodeProps) {
  return (
    <div
      className={`bg-background/90 w-36 rounded-xl border border-white/10 p-3 shadow-2xl ${className}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-xs text-white">{name}</p>
        <span className="bg-primary size-1.5 rounded-full" />
      </div>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div className="flex items-center gap-2" key={row}>
            <span className="size-1 rounded-full bg-white/25" />
            <span className="font-mono text-[10px] text-white/45">{row}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
