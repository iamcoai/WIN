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
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function formatMoney(cents: number | null, currency: string) {
  if (cents == null) return "—";
  return `€${(cents / 100).toLocaleString("nl-NL", { maximumFractionDigits: 0 })}`;
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

    // STAGE REORDER
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

    // DEAL MOVE (within or between stages)
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
        // If we're moving down in the same stage, account for index shift
        const current = targetDeals.findIndex((d) => d.id === dealId);
        if (current !== -1 && current < targetIndex) targetIndex--;
      } else if (overType === "stage") {
        targetStage = String(over.id);
        const targetDeals = dealsByStage.get(targetStage) ?? [];
        targetIndex = targetDeals.filter((d) => d.id !== dealId).length;
      } else {
        return;
      }

      // Optimistic update
      setDeals((current) => {
        const next = [...current];
        const idx = next.findIndex((d) => d.id === dealId);
        if (idx === -1) return current;
        const [moved] = next.splice(idx, 1);

        // Get all target-stage deals sorted
        const targetDeals = next
          .filter((d) => d.stageId === targetStage)
          .sort((a, b) => a.position - b.position);
        const clamped = Math.max(0, Math.min(targetIndex, targetDeals.length));
        const inserted = { ...moved, stageId: targetStage, position: clamped };

        // Rebuild positions for target stage
        const reordered = [
          ...targetDeals.slice(0, clamped),
          inserted,
          ...targetDeals.slice(clamped),
        ].map((d, i) => ({ ...d, position: i }));

        // Merge back: non-target-stage deals unchanged, target-stage replaced
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
        <div className="flex min-h-[30rem] gap-3 overflow-x-auto pb-4">
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
            className="flex h-fit w-72 shrink-0 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground transition hover:border-primary/60 hover:bg-muted/50 hover:text-primary"
          >
            <Plus className="h-5 w-5" />
            Kolom toevoegen
          </button>
        </div>
      </SortableContext>

      <DragOverlay>
        {activeDealId ? (
          <DealCardView deal={findDeal(activeDealId)!} dragging />
        ) : activeStageId ? (
          <div className="w-72 rounded-xl border border-primary/40 bg-card p-3 opacity-90">
            <h3 className="text-sm font-semibold">
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
    <div ref={setNodeRef} style={style} className="w-72 shrink-0">
      <Card
        ref={setDropRef}
        className={cn(
          "h-full flex-col",
          isOver && "ring-2 ring-primary/40",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between gap-2 p-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing"
              aria-label="Sleep kolom"
            >
              <GripVertical className="h-4 w-4" />
            </button>
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
                className="flex-1 min-w-0 rounded border border-primary/50 bg-background px-2 py-0.5 text-sm font-semibold"
              />
            ) : (
              <CardTitle
                className="flex-1 min-w-0 truncate text-sm cursor-text"
                onClick={() => setEditing(true)}
              >
                {stage.name}
              </CardTitle>
            )}
            <Badge variant="outline" className="shrink-0">
              {deals.length}
            </Badge>
          </div>
          <button
            type="button"
            onClick={onDeleteStage}
            className="rounded p-1 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive"
            aria-label="Verwijder kolom"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </CardHeader>
        {totalCents > 0 ? (
          <div className="px-3 pb-1 text-xs text-muted-foreground">
            €{(totalCents / 100).toLocaleString("nl-NL", { maximumFractionDigits: 0 })}
            {stage.probability != null ? ` · ${stage.probability}%` : ""}
          </div>
        ) : null}
        <CardContent className="flex-1 space-y-2 p-2">
          <SortableContext
            items={deals.map((d) => d.id)}
            strategy={verticalListSortingStrategy}
          >
            {deals.map((d) => (
              <SortableDealCard key={d.id} deal={d} />
            ))}
          </SortableContext>
          {deals.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
              Leeg — sleep deal hierheen
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function SortableDealCard({ deal }: { deal: DealData }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: deal.id, data: { type: "deal" } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DealCardView deal={deal} />
    </div>
  );
}

function DealCardView({ deal, dragging }: { deal: DealData; dragging?: boolean }) {
  const contactName = deal.contact
    ? [deal.contact.firstName, deal.contact.lastName].filter(Boolean).join(" ")
    : null;

  return (
    <Link
      href={{ pathname: `/admin/crm/deals/${deal.id}` }}
      onClick={(e) => {
        if (dragging) e.preventDefault();
      }}
    >
      <div
        className={cn(
          "rounded-lg border border-border bg-card p-2.5 text-sm transition-shadow hover:shadow-sm",
          dragging && "rotate-2 shadow-lg",
        )}
      >
        <p className="line-clamp-2 font-medium">{deal.title}</p>
        {contactName ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {contactName}
            {deal.contact?.company ? ` · ${deal.contact.company}` : ""}
          </p>
        ) : null}
        {deal.tags.length ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {deal.tags.slice(0, 3).map((t) => (
              <span
                key={t.id}
                className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {t.name}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs font-semibold">
            {formatMoney(deal.amountCents, deal.currency)}
          </span>
          {deal.expectedCloseAt ? (
            <span className="text-[10px] text-muted-foreground">
              {new Intl.DateTimeFormat("nl-NL", {
                day: "numeric",
                month: "short",
              }).format(new Date(deal.expectedCloseAt))}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
