import { useTableActions } from "@/features/model/hooks/use-table-actions";
import { useCanvasStore } from "@/features/model/store/use-canvas-store";
import { ColumnData, TableNodeData } from "@/features/model/types/canvas";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogTrigger } from "@/shared/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import {
  Handle,
  NodeProps,
  Position,
  useUpdateNodeInternals,
} from "@xyflow/react";
import {
  Database,
  Link2,
  Pencil,
  Plus,
  Table2,
  Trash2,
  Zap,
} from "lucide-react";
import { memo, useEffect, useState } from "react";
import { EntityActionsBox } from "./entity-actions-box";
import { ColumnConfigPopover } from "./entity-actions-box/add-column-popover";
import { FKConfigPopover } from "./entity-actions-box/fk-config-popover";
import { IDXConfigPopover } from "./entity-actions-box/idx-config-popover";
import { InsertDataDialog } from "./entity-actions-box/insert-data-dialog";
import { PropertiesPopover } from "./entity-actions-box/properties-popover";
import { TRGConfigDialog } from "./entity-actions-box/trg-config-dialog";

// --- Subcomponents ---

const NODE_POSITIONS = [
  Position.Top,
  Position.Right,
  Position.Bottom,
  Position.Left,
];

const NodeHandles = () => (
  <>
    {NODE_POSITIONS.flatMap((pos) => [
      <Handle
        key={`s-${pos}`}
        type="source"
        position={pos}
        id={`source-${pos}`}
        className="h-1 w-1 opacity-0"
      />,
      <Handle
        key={`t-${pos}`}
        type="target"
        position={pos}
        id={`target-${pos}`}
        className="h-1 w-1 opacity-0"
      />,
    ])}
  </>
);

const ActionButton = ({
  icon,
  tooltip,
  children,
  destructive,
}: {
  icon: React.ReactNode;
  tooltip: string;
  children?: React.ReactNode;
  destructive?: boolean;
}) => {
  const btn = (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-5 w-5",
        destructive && "hover:bg-destructive/10 hover:text-destructive",
      )}
    >
      {icon}
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children ? (
          <Popover>
            <PopoverTrigger asChild>{btn}</PopoverTrigger>
            <PopoverContent
              className="border-border/50 w-[450px] shadow-xl"
              side="right"
              align="start"
            >
              {children}
            </PopoverContent>
          </Popover>
        ) : (
          btn
        )}
      </TooltipTrigger>
      <TooltipContent className="px-2 py-1 text-[10px]">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};

const ColumnRow = ({
  nodeId,
  column,
}: {
  nodeId: string;
  column: ColumnData;
}) => {
  const { removeColumn } = useTableActions();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <div className="group/col hover:bg-foreground/5 flex cursor-pointer items-center gap-2 px-2.5 py-1 text-xs transition">
      {/* Icon */}
      <span className="flex h-4 w-4 items-center justify-center">
        {column.isPk && (
          <span className="text-primary text-[10px] font-bold">PK</span>
        )}
        {column.isFk && <Link2 className="text-muted-foreground h-3 w-3" />}
      </span>

      {/* Name */}
      <span className="flex-1 truncate text-[13px] font-medium">
        {column.name}
      </span>

      {/* Type */}
      <span className="text-muted-foreground font-mono text-[11px] transition group-hover/col:opacity-0">
        {column.type}
      </span>

      {/* Actions */}
      <div className="absolute right-2 flex gap-1 opacity-0 transition group-hover/col:opacity-100">
        <ActionButton
          icon={<Pencil className="h-3 w-3" />}
          tooltip="Edit column"
        >
          <ColumnConfigPopover
            nodeId={nodeId}
            column={column}
            onClose={() => {}}
          />
        </ActionButton>

        {column.isFk ? (
          <Popover open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-destructive/10 hover:text-destructive h-5 w-5"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="border-border/50 w-56 p-3 shadow-xl"
              side="right"
              align="center"
              sideOffset={10}
            >
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-destructive flex items-center gap-2 text-[12px] font-semibold">
                    <Trash2 className="h-3 w-3" /> Confirm Delete
                  </p>
                  <p className="text-muted-foreground text-[10px] leading-snug">
                    Deleting this FK column will also remove its relationship.
                  </p>
                </div>
                <div className="border-border/20 flex justify-end gap-2 border-t pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[10px]"
                    onClick={() => setIsConfirmOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-6 px-2 text-[10px]"
                    onClick={() => {
                      removeColumn(nodeId, column.id);
                      setIsConfirmOpen(false);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-destructive/10 hover:text-destructive h-5 w-5"
                onClick={(e) => {
                  e.stopPropagation();
                  removeColumn(nodeId, column.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-[10px]">
              Delete column
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${column.id}-source`}
        className="h-1 w-1 opacity-0"
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`${column.id}-target`}
        className="h-1 w-1 opacity-0"
      />
    </div>
  );
};

type FooterTab = "fk" | "idx" | "trg";

const FOOTER_TABS = [
  { id: "fk", label: "FK", icon: Link2, title: "Foreign keys" },
  { id: "idx", label: "IDX", icon: Database, title: "Indexes" },
  { id: "trg", label: "TRG", icon: Zap, title: "Triggers" },
] as const;

const TableFooter = ({
  nodeId,
  data,
}: {
  nodeId: string;
  data: TableNodeData;
}) => {
  const [activeTab, setActiveTab] = useState<FooterTab | null>(null);
  const [isTrgDialogOpen, setIsTrgDialogOpen] = useState(false);
  const [isFkPopoverOpen, setIsFkPopoverOpen] = useState(false);
  const [isIdxPopoverOpen, setIsIdxPopoverOpen] = useState(false);
  const edges = useCanvasStore((s) => s.edges);
  const nodes = useCanvasStore((s) => s.nodes);
  const removeNode = useCanvasStore((s) => s.removeNode);

  const activeTabData = FOOTER_TABS.find((tab) => tab.id === activeTab);

  // Get FK edges for this table
  const fkEdges = edges.filter(
    (e) => e.source === nodeId || e.target === nodeId,
  );
  const indexes = data.indexes || [];

  const handleTabClick = (tabId: FooterTab) => {
    setActiveTab((prev) => (prev === tabId ? null : tabId));
  };

  return (
    <div className="border-border/50 bg-foreground/5 flex w-full flex-col overflow-hidden rounded-b-[6px] border-t transition-all duration-300 ease-in-out">
      {/* Tabs Header */}
      <div className="bg-background/5 border-border/10 flex h-9 items-center justify-between gap-1 border-b px-2">
        {FOOTER_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "h-7 gap-1.5 px-2 text-[10px] font-bold transition-all duration-200",
                isActive
                  ? "bg-foreground/20 text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
              )}
            >
              <Icon className="h-3 w-3 opacity-80" /> {tab.label}
            </Button>
          );
        })}

        {activeTab && (
          <div className="flex items-center">
            {activeTab === "trg" ? (
              <Dialog open={isTrgDialogOpen} onOpenChange={setIsTrgDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="animate-in fade-in zoom-in h-7 w-7 text-emerald-500 transition-colors duration-200 hover:bg-emerald-500/10 hover:text-emerald-400"
                    title={`Add ${activeTabData?.label}`}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <TRGConfigDialog
                  nodeId={nodeId}
                  onClose={() => setIsTrgDialogOpen(false)}
                />
              </Dialog>
            ) : (
              <Popover
                open={activeTab === "fk" ? isFkPopoverOpen : isIdxPopoverOpen}
                onOpenChange={
                  activeTab === "fk" ? setIsFkPopoverOpen : setIsIdxPopoverOpen
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="animate-in fade-in zoom-in h-7 w-7 text-emerald-500 transition-colors duration-200 hover:bg-emerald-500/10 hover:text-emerald-400"
                    title={`Add ${activeTabData?.label}`}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="border-border/50 w-[400px] shadow-2xl"
                  side="top"
                  align="end"
                  sideOffset={10}
                >
                  {activeTab === "fk" ? (
                    <FKConfigPopover
                      nodeId={nodeId}
                      onClose={() => setIsFkPopoverOpen(false)}
                    />
                  ) : (
                    <IDXConfigPopover
                      nodeId={nodeId}
                      onClose={() => setIsIdxPopoverOpen(false)}
                    />
                  )}
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}
      </div>

      {/* Collapsible Content Area (In-flow) */}
      <div
        className={cn(
          "bg-background/20 overflow-hidden transition-all duration-300 ease-in-out",
          activeTab
            ? "border-border/20 max-h-[200px] border-t opacity-100"
            : "pointer-events-none max-h-0 border-t-0 opacity-0",
        )}
      >
        <div className="text-muted-foreground px-3 py-2.5 text-[10px] font-bold tracking-widest uppercase opacity-80">
          {activeTabData?.title}
        </div>
        <div className="px-1 pb-3">
          {activeTab === "fk" &&
            (fkEdges.length > 0 ? (
              <div className="mx-1 space-y-1">
                {fkEdges.map((edge) => {
                  const isSource = edge.source === nodeId;
                  const otherNodeId = isSource ? edge.target : edge.source;
                  const otherNode = nodes.find((n) => n.id === otherNodeId);
                  const otherName =
                    (otherNode?.data as TableNodeData)?.name || otherNodeId;
                  const fkData = edge.data as
                    | Record<string, unknown>
                    | undefined;
                  const fkName = fkData?.fkName as string | undefined;
                  const cardinality = (fkData?.cardinality as string) || "1:n";

                  return (
                    <div
                      key={edge.id}
                      className="border-border/40 bg-foreground/2 group/fk flex items-center gap-2 rounded border px-2 py-1.5 text-[11px]"
                    >
                      <Link2 className="text-muted-foreground h-3 w-3 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-foreground/90 truncate font-medium">
                            {otherName}
                          </span>
                          <span
                            className={cn(
                              "shrink-0 rounded-sm border px-1 text-[8px] leading-3 font-bold",
                              isSource
                                ? "border-blue-500/20 bg-blue-500/10 text-blue-500"
                                : "border-purple-500/20 bg-purple-500/10 text-purple-500",
                            )}
                          >
                            {isSource ? "REF" : "BY"}
                          </span>
                        </div>
                        {fkName && (
                          <div className="text-muted-foreground/60 mt-0.5 truncate text-[9px] italic">
                            via {fkName}
                          </div>
                        )}
                      </div>
                      <span className="text-muted-foreground bg-foreground/5 ml-auto shrink-0 rounded px-1 font-mono text-[9px]">
                        {cardinality}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-muted-foreground border-border/40 bg-foreground/2 mx-1 rounded border border-dashed px-2 py-3 text-[11px] italic">
                No foreign keys yet.
              </div>
            ))}
          {activeTab === "idx" &&
            (indexes.length > 0 ? (
              <div className="mx-1 space-y-1">
                {indexes.map((idx) => (
                  <div
                    key={idx.id}
                    className="border-border/40 bg-foreground/2 flex items-center gap-2 rounded border px-2 py-1.5 text-[11px]"
                  >
                    <Database className="text-muted-foreground h-3 w-3 shrink-0" />
                    <span className="truncate font-medium">{idx.name}</span>
                    <span className="text-muted-foreground ml-auto text-[9px]">
                      {idx.isUnique ? "UNIQUE" : ""}{" "}
                      {idx.type?.toUpperCase() || "BTREE"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground border-border/40 bg-foreground/2 mx-1 rounded border border-dashed px-2 py-3 text-[11px] italic">
                No indexes yet.
              </div>
            ))}
          {activeTab === "trg" && (
            <div className="text-muted-foreground border-border/40 bg-foreground/2 mx-1 rounded border border-dashed px-2 py-3 text-[11px] italic">
              No triggers yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Node Component ---
export const TableNodeComponent = memo(function TableNodeComponent({
  id,
  data: rawData,
  selected,
}: NodeProps) {
  const data = rawData as TableNodeData;
  const { updateNodeData } = useCanvasStore();
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(
    data.isEditing ?? false,
  );
  const updateNodeInternals = useUpdateNodeInternals();

  // Trigger handle recalculation when columns change
  useEffect(() => {
    updateNodeInternals(id);
  }, [
    data.columns?.length,
    (data.hiddenColumns as string[] | undefined)?.length,
    id,
    updateNodeInternals,
  ]);

  // Clear the flag after picking it up
  useEffect(() => {
    if (data.isEditing) {
      updateNodeData(id, { isEditing: false, isNew: false });
    }
  }, [data.isEditing, id, updateNodeData]);

  const [isDataOpen, setIsDataOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "group/node bg-card relative flex min-h-52 w-[240px] flex-col rounded-md border text-[12px]",
          selected
            ? "border-primary shadow-[0_0_20px_hsl(var(--primary)/0.15),0_4px_20px_hsl(var(--foreground)/0.12)]"
            : "border-border shadow-md",
        )}
      >
        {/* Actions */}
        {selected && <EntityActionsBox nodeId={id} data={data} />}

        {/* Header */}
        <Popover open={isPropertiesOpen} onOpenChange={setIsPropertiesOpen}>
          <div
            className="text-primary-foreground border-border/40 bg-primary flex h-9 cursor-pointer items-center gap-2 rounded-t-md border-b px-3 font-bold"
            style={data.color ? { backgroundColor: data.color } : undefined}
            onDoubleClick={() => setIsPropertiesOpen(true)}
          >
            {/* Table2 icon opens the Insert / View Data dialog */}
            <Dialog open={isDataOpen} onOpenChange={setIsDataOpen}>
              <DialogTrigger asChild>
                <button
                  className="-ml-0.5 flex shrink-0 items-center justify-center rounded p-0.5 transition-colors hover:bg-black/20"
                  title={
                    data.records?.length
                      ? `View data (${data.records.length} rows)`
                      : "Insert data"
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  <Table2 className="h-4 w-4 opacity-90" />
                  {data.records && data.records.length > 0 && (
                    <span className="ml-1 text-[9px] font-semibold opacity-80">
                      {data.records.length}
                    </span>
                  )}
                </button>
              </DialogTrigger>
              <InsertDataDialog
                nodeId={id}
                data={data}
                onClose={() => setIsDataOpen(false)}
              />
            </Dialog>

            <PopoverTrigger asChild>
              <span className="truncate">{data.name}</span>
            </PopoverTrigger>
          </div>
          <PopoverContent
            className="border-border/50 shadow-xl"
            side="right"
            align="start"
          >
            <PropertiesPopover
              nodeId={id}
              data={data}
              onClose={() => setIsPropertiesOpen(false)}
            />
          </PopoverContent>
        </Popover>

        {/* Columns */}
        <div className="scrollbar-thin scrollbar-thumb-border/50 max-h-[300px] flex-1 overflow-y-auto py-1">
          {data.columns
            ?.filter(
              (col) =>
                !((data.hiddenColumns as string[]) || []).includes(col.id),
            )
            .map((col) => (
              <ColumnRow key={col.id} nodeId={id} column={col} />
            ))}
        </div>

        {/* Footer */}
        <TableFooter nodeId={id} data={data} />

        {/* Handles */}
        <NodeHandles />
      </div>
    </TooltipProvider>
  );
});

TableNodeComponent.displayName = "TableNode";
