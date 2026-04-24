"use client";

import { Button } from "@/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createWorkspace } from "../../applications/workspace.action";
import { createWorkspaceSchema, CreateWorkspaceSchema } from "../../types/workspace.schema";
import { WorkspaceField } from "../molecules/workspace-field";

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

      if (!result.success) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }

      toast.success("Workspace created successfully!");
      router.push(`/workspaces/${result.data?.slug || data.slug}`);
    } catch (err) {
      console.error("CREATE WORKSPACE ERROR:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <WorkspaceField
        id="name"
        label="Workspace Name"
        placeholder="e.g. My Awesome Team"
        disabled={isLoading}
        error={form.formState.errors.name}
        {...form.register("name")}
      />
      
      <WorkspaceField
        id="slug"
        label="Workspace URL"
        placeholder="my-awesome-team"
        disabled={isLoading}
        error={form.formState.errors.slug}
        description="This is your unique workspace address."
        leftElement={<span className="text-muted-foreground text-sm">eflow.io/</span>}
        {...form.register("slug")}
      />

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
