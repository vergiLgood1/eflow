import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/shared/components/ui/card";
import { CreateWorkspaceForm } from "../organisms/create-workspace-form";

/**
 * Template for the Onboarding process.
 * Guides new users through the initial setup, starting with workspace creation.
 */
export function OnboardingTemplate() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted/20 p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-2xl font-bold">e</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to eflow</h1>
          <p className="text-muted-foreground max-w-[280px]">
            To get started, let's set up a workspace for your projects.
          </p>
        </div>
        
        <Card className="border-none shadow-2xl bg-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold">New Workspace</CardTitle>
            <CardDescription>
              Give your workspace a name and a unique URL. You can invite your team later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateWorkspaceForm />
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground">
          You can always change these settings later in your workspace preferences.
        </p>
      </div>
    </div>
  );
}
