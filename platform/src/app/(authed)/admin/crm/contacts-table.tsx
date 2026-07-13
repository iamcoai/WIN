"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Columns3,
  Filter,
  Rows3,
  Save,
  Star,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { updateContact } from "@/modules/crm/actions";
import { deleteCrmView, saveCrmView, type ViewConfig } from "@/modules/crm/view-actions";

// ─── Types ───────────────────────────────────────────────────────────

export type ContactRowData = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  jobTitle: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  lifecycle: string;
  tags: string[];
  deals: number;
  lastContactedAt: string | null;
  updatedAt: string;
  createdAt: string;
  customFields: Record<string, unknown>;
};

export type CustomFieldDef = {
  key: string;
  label: string;
  fieldType: string;
  options: string[];
};

export type SavedView = {
  id: string;
  name: string;
  isDefault: boolean;
  columns: string[];
  filters: { field: string; value: string }[];
  sort: { field: string; dir: "asc" | "desc" }[];
  density: "comfortable" | "compact";
};

type ColDef = {
  key: string;
  label: string;
  kind: "text" | "badge" | "tags" | "number" | "date";
  editField?: string; // contact column for inline edit
  cfKey?: string; // custom-field key (stored in customFields jsonb)
};

const LIFECYCLES = ["lead", "prospect", "customer", "archived"] as const;

const BUILTIN_COLS: ColDef[] = [
  { key: "voornaam", label: "Voornaam", kind: "text", editField: "firstName" },
  { key: "achternaam", label: "Achternaam", kind: "text", editField: "lastName" },
  { key: "bedrijf", label: "Bedrijf", kind: "text", editField: "company" },
  { key: "email", label: "E-mail", kind: "text", editField: "email" },
  { key: "telefoon", label: "Telefoon", kind: "text", editField: "phone" },
  { key: "functie", label: "Functie", kind: "text", editField: "jobTitle" },
  { key: "status", label: "Status", kind: "badge" },
  { key: "tags", label: "Tags", kind: "tags" },
  { key: "deals", label: "Deals", kind: "number" },
  { key: "bron", label: "Bron", kind: "text", editField: "source" },
  { key: "laatst_contact", label: "Laatst contact", kind: "date" },
  { key: "bijgewerkt", label: "Bijgewerkt", kind: "date" },
  { key: "aangemaakt", label: "Aangemaakt", kind: "date" },
];

const DEFAULT_COLUMNS = [
  "voornaam",
  "achternaam",
  "bedrijf",
  "email",
  "status",
  "tags",
  "deals",
  "bijgewerkt",
];

const dateFmt = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function cellValue(row: ContactRowData, col: ColDef): string {
  if (col.cfKey) {
    const v = row.customFields?.[col.cfKey];
    if (v === null || v === undefined || v === "") return "";
    return typeof v === "boolean" ? (v ? "ja" : "nee") : String(v);
  }
  switch (col.key) {
    case "voornaam": return row.firstName ?? "";
    case "achternaam": return row.lastName ?? "";
    case "bedrijf": return row.company ?? "";
    case "email": return row.email ?? "";
    case "telefoon": return row.phone ?? "";
    case "functie": return row.jobTitle ?? "";
    case "status": return row.lifecycle;
    case "tags": return row.tags.join(", ");
    case "deals": return String(row.deals);
    case "bron": return row.source ?? "";
    case "laatst_contact": return row.lastContactedAt ?? "";
    case "bijgewerkt": return row.updatedAt;
    case "aangemaakt": return row.createdAt;
    default: return "";
  }
}

// ─── Component ───────────────────────────────────────────────────────

export function ContactsTable({
  rows,
  customFields,
  views,
}: {
  rows: ContactRowData[];
  customFields: CustomFieldDef[];
  views: SavedView[];
}) {
  const allCols = useMemo<ColDef[]>(
    () => [
      ...BUILTIN_COLS,
      ...customFields.map((cf) => ({
        key: `cf:${cf.key}`,
        label: cf.label,
        kind: "text" as const,
        cfKey: cf.key,
      })),
    ],
    [customFields],
  );
  const colByKey = useMemo(
    () => new Map(allCols.map((c) => [c.key, c])),
    [allCols],
  );

  const defaultView = views.find((v) => v.isDefault);
  const [activeViewId, setActiveViewId] = useState<string | null>(defaultView?.id ?? null);
  const [columns, setColumns] = useState<string[]>(
    defaultView?.columns?.length ? defaultView.columns : DEFAULT_COLUMNS,
  );
  const [filters, setFilters] = useState<{ field: string; value: string }[]>(
    defaultView?.filters ?? [],
  );
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }[]>(
    defaultView?.sort ?? [],
  );
  const [density, setDensity] = useState<"comfortable" | "compact">(
    defaultView?.density ?? "comfortable",
  );
  const [showFilters, setShowFilters] = useState((defaultView?.filters?.length ?? 0) > 0);
  const [editing, setEditing] = useState<{ rowId: string; colKey: string } | null>(null);
  const [draft, setDraft] = useState("");
  const [saveOpen, setSaveOpen] = useState(false);
  const [viewName, setViewName] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const config: ViewConfig = { columns, filters, sort, density };

  // ── derived rows ──
  const visibleCols = columns
    .map((k) => colByKey.get(k))
    .filter(Boolean) as ColDef[];

  const filtered = useMemo(() => {
    let out = rows;
    for (const f of filters) {
      const col = colByKey.get(f.field);
      if (!col || !f.value) continue;
      const needle = f.value.toLowerCase();
      out = out.filter((r) => cellValue(r, col).toLowerCase().includes(needle));
    }
    if (sort.length) {
      const s = sort[0];
      const col = colByKey.get(s.field);
      if (col) {
        out = [...out].sort((a, b) => {
          const av = cellValue(a, col);
          const bv = cellValue(b, col);
          const cmp =
            col.kind === "number"
              ? Number(av) - Number(bv)
              : av.localeCompare(bv, "nl");
          return s.dir === "asc" ? cmp : -cmp;
        });
      }
    }
    return out;
  }, [rows, filters, sort, colByKey]);

  // ── handlers ──
  function toggleColumn(key: string) {
    setColumns((cur) =>
      cur.includes(key) ? cur.filter((c) => c !== key) : [...cur, key],
    );
    setActiveViewId(null);
  }

  function moveColumn(key: string, dir: -1 | 1) {
    setColumns((cur) => {
      const idx = cur.indexOf(key);
      const to = idx + dir;
      if (idx === -1 || to < 0 || to >= cur.length) return cur;
      const next = [...cur];
      [next[idx], next[to]] = [next[to], next[idx]];
      return next;
    });
    setActiveViewId(null);
  }

  function toggleSort(key: string) {
    setSort((cur) => {
      const existing = cur.find((s) => s.field === key);
      if (!existing) return [{ field: key, dir: "asc" }];
      if (existing.dir === "asc") return [{ field: key, dir: "desc" }];
      return [];
    });
  }

  function setFilter(field: string, value: string) {
    setFilters((cur) => {
      const next = cur.filter((f) => f.field !== field);
      if (value) next.push({ field, value });
      return next;
    });
  }

  function applyView(v: SavedView) {
    setActiveViewId(v.id);
    setColumns(v.columns.length ? v.columns : DEFAULT_COLUMNS);
    setFilters(v.filters ?? []);
    setSort(v.sort ?? []);
    setDensity(v.density ?? "comfortable");
    setShowFilters((v.filters?.length ?? 0) > 0);
  }

  function startEdit(row: ContactRowData, col: ColDef) {
    if (!col.editField && !col.cfKey && col.key !== "status") return;
    setEditing({ rowId: row.id, colKey: col.key });
    setDraft(col.key === "status" ? row.lifecycle : cellValue(row, col));
  }

  function commitEdit(row: ContactRowData, col: ColDef, value: string) {
    setEditing(null);
    const current = col.key === "status" ? row.lifecycle : cellValue(row, col);
    if (value === current) return;
    startTransition(async () => {
      if (col.cfKey) {
        await updateContact(row.id, {
          customFields: { ...row.customFields, [col.cfKey]: value },
        } as never);
      } else if (col.key === "status") {
        await updateContact(row.id, { lifecycle: value } as never);
      } else if (col.editField) {
        await updateContact(row.id, { [col.editField]: value || null } as never);
      }
      router.refresh();
    });
  }

  const activeView = views.find((v) => v.id === activeViewId);
  const cellPad = density === "compact" ? "py-1" : "py-2.5";

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {/* Views */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Star className={cn("h-3.5 w-3.5", activeView && "fill-primary text-primary")} />
                {activeView?.name ?? "Weergave"}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Opgeslagen weergaven</DropdownMenuLabel>
            {views.length === 0 ? (
              <p className="px-2 py-1.5 text-xs text-muted-foreground">
                Nog geen weergaven opgeslagen.
              </p>
            ) : (
              views.map((v) => (
                <DropdownMenuItem key={v.id} onClick={() => applyView(v)}>
                  <span className="flex-1 truncate">{v.name}</span>
                  {v.isDefault ? <Star className="h-3 w-3 fill-primary text-primary" /> : null}
                  {v.id === activeViewId ? <Check className="h-3.5 w-3.5" /> : null}
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            {activeView ? (
              <>
                <DropdownMenuItem
                  onClick={() =>
                    startTransition(async () => {
                      await saveCrmView({
                        id: activeView.id,
                        name: activeView.name,
                        config,
                        isDefault: activeView.isDefault,
                      });
                      router.refresh();
                    })
                  }
                >
                  <Save className="h-3.5 w-3.5" /> “{activeView.name}” bijwerken
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    startTransition(async () => {
                      await saveCrmView({
                        id: activeView.id,
                        name: activeView.name,
                        config,
                        isDefault: true,
                      });
                      router.refresh();
                    })
                  }
                >
                  <Star className="h-3.5 w-3.5" /> Maak standaard
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() =>
                    startTransition(async () => {
                      await deleteCrmView(activeView.id);
                      setActiveViewId(null);
                      router.refresh();
                    })
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" /> Verwijderen
                </DropdownMenuItem>
              </>
            ) : null}
            <DropdownMenuItem onClick={() => setSaveOpen(true)}>
              <Save className="h-3.5 w-3.5" /> Opslaan als nieuwe weergave…
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Columns */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Columns3 className="h-3.5 w-3.5" /> Kolommen
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="max-h-96 w-64 overflow-y-auto">
            <DropdownMenuLabel>Zichtbare kolommen</DropdownMenuLabel>
            {columns.map((key, i) => {
              const col = colByKey.get(key);
              if (!col) return null;
              return (
                <div key={key} className="flex items-center gap-1 px-2 py-1">
                  <Checkbox
                    id={`col-${key}`}
                    checked
                    onCheckedChange={() => toggleColumn(key)}
                  />
                  <label htmlFor={`col-${key}`} className="flex-1 truncate text-sm">
                    {col.label}
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    disabled={i === 0}
                    onClick={() => moveColumn(key, -1)}
                    aria-label="Kolom naar links"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    disabled={i === columns.length - 1}
                    onClick={() => moveColumn(key, 1)}
                    aria-label="Kolom naar rechts"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Meer kolommen</DropdownMenuLabel>
            {allCols
              .filter((c) => !columns.includes(c.key))
              .map((col) => (
                <div key={col.key} className="flex items-center gap-1 px-2 py-1">
                  <Checkbox
                    id={`col-${col.key}`}
                    checked={false}
                    onCheckedChange={() => toggleColumn(col.key)}
                  />
                  <label htmlFor={`col-${col.key}`} className="flex-1 truncate text-sm">
                    {col.label}
                  </label>
                </div>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant={showFilters || filters.length ? "default" : "outline"}
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => setShowFilters((v) => !v)}
        >
          <Filter className="h-3.5 w-3.5" />
          Filters{filters.length ? ` (${filters.length})` : ""}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => setDensity((d) => (d === "compact" ? "comfortable" : "compact"))}
        >
          <Rows3 className="h-3.5 w-3.5" />
          {density === "compact" ? "Compact" : "Normaal"}
        </Button>

        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} van {rows.length}
          {pending ? " · opslaan…" : ""}
        </span>
      </div>

      {/* Save-view inline form */}
      {saveOpen ? (
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-card p-2">
          <Input
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            placeholder="Naam van de weergave, bv. Warme leads"
            className="h-8 max-w-xs"
            autoFocus
          />
          <Button
            size="sm"
            className="h-8"
            disabled={pending || !viewName.trim()}
            onClick={() =>
              startTransition(async () => {
                const id = await saveCrmView({ name: viewName, config });
                setActiveViewId(id);
                setSaveOpen(false);
                setViewName("");
                router.refresh();
              })
            }
          >
            Opslaan
          </Button>
          <Button variant="ghost" size="sm" className="h-8" onClick={() => setSaveOpen(false)}>
            Annuleren
          </Button>
        </div>
      ) : null}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleCols.map((col) => {
                    const s = sort.find((x) => x.field === col.key);
                    return (
                      <TableHead
                        key={col.key}
                        className="cursor-pointer select-none whitespace-nowrap"
                        onClick={() => toggleSort(col.key)}
                      >
                        <span className="inline-flex items-center gap-1">
                          {col.label}
                          {s ? (
                            s.dir === "asc" ? (
                              <ArrowUp className="h-3 w-3 text-primary" />
                            ) : (
                              <ArrowDown className="h-3 w-3 text-primary" />
                            )
                          ) : null}
                        </span>
                      </TableHead>
                    );
                  })}
                </TableRow>
                {showFilters ? (
                  <TableRow>
                    {visibleCols.map((col) => (
                      <TableHead key={`f-${col.key}`} className="py-1.5">
                        {col.key === "status" ? (
                          <select
                            value={filters.find((f) => f.field === col.key)?.value ?? ""}
                            onChange={(e) => setFilter(col.key, e.target.value)}
                            className="h-7 w-full min-w-[6rem] rounded-md border border-border bg-card px-1.5 text-xs font-normal"
                          >
                            <option value="">Alle</option>
                            {LIFECYCLES.map((l) => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                          </select>
                        ) : (
                          <Input
                            value={filters.find((f) => f.field === col.key)?.value ?? ""}
                            onChange={(e) => setFilter(col.key, e.target.value)}
                            placeholder="Filter…"
                            className="h-7 min-w-[6rem] text-xs font-normal"
                          />
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ) : null}
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id}>
                    {visibleCols.map((col) => {
                      const isEditing =
                        editing?.rowId === row.id && editing.colKey === col.key;
                      const editable = Boolean(col.editField || col.cfKey) || col.key === "status";

                      if (isEditing && col.key === "status") {
                        return (
                          <TableCell key={col.key} className={cellPad}>
                            <select
                              value={draft}
                              autoFocus
                              onChange={(e) => commitEdit(row, col, e.target.value)}
                              onBlur={() => setEditing(null)}
                              className="h-7 rounded-md border border-border bg-card px-1.5 text-xs"
                            >
                              {LIFECYCLES.map((l) => (
                                <option key={l} value={l}>{l}</option>
                              ))}
                            </select>
                          </TableCell>
                        );
                      }
                      if (isEditing) {
                        return (
                          <TableCell key={col.key} className={cellPad}>
                            <Input
                              value={draft}
                              autoFocus
                              onChange={(e) => setDraft(e.target.value)}
                              onBlur={() => commitEdit(row, col, draft)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") commitEdit(row, col, draft);
                                if (e.key === "Escape") setEditing(null);
                              }}
                              className="h-7 min-w-[8rem] text-sm"
                            />
                          </TableCell>
                        );
                      }

                      let content: React.ReactNode;
                      switch (col.kind) {
                        case "badge":
                          content = (
                            <Badge
                              variant={
                                row.lifecycle === "customer"
                                  ? "default"
                                  : row.lifecycle === "prospect"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {row.lifecycle}
                            </Badge>
                          );
                          break;
                        case "tags":
                          content = (
                            <div className="flex flex-wrap gap-1">
                              {row.tags.map((t) => (
                                <Badge key={t} variant="outline" className="text-xs">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          );
                          break;
                        case "number":
                          content = (
                            <span className="font-semibold tabular-nums">
                              {cellValue(row, col)}
                            </span>
                          );
                          break;
                        case "date": {
                          const v = cellValue(row, col);
                          content = (
                            <span className="text-xs text-muted-foreground">
                              {v ? dateFmt.format(new Date(v)) : "—"}
                            </span>
                          );
                          break;
                        }
                        default: {
                          const v = cellValue(row, col);
                          content =
                            col.key === "voornaam" ? (
                              <Link
                                href={{ pathname: `/admin/crm/contacts/${row.id}` }}
                                className="font-medium hover:text-primary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {v || "—"}
                              </Link>
                            ) : (
                              <span className={v ? undefined : "text-muted-foreground"}>
                                {v || "—"}
                              </span>
                            );
                        }
                      }

                      return (
                        <TableCell
                          key={col.key}
                          className={cn(cellPad, editable && "cursor-text")}
                          onDoubleClick={() => startEdit(row, col)}
                          title={editable ? "Dubbelklik om te bewerken" : undefined}
                        >
                          {content}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={visibleCols.length}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      Geen contacten voor deze filters.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
