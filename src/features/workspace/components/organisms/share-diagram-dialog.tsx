import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Copy, Globe, Lock, Mail, Send, Shield, Users } from "lucide-react";
import React from "react";

interface ShareDiagramDialogProps {
  children: React.ReactNode;
  title: string;
}

export function ShareDiagramDialog({
  children,
  title,
}: ShareDiagramDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-border/60 bg-card overflow-hidden rounded-3xl p-0 shadow-2xl sm:max-w-[760px]">
        <div className="relative overflow-hidden">
          {/* Background Gradients */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(500px_300px_at_30%_20%,rgba(251,146,60,0.06),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(400px_250px_at_70%_40%,rgba(99,102,241,0.04),transparent_60%)]" />
          </div>

          <div className="p-6">
            <DialogHeader className="text-left">
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                <Users className="text-primary h-4 w-4" />
                Share "{title}"
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="invite" className="mt-5 w-full">
              <TabsList className="bg-muted/40 border-border/50 grid h-10 w-full grid-cols-2 rounded-xl border p-1">
                <TabsTrigger
                  value="invite"
                  className="data-[state=active]:bg-background gap-2 text-xs font-bold tracking-widest uppercase data-[state=active]:shadow-sm"
                >
                  <Mail className="h-4 w-4" />
                  Invite people
                </TabsTrigger>
                <TabsTrigger
                  value="link"
                  className="data-[state=active]:bg-background gap-2 text-xs font-bold tracking-widest uppercase data-[state=active]:shadow-sm"
                >
                  <Shield className="h-4 w-4" />
                  Share link
                </TabsTrigger>
              </TabsList>

              <TabsContent value="invite" className="mt-6 space-y-6">
                <div className="space-y-3">
                  <h4 className="text-foreground text-sm font-bold">
                    Invite by email
                  </h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter email addresses..."
                      className="bg-background border-border/50 h-10 flex-1 rounded-xl"
                    />
                    <Select defaultValue="view">
                      <SelectTrigger className="bg-background border-border/50 h-10 w-[140px] rounded-xl text-xs font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="view">Can view</SelectItem>
                        <SelectItem value="edit">Can edit</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="shadow-primary/10 h-10 w-10 shrink-0 rounded-xl p-0 shadow-lg">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-foreground text-sm font-bold">
                      Team members
                    </h4>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 rounded-lg px-3 text-[10px] font-bold tracking-widest uppercase"
                      >
                        Select all
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 rounded-lg px-3 text-[10px] font-bold tracking-widest uppercase"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="border-border/50 bg-muted/20 h-[200px] w-full rounded-2xl border p-2">
                    <div className="space-y-1">
                      <div className="hover:bg-background/50 group flex cursor-pointer items-center justify-between rounded-xl p-2 transition-colors">
                        <div className="flex min-w-0 items-center gap-3">
                          <Checkbox className="h-4 w-4 rounded-md" />
                          <div className="border-border/50 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-linear-to-br from-emerald-500/20 to-sky-500/20 text-[10px] font-bold">
                            ER
                          </div>
                          <div className="min-w-0">
                            <p className="text-foreground truncate text-sm font-bold">
                              Elden Ring
                            </p>
                            <p className="text-muted-foreground truncate text-[10px] font-medium">
                              eldenkazama78@gmail.com
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-background/50 border-border/50 rounded-lg text-[10px] font-bold tracking-tighter uppercase"
                        >
                          Owner
                        </Badge>
                      </div>
                    </div>
                  </ScrollArea>

                  <div className="flex items-center justify-between gap-3">
                    <Select defaultValue="view">
                      <SelectTrigger className="bg-background border-border/50 h-9 w-[140px] rounded-xl text-xs font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="view">Can view</SelectItem>
                        <SelectItem value="edit">Can edit</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="h-9 flex-1 rounded-xl px-6 text-xs font-bold tracking-widest uppercase sm:flex-none">
                      Share with selected
                    </Button>
                  </div>
                </div>

                <div className="border-border/40 border-t pt-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-foreground text-sm font-bold">
                      People with access
                    </h4>
                    <Badge
                      variant="secondary"
                      className="h-5 rounded-md px-2 text-[10px] font-bold"
                    >
                      1
                    </Badge>
                  </div>
                  <div className="border-border/50 bg-background/40 flex items-center justify-between rounded-2xl border p-3">
                    <div className="flex items-center gap-3">
                      <div className="border-border/50 text-primary flex h-9 w-9 items-center justify-center rounded-full border bg-linear-to-br from-emerald-500/20 to-sky-500/20 text-[10px] font-bold">
                        ER
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-bold">
                          Elden Ring
                        </p>
                        <p className="text-muted-foreground text-[10px] font-medium">
                          eldenkazama78@gmail.com
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-background border-border/50 rounded-lg text-[10px] font-bold tracking-tighter uppercase"
                    >
                      Owner
                    </Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="link" className="mt-6 space-y-6">
                <div className="bg-primary/5 border-primary/10 flex items-start gap-4 rounded-2xl border p-4">
                  <div className="bg-primary/10 mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                    <Globe className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-bold">
                      Public Link Sharing
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed font-medium">
                      Anyone with the link can view this diagram. Only invited
                      collaborators can edit.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`https://eflow.io/share/${title.toLowerCase().replace(/ /g, "-")}`}
                    className="bg-background border-border/50 h-11 rounded-xl text-[11px] font-medium"
                  />
                  <Button
                    variant="secondary"
                    className="hover:bg-primary/10 hover:text-primary hover:border-primary/20 h-11 gap-2 rounded-xl border border-transparent px-5 text-xs font-bold transition-all"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <Lock className="h-3.5 w-3.5 text-green-500" />
                Anyone with link can access
              </div>
              <Button
                variant="secondary"
                className="h-9 rounded-xl px-6 text-xs font-bold tracking-widest uppercase"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
