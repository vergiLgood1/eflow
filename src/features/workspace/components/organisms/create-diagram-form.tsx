"use client";

import { Button } from "@/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createDataModel } from "../../applications/workspace.action";
import { createDataModelSchema, CreateDataModelSchema } from "../../types/workspace.schema";
import { WorkspaceField } from "../molecules/workspace-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";

interface CreateDiagramFormProps {
  onSuccess?: () => void;
}

export function CreateDiagramForm({ onSuccess }: CreateDiagramFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const form = useForm<CreateDataModelSchema>({
    resolver: zodResolver(createDataModelSchema),
    defaultValues: {
      name: "",
      dbType: "POSTGRESQL",
    },
  });

  const onSubmit = async (data: CreateDataModelSchema) => {
    if (!slug) {
        toast.error("Workspace slug not found");
        return;
    }

    setIsLoading(true);
    try {
      const result = await createDataModel(slug, data);

      if (!result.success) {
        toast.error(result.error || "Failed to create diagram");
        return;
      }

      toast.success("Diagram created successfully!");
      onSuccess?.();
      // In a real app, we might redirect to the new diagram editor
      // router.push(`/workspaces/${slug}/diagrams/${result.data.id}`);
      router.refresh();
    } catch (err) {
      console.error("CREATE DIAGRAM ERROR:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <WorkspaceField
        id="name"
        label="Diagram Name"
        placeholder="e.g. User Management System"
        disabled={isLoading}
        error={form.formState.errors.name}
        {...form.register("name")}
      />
      
      <div className="space-y-2">
        <Label htmlFor="dbType">Database Type</Label>
        <Select
          disabled={isLoading}
          onValueChange={(value) => form.setValue("dbType", value as any, { shouldValidate: true })}
          defaultValue={form.getValues("dbType")}
        >
          <SelectTrigger id="dbType">
            <SelectValue placeholder="Select a database type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="POSTGRESQL">PostgreSQL</SelectItem>
            <SelectItem value="MYSQL">MySQL</SelectItem>
            <SelectItem value="SQLITE">SQLite</SelectItem>
            <SelectItem value="SQLSERVER">SQL Server</SelectItem>
            <SelectItem value="MONGODB">MongoDB</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.dbType && (
          <p className="text-xs font-medium text-destructive">{form.formState.errors.dbType.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full h-10 font-semibold transition-all">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Diagram...
          </>
        ) : (
          "Create Diagram"
        )}
      </Button>
    </form>
  );
}
