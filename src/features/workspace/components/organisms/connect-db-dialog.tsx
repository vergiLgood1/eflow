"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Link2 } from "lucide-react";
import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function ConnectDbDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Live Database</DialogTitle>
          <DialogDescription>
            Enter your database connection string to sync schemas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="connection-string">Connection String</Label>
              <Input id="connection-string" placeholder="postgresql://user:password@localhost:5432/dbname" />
            </div>
            <Button className="w-full" onClick={() => setOpen(false)}>Connect</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
