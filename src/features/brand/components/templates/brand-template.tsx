import { EflowLogoIcon } from "@/shared/components/eflow-logo-icon";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import Link from "next/link";

const colorStories = [
  {
    name: "Primary",
    description:
      "The main brand action color for important buttons and anchors.",
    className: "bg-primary",
  },
  {
    name: "Secondary",
    description:
      "A quiet companion color for secondary actions and soft surfaces.",
    className: "bg-secondary",
  },
  {
    name: "Muted",
    description: "Used for calm panels, subtle sections, and supporting areas.",
    className: "bg-muted",
  },
  {
    name: "Accent",
    description:
      "A soft emphasis color for selected or highlighted interface states.",
    className: "bg-accent",
  },
  {
    name: "Destructive",
    description:
      "Reserved for errors, warnings, and actions that need extra care.",
    className: "bg-destructive",
  },
  {
    name: "Border",
    description:
      "Defines structure through dividers, outlines, and card boundaries.",
    className: "bg-border",
  },
  {
    name: "Input",
    description:
      "Supports fields and editable areas with a subtle neutral tone.",
    className: "bg-input",
  },
  {
    name: "Ring",
    description:
      "Creates focus and interaction feedback around active elements.",
    className: "bg-ring",
  },
];

export function BrandTemplate() {
  return (
    <main className="bg-background text-foreground min-h-screen overflow-hidden">
      <section className="relative border-b px-6 py-20 sm:py-28">
        <BrandBackground />
        <div className="relative mx-auto max-w-6xl">
          <nav className="mb-20 flex items-center justify-between">
            <Link className="flex items-center gap-2" href="/">
              <EflowLogoIcon className="size-7" />
              <span className="text-xl font-semibold tracking-tight">
                Eflow
              </span>
            </Link>
            <Button asChild variant="outline">
              <Link href="/">Back to site</Link>
            </Button>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-end">
            <div>
              <p className="text-muted-foreground font-mono text-xs tracking-[0.28em] uppercase">
                Brand identity
              </p>
              <h1 className="mt-6 max-w-4xl text-5xl leading-none font-medium tracking-[-0.07em] sm:text-7xl">
                A calm visual system for shaping data ideas.
              </h1>
              <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8">
                Eflow is designed to feel focused, structured, and approachable.
                The brand uses simple contrast, quiet surfaces, and
                blueprint-like visuals to make planning feel clear.
              </p>
            </div>
            <BrandMarkCard />
          </div>
        </div>
      </section>

      <BrandSection
        eyebrow="Logo"
        title="Simple enough to disappear, distinct enough to remember."
        description="The Eflow mark works as a compact signature on its own or paired with the wordmark when more context is needed."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <LogoSurface
            className="bg-background text-foreground"
            label="Light"
          />
          <LogoSurface className="bg-foreground text-background" label="Dark" />
        </div>
      </BrandSection>

      <BrandSection
        eyebrow="Color"
        title="Semantic colors for a calm product system."
        description="Eflow uses a small set of named colors so every surface, action, and state feels consistent across the product."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {colorStories.map((color) => (
            <ColorStoryCard key={color.name} {...color} />
          ))}
        </div>
      </BrandSection>

      <BrandSection
        eyebrow="Typography"
        title="Geist gives the brand its calm, modern voice."
        description="Use Geist for most communication. Geist Mono supports moments where structure matters, such as short labels, commands, or structured product examples."
      >
        <div className="grid gap-4">
          <FontCard
            name="Geist Sans"
            role="Primary typeface"
            description="Used for headlines, paragraphs, navigation, buttons, and most product communication."
            sample="Shape the model before the migration."
            className="font-sans"
            weights={["Regular", "Medium", "Semibold"]}
            usage={["Headlines", "Body copy", "Buttons", "Product UI"]}
          />

          {/* <FontCard
            name="Geist Mono"
            role="Technical typeface"
            description="Used for schema labels, snippets, commands, IDs, and structured database examples."
            sample="model.users -> relation.posts"
            className="font-mono"
            weights={["Regular", "Medium"]}
            usage={[
              "Code labels",
              "Database fields",
              "Short commands",
              "System notes",
            ]}
          /> */}
        </div>
      </BrandSection>
    </main>
  );
}

function BrandBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(110,231,183,0.16),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.10),transparent_22%)]" />
    </div>
  );
}

interface BrandSectionProps {
  readonly children: React.ReactNode;
  readonly description: string;
  readonly eyebrow: string;
  readonly title: string;
}

function BrandSection({
  children,
  description,
  eyebrow,
  title,
}: BrandSectionProps) {
  return (
    <section className="border-b px-6 py-20 last:border-b-0">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.62fr_1.38fr]">
        <div>
          <p className="text-muted-foreground font-mono text-xs tracking-[0.24em] uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-4 max-w-xl text-3xl leading-tight font-medium tracking-[-0.05em] sm:text-4xl">
            {title}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl leading-7">
            {description}
          </p>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function BrandMarkCard() {
  return (
    <Card className="border-border bg-card relative overflow-hidden p-8">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
      <div className="relative flex min-h-64 flex-col justify-between">
        <div className="flex items-center gap-3">
          <EflowLogoIcon className="size-12" />
          <span className="text-4xl font-semibold tracking-[-0.06em]">
            Eflow
          </span>
        </div>
        <p className="text-muted-foreground max-w-sm text-sm leading-6">
          The mark expresses movement through structure: simple, circular, and
          directional.
        </p>
      </div>
    </Card>
  );
}

interface LogoSurfaceProps {
  readonly className: string;
  readonly label: string;
}

function LogoSurface({ className, label }: LogoSurfaceProps) {
  return (
    <div className={`${className} rounded-3xl border p-8`}>
      <div className="flex min-h-48 flex-col justify-between">
        <div className="flex items-center gap-3">
          <EflowLogoIcon className="size-9" />
          <span className="text-2xl font-semibold tracking-[-0.05em]">
            Eflow
          </span>
        </div>
        <p className="font-mono text-xs opacity-60">{label} surface</p>
      </div>
    </div>
  );
}

interface ColorStoryCardProps {
  readonly className: string;
  readonly description: string;
  readonly name: string;
}

function ColorStoryCard({ className, description, name }: ColorStoryCardProps) {
  return (
    <Card className="border-border bg-card overflow-hidden p-0">
      <div className={`${className} h-28 border-b`} />
      <div className="p-5">
        <h3 className="font-medium">{name}</h3>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          {description}
        </p>
      </div>
    </Card>
  );
}

interface FontCardProps {
  readonly className: string;
  readonly description: string;
  readonly name: string;
  readonly role: string;
  readonly sample: string;
  readonly usage: readonly string[];
  readonly weights: readonly string[];
}

function FontCard({
  className,
  description,
  name,
  role,
  sample,
  usage,
  weights,
}: FontCardProps) {
  return (
    <Card className="border-border bg-card relative overflow-hidden p-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(110,231,183,0.12),transparent_32%)]" />

      <div className="relative border-b p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase">
              {role}
            </p>
            <h3 className="mt-3 text-2xl font-medium tracking-[-0.04em]">
              {name}
            </h3>
          </div>

          <div className="text-muted-foreground rounded-full border px-3 py-1 font-mono text-xs">
            Aa
          </div>
        </div>

        <p className="text-muted-foreground mt-4 text-sm leading-6">
          {description}
        </p>
      </div>

      <div className="relative space-y-7 p-6">
        <div>
          <p className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">
            Display sample
          </p>
          <p
            className={`${className} mt-4 text-6xl leading-none font-medium tracking-[-0.07em]`}
          >
            Aa Bb Cc
          </p>
          <p
            className={`${className} text-muted-foreground mt-4 text-base leading-7`}
          >
            {sample}
          </p>
        </div>

        <div className="bg-background/50 grid gap-3 rounded-2xl border p-4">
          <div className="flex items-baseline justify-between gap-4">
            <span className={`${className} text-4xl tracking-[-0.05em]`}>
              64
            </span>
            <span className="text-muted-foreground font-mono text-xs">
              Display / Hero
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <span className={`${className} text-2xl tracking-[-0.04em]`}>
              32
            </span>
            <span className="text-muted-foreground font-mono text-xs">
              Section title
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <span className={`${className} text-base`}>16</span>
            <span className="text-muted-foreground font-mono text-xs">
              Body text
            </span>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">
            Character set
          </p>
          <p
            className={`${className} mt-3 text-lg leading-8 tracking-[-0.03em] break-words`}
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </p>
          <p
            className={`${className} text-muted-foreground mt-1 text-lg leading-8 tracking-[-0.03em] break-words`}
          >
            abcdefghijklmnopqrstuvwxyz · 0123456789
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">
              Weights
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {weights.map((weight) => (
                <span
                  key={weight}
                  className="bg-background text-muted-foreground rounded-full border px-3 py-1 text-xs"
                >
                  {weight}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">
              Best for
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {usage.map((item) => (
                <span
                  key={item}
                  className="bg-background text-muted-foreground rounded-full border px-3 py-1 text-xs"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
