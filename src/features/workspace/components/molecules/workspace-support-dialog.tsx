"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { LifeBuoy, Loader2 } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { WorkspaceField } from "./workspace-field";

const supportFormSchema = z.object({
  type: z.enum(["bug", "feature", "question", "billing"] as const, {
    message: "Please select a request type.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

interface WorkspaceSupportDialogProps {
  children?: React.ReactNode;
}

export function WorkspaceSupportDialog({
  children,
}: WorkspaceSupportDialogProps) {
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      subject: "",
      description: "",
    },
  });

  const onSubmit = async (data: SupportFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    toast.success("Support request sent successfully!");
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon">
            <LifeBuoy className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogDescription>
            Send us a message and we&apos;ll get back to you as soon as
            possible.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className={cn(errors.type && "text-destructive")}>
              Type
            </Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      errors.type &&
                        "border-destructive focus:ring-destructive/20",
                    )}
                  >
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Report a Bug</SelectItem>
                    <SelectItem value="feature">Request Feature</SelectItem>
                    <SelectItem value="question">General Question</SelectItem>
                    <SelectItem value="billing">Billing Issue</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-destructive text-sm font-medium">
                {errors.type.message}
              </p>
            )}
          </div>

          <WorkspaceField
            label="Subject"
            placeholder="What is it about?"
            error={errors.subject}
            {...register("subject")}
          />

          <div className="space-y-2">
            <Label className={cn(errors.description && "text-destructive")}>
              Description
            </Label>
            <Textarea
              placeholder="Tell us more details..."
              className={cn(
                "min-h-[100px] resize-none",
                errors.description &&
                  "border-destructive focus-visible:ring-destructive/20",
              )}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-destructive text-sm font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter className="bg-transparent">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
