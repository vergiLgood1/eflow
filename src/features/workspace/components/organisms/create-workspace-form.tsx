"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkspaceSchema, CreateWorkspaceSchema } from "../../types/workspace.schema";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";
import { createWorkspace } from "../../applications/workspace.action";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Organism that provides a form for creating a new workspace.
 * Includes automatic slug generation based on the workspace name.
 */
export function CreateWorkspaceForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<CreateWorkspaceSchema>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const workspaceName = form.watch("name");

  // Auto-generate slug from name as the user types
  useEffect(() => {
    if (workspaceName) {
      const generatedSlug = workspaceName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [workspaceName, form]);

  const onSubmit = async (data: CreateWorkspaceSchema) => {
    setIsLoading(true);
    try {
      const result = await createWorkspace(data);
      if (result.success) {
        toast.success("Workspace created successfully!");
        // Redirect to the newly created workspace or list
        router.push("/workspaces");
      } else {
        toast.error(result.error || "Failed to create workspace. Please try again.");
      }
    } catch (error) {
      console.error("[CreateWorkspaceForm]", error);
      toast.error("An unexpected error occurred while creating the workspace.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">Workspace Name</Label>
        <Input
          id="name"
          placeholder="e.g. My Awesome Team"
          {...form.register("name")}
          disabled={isLoading}
          className="h-10"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive font-medium">{form.formState.errors.name.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="slug" className="text-sm font-medium">Workspace URL</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-muted-foreground text-sm">eflow.io/</span>
          </div>
          <Input
            id="slug"
            placeholder="my-awesome-team"
            {...form.register("slug")}
            disabled={isLoading}
            className="pl-20 h-10"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          This is your unique workspace address.
        </p>
        {form.formState.errors.slug && (
          <p className="text-sm text-destructive font-medium">{form.formState.errors.slug.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full h-10 font-semibold transition-all">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Workspace...
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </form>
  );
}
