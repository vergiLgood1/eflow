"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createDataModel } from "../../applications/workspace.action";
import { createDataModelSchema, CreateDataModelSchema } from "../../types/workspace.schema";
import { WorkspaceField } from "../molecules/workspace-field";
import { WorkspaceTextareaField } from "../molecules/workspace-textarea-field";

interface CreateDiagramFormProps {
  onSuccess?: () => void;
}

export function CreateDiagramForm({ onSuccess }: CreateDiagramFormProps) {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [tagInput, setTagInput] = useState("");

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<CreateDataModelSchema>({
    resolver: zodResolver(createDataModelSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
      dbType: "POSTGRESQL",
    },
  });

  const tags = watch("tags") || [];

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();

      if (!newTag) return;

      if (tags.length >= 10) {
        toast.error("Maksimal 10 tag");
        return;
      }

      if (tags.includes(newTag)) {
        toast.error("Tag sudah ada");
        return;
      }

      if (newTag.length > 30) {
        toast.error("Tag maksimal 30 karakter");
        return;
      }

      setValue("tags", [...tags, newTag], { shouldValidate: true });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tagToRemove),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: CreateDataModelSchema) => {
    if (!slug) {
      toast.error("Workspace slug not found");
      return;
    }

    try {
      const result = await createDataModel(slug, data);

      if (!result.success) {
        toast.error(result.error || "Failed to create diagram");
        return;
      }

      toast.success("Diagram created successfully!");
      onSuccess?.();
      router.push(`/workspaces/${slug}/model/${result.data.id}`);
    } catch (err) {
      console.error("CREATE DIAGRAM ERROR:", err);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <WorkspaceField
        id="name"
        label="Diagram Name"
        placeholder="e.g. User Management System"
        disabled={isSubmitting}
        error={errors.name}
        {...register("name")}
      />

      <WorkspaceTextareaField
        id="description"
        label="Description"
        placeholder="Brief description of your diagram..."
        disabled={isSubmitting}
        rows={2}
        error={errors.description}
        {...register("description")}
      />

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="Type a tag and press Enter..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          disabled={isSubmitting}
          className="h-10"
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                size="lg"
                className="flex items-center gap-1 bg-secondary/50 hover:bg-secondary pr-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag}</span>
                </button>
              </Badge>
            ))}
          </div>
        )}
        {errors.tags && (
          <p className="text-xs font-medium text-destructive">
            {errors.tags.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dbType">Database Type</Label>
        <Select
          disabled={isSubmitting}
          onValueChange={(value) =>
            setValue("dbType", value as CreateDataModelSchema["dbType"], {
              shouldValidate: true,
            })
          }
          defaultValue={getValues("dbType")}
        >
          <SelectTrigger id="dbType" className="flex w-full h-10">
            <SelectValue placeholder="Select a database type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="POSTGRESQL">PostgreSQL</SelectItem>
            <SelectItem value="MYSQL">MySQL</SelectItem>
            <SelectItem value="ORACLE">Oracle</SelectItem>
            <SelectItem value="SQLSERVER">SQL Server</SelectItem>
            <SelectItem value="SQLITE">SQLite</SelectItem>
          </SelectContent>
        </Select>
        {errors.dbType && (
          <p className="text-xs font-medium text-destructive">
            {errors.dbType.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-10 font-semibold transition-all"
      >
        {isSubmitting ? (
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
