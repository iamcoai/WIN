"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical, Trash2, Pencil, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  addStage,
  deleteStage,
  moveDeal,
  renameStage,
  reorderStages,
} from "@/modules/crm/actions";

type StageData = {
  id: string;
  name: string;
  color: string;
  position: number;
  isWon: boolean;
  isLost: boolean;
  probability: number | null;
};

type DealData = {
  id: string;
  title: string;
  stageId: string;
  amountCents: number | null;
  currency: string;
  position: number;
  status: string;
  expectedCloseAt: string | null;
  contact: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    company: string | null;
  } | null;
  tags: { id: string; name: string; color: string }[];
};

type BoardData = {
  pipelineId: string;
  pipelineName: string;
  stages: StageData[];
  deals: DealData[];
};

const STAGE_COLOR: Record<string, string> = {
  neutral: "bg-muted-foreground/50",
  gold: "bg-primary",
  olive: "bg-secondary",
  success: "bg-success",
  warn: "bg-warning",
  danger: "bg-destructive",
};

function formatMoney(cents: number | null) {
  if (cents == null) return "—";
  return `€${(cents / 100).toLocaleString("nl-NL", { maximumFractionDigits: 0 })}`;
}

function formatClose(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  const diffDays = Math.round((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const label = new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
  }).format(d);
  return { label, diffDays };
}

export function PipelineBoard({ data }: { data: BoardData }) {
  const [stages, setStages] = useState<StageData[]>(data.stages);
  const [deals, setDeals] = useState<DealData[]>(data.deals);
  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const dealsByStage = useMemo(() => {
    const m = new Map<string, DealData[]>();
    for (const s of stages) m.set(s.id, []);
    for (const d of deals) {
      if (!m.has(d.stageId)) m.set(d.stageId, []);
      m.get(d.stageId)!.push(d);
    }
    for (const [, arr] of m) arr.sort((a, b) => a.position - b.position);
    return m;
  }, [stages, deals]);

  const findDeal = (id: string) => deals.find((d) => d.id === id);
  const findStageForDeal = (dealId: string) => findDeal(dealId)?.stageId;

  function handleDragStart(e: DragStartEvent) {
    const id = String(e.active.id);
    const type = e.active.data.current?.type;
    if (type === "deal") setActiveDealId(id);
    else if (type === "stage") setActiveStageId(id);
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveDealId(null);
    setActiveStageId(null);
    const { active, over } = e;
    if (!over) return;
    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === "stage" && overType === "stage" && active.id !== over.id) {
      const oldIndex = stages.findIndex((s) => s.id === active.id);
      const newIndex = stages.findIndex((s) => s.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return;
      const reordered = arrayMove(stages, oldIndex, newIndex);
      setStages(reordered);
      startTransition(async () => {
        await reorderStages(data.pipelineId, reordered.map((s) => s.id));
      });
      return;
    }

    if (activeType === "deal") {
      const dealId = String(active.id);
      const sourceStage = findStageForDeal(dealId);
      if (!sourceStage) return;

      let targetStage: string;
      let targetIndex: number;

      if (overType === "deal") {
        const overDeal = findDeal(String(over.id));
        if (!overDeal) return;
        targetStage = overDeal.stageId;
        const targetDeals = dealsByStage.get(targetStage) ?? [];
        targetIndex = targetDeals.findIndex((d) => d.id === overDeal.id);
        const current = targetDeals.findIndex((d) => d.id === dealId);
        if (current !== -1 && current < targetIndex) targetIndex--;
      } else if (overType === "stage") {
        targetStage = String(over.id);
        const targetDeals = dealsByStage.get(targetStage) ?? [];
        targetIndex = targetDeals.filter((d) => d.id !== dealId).length;
      } else {
        return;
      }

      setDeals((current) => {
        const next = [...current];
        const idx = next.findIndex((d) => d.id === dealId);
        if (idx === -1) return current;
        const [moved] = next.splice(idx, 1);
        const targetDeals = next
          .filter((d) => d.stageId === targetStage)
          .sort((a, b) => a.position - b.position);
        const clamped = Math.max(0, Math.min(targetIndex, targetDeals.length));
        const inserted = { ...moved, stageId: targetStage, position: clamped };
        const reordered = [
          ...targetDeals.slice(0, clamped),
          inserted,
          ...targetDeals.slice(clamped),
        ].map((d, i) => ({ ...d, position: i }));
        return [
          ...next.filter((d) => d.stageId !== targetStage),
          ...reordered,
        ];
      });

      startTransition(async () => {
        await moveDeal({
          dealId,
          toStageId: targetStage,
          toIndex: targetIndex,
        });
      });
    }
  }

  async function onAddStage() {
    const name = window.prompt("Naam voor de nieuwe kolom?");
    if (!name?.trim()) return;
    startTransition(async () => {
      await addStage({ pipelineId: data.pipelineId, name: name.trim() });
      window.location.reload();
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={stages.map((s) => s.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex min-h-[32rem] gap-4 overflow-x-auto px-1 pb-6">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              deals={dealsByStage.get(stage.id) ?? []}
            />
          ))}
          <button
            type="button"
            onClick={onAddStage}
            className="group flex h-fit w-[19rem] shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-border bg-transparent p-10 text-sm font-medium text-muted-foreground transition-all duration-[var(--duration-fast)] hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-current transition-transform group-hover:scale-110">
              <Plus className="h-4 w-4" />
            </span>
            Kolom toevoegen
          </button>
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {activeDealId ? (
          <div className="rotate-[1.5deg] cursor-grabbing">
            <DealCardView deal={findDeal(activeDealId)!} dragging />
          </div>
        ) : activeStageId ? (
          <div className="w-[19rem] rounded-2xl border border-primary/40 bg-surface p-4 opacity-95 shadow-xl">
            <h3 className="font-heading text-sm font-semibold">
              {stages.find((s) => s.id === activeStageId)?.name}
            </h3>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({
  stage,
  deals,
}: {
  stage: StageData;
  deals: DealData[];
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(stage.name);
  const [, startTransition] = useTransition();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: stage.id, data: { type: "stage" } });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: stage.id,
    data: { type: "stage" },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const totalCents = deals.reduce((sum, d) => sum + (d.amountCents ?? 0), 0);
  const colorClass = STAGE_COLOR[stage.color] ?? STAGE_COLOR.neutral;

  function commitRename() {
    if (name.trim() && name !== stage.name) {
      startTransition(async () => {
        await renameStage(stage.id, name.trim());
      });
    }
    setEditing(false);
  }

  async function onDeleteStage() {
    if (deals.length > 0) {
      window.alert("Kan kolom niet verwijderen: er staan nog deals in.");
      return;
    }
    if (!window.confirm(`Kolom "${stage.name}" verwijderen?`)) return;
    startTransition(async () => {
      await deleteStage(stage.id);
      window.location.reload();
    });
  }

  return (
    <div ref={setNodeRef} style={style} className="group/column w-[19rem] shrink-0">
      <div
        ref={setDropRef}
        className={cn(
          "flex h-full flex-col rounded-2xl border bg-surface-subtle/60 transition-all duration-[var(--duration-fast)]",
          isOver
            ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
            : "border-border",
        )}
      >
        {/* Header */}
        <header className="flex items-center gap-2 px-3 pb-2.5 pt-3.5">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none rounded-md p-1 text-muted-foreground/60 opacity-0 transition-all duration-[var(--duration-fast)] hover:bg-muted hover:text-foreground active:cursor-grabbing group-hover/column:opacity-100"
            aria-label="Sleep kolom"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>

          <span className={cn("h-2 w-2 shrink-0 rounded-full", colorClass)} aria-hidden />

          {editing ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") {
                  setName(stage.name);
                  setEditing(false);
                }
              }}
              className="flex-1 min-w-0 rounded border border-primary/50 bg-background px-1.5 py-0.5 text-[0.8125rem] font-semibold tracking-tight outline-none focus:ring-2 focus:ring-ring/40"
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="group/title flex flex-1 min-w-0 items-center gap-1.5 rounded px-0.5 text-left"
            >
              <h3 className="truncate font-heading text-[0.8125rem] font-semibold tracking-tight">
                {stage.name}
              </h3>
              <Pencil className="h-3 w-3 text-muted-foreground/50 opacity-0 transition-opacity group-hover/title:opacity-100" />
            </button>
          )}

          <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[0.6875rem] font-medium tabular-nums text-muted-foreground">
            {deals.length}
          </span>

          <button
            type="button"
            onClick={onDeleteStage}
            className="rounded-md p-1 text-muted-foreground/60 opacity-0 transition-all duration-[var(--duration-fast)] hover:bg-destructive/10 hover:text-destructive group-hover/column:opacity-100"
            aria-label="Verwijder kolom"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </header>

        {/* Stats */}
        {totalCents > 0 || stage.probability != null ? (
          <div className="flex items-center gap-3 border-b border-border/60 px-3 pb-2.5 text-[0.75rem] text-muted-foreground">
            {totalCents > 0 ? (
              <span className="font-medium text-foreground tabular-nums">
                {formatMoney(totalCents)}
              </span>
            ) : null}
            {stage.probability != null ? (
              <span className="tabular-nums">{stage.probability}%</span>
            ) : null}
            {stage.isWon ? (
              <Badge variant="success" className="ml-auto">won</Badge>
            ) : stage.isLost ? (
              <Badge variant="destructive" className="ml-auto">lost</Badge>
            ) : null}
          </div>
        ) : null}

        {/* Cards */}
        <div className="flex-1 space-y-2 p-2">
          <SortableContext
            items={deals.map((d) => d.id)}
            strategy={verticalListSortingStrategy}
          >
            {deals.map((d) => (
              <SortableDealCard key={d.id} deal={d} />
            ))}
          </SortableContext>
          {deals.length === 0 ? (
            <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border/70 px-3 text-center text-[0.75rem] text-muted-foreground/70">
              Sleep deal hierheen
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SortableDealCard({ deal }: { deal: DealData }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: deal.id, data: { type: "deal" } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DealCardView deal={deal} placeholder={isDragging} />
    </div>
  );
}

function DealCardView({
  deal,
  dragging,
  placeholder,
}: {
  deal: DealData;
  dragging?: boolean;
  placeholder?: boolean;
}) {
  const contactName = deal.contact
    ? [deal.contact.firstName, deal.contact.lastName].filter(Boolean).join(" ")
    : null;
  const close = formatClose(deal.expectedCloseAt);
  const isOverdue = close ? close.diffDays < 0 : false;
  const isSoon = close ? close.diffDays >= 0 && close.diffDays <= 3 : false;

  return (
    <Link
      href={{ pathname: `/admin/crm/deals/${deal.id}` }}
      onClick={(e) => {
        if (dragging || placeholder) e.preventDefault();
      }}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:rounded-xl"
    >
      <div
        className={cn(
          "rounded-xl border border-border bg-card p-3 text-[0.8125rem] shadow-xs transition-all duration-[var(--duration-fast)]",
          !dragging && "hover:-translate-y-[1px] hover:shadow-md hover:border-border-strong",
          dragging && "rotate-0 shadow-xl ring-1 ring-primary/40",
        )}
      >
        <p className="line-clamp-2 font-medium leading-snug text-foreground">
          {deal.title}
        </p>

        {contactName ? (
          <p className="mt-1 flex items-center gap-1.5 truncate text-[0.75rem] text-muted-foreground">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[9px] font-semibold text-primary">
              {contactName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
            </span>
            <span className="truncate">
              {contactName}
              {deal.contact?.company ? ` · ${deal.contact.company}` : ""}
            </span>
          </p>
        ) : null}

        {deal.tags.length ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {deal.tags.slice(0, 3).map((t) => (
              <span
                key={t.id}
                className="rounded-md bg-muted px-1.5 py-0.5 text-[0.625rem] font-medium text-muted-foreground"
              >
                {t.name}
              </span>
            ))}
            {deal.tags.length > 3 ? (
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[0.625rem] font-medium text-muted-foreground">
                +{deal.tags.length - 3}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2">
          <span className="font-semibold tabular-nums text-foreground">
            {formatMoney(deal.amountCents)}
          </span>
          {close ? (
            <span
              className={cn(
                "flex items-center gap-1 text-[0.6875rem] tabular-nums",
                isOverdue
                  ? "text-destructive"
                  : isSoon
                    ? "text-warning"
                    : "text-muted-foreground",
              )}
            >
              <CalendarDays className="h-3 w-3" />
              {close.label}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
