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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Copy, Globe, Lock, Mail, Send, Shield, Users } from "lucide-react";
import React from "react";

interface ShareDiagramDialogProps {
    children: React.ReactNode;
    title: string;
}

export function ShareDiagramDialog({ children, title }: ShareDiagramDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[760px] p-0 overflow-hidden border-border/60 shadow-2xl bg-card rounded-3xl">
                <div className="relative overflow-hidden">
                    {/* Background Gradients */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(500px_300px_at_30%_20%,rgba(251,146,60,0.06),transparent_60%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(400px_250px_at_70%_40%,rgba(99,102,241,0.04),transparent_60%)]" />
                    </div>

                    <div className="p-6">
                        <DialogHeader className="text-left">
                            <DialogTitle className="text-lg font-bold flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                Share "{title}"
                            </DialogTitle>
                        </DialogHeader>

                        <Tabs defaultValue="invite" className="mt-5 w-full">
                            <TabsList className="grid w-full grid-cols-2 h-10 bg-muted/40 border border-border/50 p-1 rounded-xl">
                                <TabsTrigger value="invite" className="gap-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                    <Mail className="h-4 w-4" />
                                    Invite people
                                </TabsTrigger>
                                <TabsTrigger value="link" className="gap-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                    <Shield className="h-4 w-4" />
                                    Share link
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="invite" className="mt-6 space-y-6">
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-foreground">Invite by email</h4>
                                    <div className="flex gap-2">
                                        <Input 
                                            placeholder="Enter email addresses..." 
                                            className="flex-1 h-10 rounded-xl bg-background border-border/50"
                                        />
                                        <Select defaultValue="view">
                                            <SelectTrigger className="w-[140px] h-10 rounded-xl bg-background border-border/50 font-bold text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="view">Can view</SelectItem>
                                                <SelectItem value="edit">Can edit</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button className="h-10 w-10 rounded-xl p-0 shrink-0 shadow-lg shadow-primary/10">
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-bold text-foreground">Team members</h4>
                                        <div className="flex items-center gap-2">
                                            <Button variant="secondary" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest px-3 rounded-lg">Select all</Button>
                                            <Button variant="secondary" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest px-3 rounded-lg">Clear</Button>
                                        </div>
                                    </div>

                                    <ScrollArea className="h-[200px] w-full rounded-2xl border border-border/50 bg-muted/20 p-2">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-background/50 transition-colors group cursor-pointer">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <Checkbox className="rounded-md h-4 w-4" />
                                                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-emerald-500/20 to-sky-500/20 border border-border/50 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                                                        ER
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-foreground truncate">Elden Ring</p>
                                                        <p className="text-[10px] text-muted-foreground font-medium truncate">eldenkazama78@gmail.com</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tighter rounded-lg bg-background/50 border-border/50">Owner</Badge>
                                            </div>
                                        </div>
                                    </ScrollArea>

                                    <div className="flex items-center justify-between gap-3">
                                        <Select defaultValue="view">
                                            <SelectTrigger className="w-[140px] h-9 rounded-xl bg-background border-border/50 font-bold text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="view">Can view</SelectItem>
                                                <SelectItem value="edit">Can edit</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button className="h-9 px-6 rounded-xl font-bold text-xs uppercase tracking-widest flex-1 sm:flex-none">
                                            Share with selected
                                        </Button>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border/40">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-bold text-foreground">People with access</h4>
                                        <Badge variant="secondary" className="h-5 px-2 rounded-md font-bold text-[10px]">1</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-2xl border border-border/50 bg-background/40">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-linear-to-br from-emerald-500/20 to-sky-500/20 border border-border/50 flex items-center justify-center text-[10px] font-bold text-primary">
                                                ER
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">Elden Ring</p>
                                                <p className="text-[10px] text-muted-foreground font-medium">eldenkazama78@gmail.com</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tighter rounded-lg bg-background border-border/50">Owner</Badge>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="link" className="mt-6 space-y-6">
                                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Globe className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Public Link Sharing</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed mt-1 font-medium">Anyone with the link can view this diagram. Only invited collaborators can edit.</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Input 
                                        readOnly 
                                        value={`https://eflow.io/share/${title.toLowerCase().replace(/ /g, '-')}`} 
                                        className="h-11 rounded-xl bg-background border-border/50 text-[11px] font-medium"
                                    />
                                    <Button variant="secondary" className="h-11 px-5 rounded-xl font-bold text-xs gap-2 transition-all hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20">
                                        <Copy className="h-4 w-4" />
                                        Copy
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-8 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <Lock className="h-3.5 w-3.5 text-green-500" />
                                Anyone with link can access
                            </div>
                            <Button variant="secondary" className="h-9 px-6 rounded-xl font-bold text-xs uppercase tracking-widest">
                                Done
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
