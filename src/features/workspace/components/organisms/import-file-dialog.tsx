"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { FileCode } from "lucide-react";
import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function ImportFileDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Diagram File</DialogTitle>
          <DialogDescription>
            Import from .dbml or .json formats.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="diagram-file">File</Label>
            <Input id="diagram-file" type="file" accept=".dbml,.json" />
          </div>
          <Button onClick={() => setOpen(false)}>Import</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
