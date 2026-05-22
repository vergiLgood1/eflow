"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Plus } from "lucide-react";
import React from "react";
import { CreateDiagramForm } from "./create-diagram-form";

interface CreateDiagramDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateDiagramDialog({
  children,
  open,
  onOpenChange,
}: CreateDiagramDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Diagram</DialogTitle>
          <DialogDescription>
            Give your diagram a name and select the database type to get
            started.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <CreateDiagramForm onSuccess={() => setIsOpen?.(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
