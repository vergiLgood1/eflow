"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Upload } from "lucide-react";
import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function ImportSqlDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import SQL File</DialogTitle>
          <DialogDescription>
            Upload a .sql file to generate your diagram automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="sql-file">SQL File</Label>
            <Input id="sql-file" type="file" accept=".sql" />
          </div>
          <Button onClick={() => setOpen(false)}>Import</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
