import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { CreateWorkspaceForm } from "../organisms/create-workspace-form";

/**
 * Template for the Onboarding process.
 * Guides new users through the initial setup, starting with workspace creation.
 */
export function OnboardingTemplate() {
  return (
    <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-linear-to-b p-6">
      <div className="animate-in fade-in slide-in-from-bottom-4 w-full max-w-md space-y-8 duration-700">
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
            <span className="text-primary text-2xl font-bold">e</span>
          </div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Welcome to eflow
          </h1>
          <p className="text-muted-foreground max-w-[280px]">
            To get started, let's set up a workspace for your projects.
          </p>
        </div>

        <Card className="bg-card border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">New Workspace</CardTitle>
            <CardDescription>
              Give your workspace a name and a unique URL. You can invite your
              team later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateWorkspaceForm />
          </CardContent>
        </Card>

        <p className="text-muted-foreground text-center text-sm">
          You can always change these settings later in your workspace
          preferences.
        </p>
      </div>
    </div>
  );
}
