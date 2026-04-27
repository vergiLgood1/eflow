import { togglePinDataModel } from "@/features/workspace/applications/workspace.action";
import { Button } from "@/shared/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { Ellipsis, Globe, Pencil, Star, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { ShareDiagramDialog } from "../organisms/share-diagram-dialog";

interface WorkspaceDiagramCardProps {
    id: string;
    title: string;
    workspaceName: string;
    workspaceSlug: string;
    dbType: string;
    updatedAt: string;
    isPublic?: boolean;
    isPinned?: boolean; // Changed from isStarred
    className?: string;
}

export function WorkspaceDiagramCard({
    id,
    title,
    workspaceName,
    workspaceSlug,
    dbType,
    updatedAt,
    isPublic = true,
    isPinned: initialIsPinned = false,
    className,
}: WorkspaceDiagramCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/workspaces/${workspaceSlug}/model/${id}`);
    }

    const handleStar = async (e: React.MouseEvent) => {
        e.stopPropagation();

        const response = await togglePinDataModel(id);
        if (response.success) {
            router.refresh();
        } else {
            toast.error("Failed to update pin status");
        }
    };

    const handleAction = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className={cn(
                "group bg-card/50 border border-border rounded-xl overflow-hidden hover:border-border/80 transition-all hover:shadow-lg hover:shadow-black/20 text-left cursor-pointer flex flex-col",
                className
            )}
            onClick={handleClick}
            role="button"
            tabIndex={0}
        >
            <div
                className="h-32 relative bg-background bg-[radial-gradient(circle,rgba(63,63,70,0.1)_1px,transparent_1px)] bg-size-[12px_12px]"
            >
                {/* Visual Preview Placeholder */}
                <div className="absolute inset-4 flex items-center justify-center gap-2 opacity-30 group-hover:opacity-50 transition-opacity">
                    <div className="w-16 h-12 bg-muted border border-border rounded border-t-primary border-t-[3px]" />
                    <div className="w-16 h-10 bg-muted border border-border rounded border-t-primary border-t-[3px]" />
                </div>
                
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "absolute top-2 right-2 h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity",
                        initialIsPinned && "opacity-100 text-yellow-500"
                    )}
                    onClick={handleStar}
                >
                    <Star className={cn("h-4 w-4", initialIsPinned && "fill-current")} />
                </Button>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2 text-[11px]">
                    <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-muted-foreground truncate uppercase tracking-wider font-semibold">
                        {workspaceName}
                    </span>
                    {isPublic ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium ml-auto shrink-0">
                            <Globe className="h-2.5 w-2.5" />
                            Public
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted border border-border text-muted-foreground font-medium ml-auto shrink-0">
                            Private
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-foreground truncate flex-1">
                        {title}
                    </h3>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleAction}>
                        <ShareDiagramDialog title={title}>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-muted/50">
                                <Users className="h-3.5 w-3.5" />
                            </Button>
                        </ShareDiagramDialog>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-muted/50">
                                    <Ellipsis className="h-3.5 w-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl border-border/60">
                                <DropdownMenuItem className="gap-2 rounded-lg py-2 cursor-pointer font-medium">
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2 rounded-lg py-2 cursor-pointer font-medium text-destructive focus:text-destructive focus:bg-destructive/10">
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                    <span>{dbType}</span>
                    <span>{updatedAt}</span>
                </div>
            </div>
        </div>
    );
}
