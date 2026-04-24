"use client";

import { useMemo, useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Target,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  Inbox,
  PauseCircle,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  createQuickTask,
  deleteTask,
  moveTaskToBucket,
  toggleFocus,
  toggleTaskDone,
} from "@/modules/tasks/actions";

type Bucket = "today" | "next" | "waiting" | "someday" | "inbox" | "done";

type TaskCtx = {
  type: "contact" | "deal" | "workshop";
  id: string;
  label: string;
  href: string;
};

type TaskData = {
  id: string;
  title: string;
  description: string | null;
  bucket: Bucket;
  isFocus: boolean;
  waitingOn: string | null;
  reminderAt: string | null;
  dueAt: string | null;
  context: TaskCtx | null;
};

const BUCKETS: Array<{
  id: Bucket;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent: string;
}> = [
  { id: "today", label: "Vandaag", description: "Wat vandaag telt", icon: Target, accent: "text-primary" },
  { id: "next", label: "Binnenkort", description: "Deze week", icon: Clock, accent: "text-secondary" },
  { id: "waiting", label: "Wachtend op", description: "Buiten mijn controle", icon: PauseCircle, accent: "text-warning" },
  { id: "someday", label: "Ooit", description: "Idee voor later", icon: Sparkles, accent: "text-muted-foreground" },
  { id: "inbox", label: "Inbox", description: "Net gevangen", icon: Inbox, accent: "text-info" },
];

export function TasksBoard({ tasks: initialTasks }: { tasks: TaskData[] }) {
  const [tasks, setTasks] = useState<TaskData[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => setTasks(initialTasks), [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Global "n" shortcut for quick-capture
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "n" && !quickOpen) {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
        e.preventDefault();
        setQuickOpen(true);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [quickOpen]);

  const tasksByBucket = useMemo(() => {
    const m = new Map<Bucket, TaskData[]>();
    for (const b of BUCKETS) m.set(b.id, []);
    m.set("done", []);
    for (const t of tasks) {
      const arr = m.get(t.bucket) ?? [];
      arr.push(t);
      m.set(t.bucket, arr);
    }
    // Focus first in today
    const today = m.get("today") ?? [];
    m.set(
      "today",
      [...today].sort((a, b) => (a.isFocus === b.isFocus ? 0 : a.isFocus ? -1 : 1)),
    );
    return m;
  }, [tasks]);

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const taskId = String(active.id);
    const overId = String(over.id);
    const overType = over.data.current?.type;

    let targetBucket: Bucket | null = null;
    if (overType === "bucket") {
      targetBucket = overId as Bucket;
    } else if (overType === "task") {
      targetBucket = tasks.find((t) => t.id === overId)?.bucket ?? null;
    }
    if (!targetBucket) return;
    const sourceBucket = tasks.find((t) => t.id === taskId)?.bucket;
    if (!sourceBucket || sourceBucket === targetBucket) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, bucket: targetBucket!, isFocus: targetBucket === "today" ? t.isFocus : false } : t)),
    );
    startTransition(async () => {
      await moveTaskToBucket(taskId, targetBucket!);
    });
  }

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[0.8125rem] text-muted-foreground">
          {tasks.filter((t) => t.bucket !== "done").length} open &middot;{" "}
          {tasks.filter((t) => t.isFocus).length} focus
        </p>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={showDone}
              onChange={(e) => setShowDone(e.target.checked)}
              className="h-3.5 w-3.5"
            />
            Toon afgerond
          </label>
          <Button onClick={() => setQuickOpen(true)} size="sm">
            <Plus className="h-3.5 w-3.5" /> Nieuwe taak{" "}
            <kbd className="ml-1 rounded bg-primary-foreground/20 px-1 text-[10px] font-medium text-primary-foreground">n</kbd>
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {BUCKETS.map((b) => (
            <Column
              key={b.id}
              bucket={b.id}
              label={b.label}
              description={b.description}
              icon={b.icon}
              accent={b.accent}
              tasks={tasksByBucket.get(b.id) ?? []}
            />
          ))}
        </div>

        {showDone ? (
          <section className="mt-8">
            <h2 className="text-caption mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              <span>Afgerond — {tasksByBucket.get("done")?.length ?? 0}</span>
            </h2>
            <div className="space-y-1.5">
              {(tasksByBucket.get("done") ?? []).map((t) => (
                <TaskRow key={t.id} task={t} dim />
              ))}
            </div>
          </section>
        ) : null}

        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div className="rotate-[1deg] opacity-95">
              <TaskRow task={activeTask} dragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <QuickCaptureDialog
        open={quickOpen}
        onOpenChange={setQuickOpen}
        onCreated={() => router.refresh()}
      />
    </>
  );
}

function Column({
  bucket,
  label,
  description,
  icon: Icon,
  accent,
  tasks,
}: {
  bucket: Bucket;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent: string;
  tasks: TaskData[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: bucket,
    data: { type: "bucket" },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[20rem] flex-col rounded-2xl border bg-surface-subtle/60 p-3 transition-all duration-[var(--duration-fast)]",
        isOver
          ? "border-primary/40 bg-primary/5 ring-1 ring-primary/30"
          : "border-border",
      )}
    >
      <header className="mb-3 flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", accent)} strokeWidth={1.8} />
          <h3 className="font-heading text-[0.875rem] font-semibold tracking-tight">
            {label}
          </h3>
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[0.6875rem] font-medium tabular-nums text-muted-foreground">
            {tasks.length}
          </span>
        </div>
      </header>
      <p className="mb-2 px-1 text-[0.6875rem] text-muted-foreground/80">
        {description}
      </p>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-1.5">
          {tasks.map((t) => (
            <SortableTask key={t.id} task={t} />
          ))}
          {tasks.length === 0 ? (
            <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-border/60 text-[0.75rem] text-muted-foreground/60">
              Sleep taak hierheen
            </div>
          ) : null}
        </div>
      </SortableContext>
    </div>
  );
}

function SortableTask({ task }: { task: TaskData }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { type: "task" } });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <TaskRow task={task} />
    </div>
  );
}

function TaskRow({
  task,
  dragging,
  dim,
}: {
  task: TaskData;
  dragging?: boolean;
  dim?: boolean;
}) {
  const [, startTransition] = useTransition();
  const router = useRouter();
  const reminder = task.reminderAt ? new Date(task.reminderAt) : null;
  const isOverdue = reminder ? reminder.getTime() < Date.now() && task.bucket !== "done" : false;

  return (
    <div
      className={cn(
        "group relative rounded-xl border border-border bg-card px-3 py-2.5 text-[0.8125rem] shadow-xs transition-all duration-[var(--duration-fast)]",
        !dragging && !dim && "hover:-translate-y-[1px] hover:shadow-md",
        dim && "opacity-60",
        dragging && "shadow-xl ring-1 ring-primary/40",
        task.isFocus && !dim && "border-primary/40 bg-primary/5",
      )}
    >
      <div className="flex items-start gap-2.5">
        {/* Check toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            startTransition(async () => {
              await toggleTaskDone(task.id);
              router.refresh();
            });
          }}
          className={cn(
            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            task.bucket === "done"
              ? "border-success bg-success text-background"
              : "border-border hover:border-primary",
          )}
          aria-label={task.bucket === "done" ? "Markeer niet klaar" : "Markeer klaar"}
        >
          {task.bucket === "done" ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : null}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <p className={cn(
              "flex-1 leading-snug",
              task.bucket === "done" && "line-through decoration-muted-foreground/40",
            )}>
              {task.title}
            </p>
            {task.isFocus ? (
              <Star className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" strokeWidth={1.5} />
            ) : null}
          </div>

          {task.waitingOn ? (
            <p className="mt-1 text-[0.6875rem] italic text-muted-foreground">
              wacht op: {task.waitingOn}
            </p>
          ) : null}

          {(task.context || reminder) ? (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[0.6875rem]">
              {task.context ? (
                <Link
                  href={{ pathname: task.context.href }}
                  onClick={(e) => {
                    if (dragging) e.preventDefault();
                    else e.stopPropagation();
                  }}
                  className="rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                >
                  {task.context.label}
                </Link>
              ) : null}
              {reminder ? (
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 tabular-nums",
                    isOverdue ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground",
                  )}
                >
                  {new Intl.DateTimeFormat("nl-NL", {
                    day: "numeric",
                    month: "short",
                  }).format(reminder)}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* Hover actions */}
      {!dim && !dragging ? (
        <div className="absolute right-2 top-2 hidden gap-0.5 group-hover:flex">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              startTransition(async () => {
                await toggleFocus(task.id);
                router.refresh();
              });
            }}
            className={cn(
              "rounded p-1 transition-colors",
              task.isFocus
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground/60 hover:bg-primary/10 hover:text-primary",
            )}
            aria-label="Markeer als focus"
          >
            <Star className={cn("h-3 w-3", task.isFocus && "fill-current")} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!window.confirm("Taak verwijderen?")) return;
              startTransition(async () => {
                await deleteTask(task.id);
                router.refresh();
              });
            }}
            className="rounded p-1 text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Verwijder"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function QuickCaptureDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [bucket, setBucket] = useState<Bucket>("inbox");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!title.trim()) return;
    startTransition(async () => {
      await createQuickTask({ title, bucket });
      setTitle("");
      setBucket("inbox");
      onOpenChange(false);
      onCreated();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nieuwe taak</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="qt-title">Wat wil je vastleggen?</Label>
            <Textarea
              id="qt-title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
              }}
              rows={3}
              placeholder="Bel Reza over voorstel Mark…"
            />
            <p className="text-xs text-muted-foreground">
              Tip: cmd/ctrl + enter om op te slaan
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="qt-bucket">Waar hoort 'ie?</Label>
            <select
              id="qt-bucket"
              value={bucket}
              onChange={(e) => setBucket(e.target.value as Bucket)}
              className="h-9 rounded-lg border border-border bg-card px-3 text-[0.9375rem]"
            >
              <option value="inbox">Inbox — beslis later</option>
              <option value="today">Vandaag</option>
              <option value="next">Binnenkort</option>
              <option value="waiting">Wachtend op iemand</option>
              <option value="someday">Ooit</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Annuleren
          </Button>
          <Button onClick={submit} disabled={pending || !title.trim()}>
            {pending ? "Opslaan…" : "Toevoegen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
