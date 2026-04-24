import Link from "next/link";
import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Plus, X } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";
import { db } from "@/lib/db";
import { contact, contactTag, tag, deal, customField } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { NewContactDialog } from "./new-contact-dialog";

type Params = Record<string, string | string[] | undefined>;

function asArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return v.split(",").filter(Boolean);
}

export default async function CRMContactsPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const sp = await searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim();
  const lifecycle = asArray(sp.lifecycle);
  const tagIds = asArray(sp.tag);
  const sort = (typeof sp.sort === "string" ? sp.sort : "recent") as
    | "recent"
    | "name"
    | "deals";

  // Load meta
  const allTags = await db.select().from(tag).orderBy(asc(tag.name));
  const contactCustomFields = await db
    .select()
    .from(customField)
    .where(eq(customField.entity, "contact"))
    .orderBy(asc(customField.position));

  // Build where clauses
  const whereClauses = [];
  if (q) {
    whereClauses.push(
      or(
        ilike(contact.firstName, `%${q}%`),
        ilike(contact.lastName, `%${q}%`),
        ilike(contact.email, `%${q}%`),
        ilike(contact.company, `%${q}%`),
      ),
    );
  }
  if (lifecycle.length) {
    whereClauses.push(inArray(contact.lifecycle, lifecycle as never));
  }

  let contactIdsForTags: string[] | null = null;
  if (tagIds.length) {
    const rows = await db
      .select({ contactId: contactTag.contactId })
      .from(contactTag)
      .where(inArray(contactTag.tagId, tagIds));
    contactIdsForTags = [...new Set(rows.map((r) => r.contactId))];
    if (contactIdsForTags.length === 0) contactIdsForTags = ["__none__"];
    whereClauses.push(inArray(contact.id, contactIdsForTags));
  }

  // Query contacts
  const contacts = await db
    .select()
    .from(contact)
    .where(whereClauses.length ? and(...whereClauses) : undefined)
    .orderBy(
      sort === "name"
        ? asc(contact.lastName)
        : desc(contact.updatedAt),
    );

  // Load tags per contact
  const contactTagRows = contacts.length
    ? await db
        .select()
        .from(contactTag)
        .where(inArray(contactTag.contactId, contacts.map((c) => c.id)))
    : [];
  const tagsByContact = new Map<string, string[]>();
  for (const r of contactTagRows) {
    if (!tagsByContact.has(r.contactId)) tagsByContact.set(r.contactId, []);
    tagsByContact.get(r.contactId)!.push(r.tagId);
  }

  // Deal counts per contact
  const dealCounts = contacts.length
    ? await db
        .select({
          contactId: deal.contactId,
          count: sql<number>`COUNT(*)::int`,
        })
        .from(deal)
        .where(inArray(deal.contactId, contacts.map((c) => c.id)))
        .groupBy(deal.contactId)
    : [];
  const dealCountMap = new Map(
    dealCounts.map((r) => [r.contactId, r.count]),
  );

  const tagById = new Map(allTags.map((t) => [t.id, t]));

  // Build filter-query helpers
  const buildHref = (patch: Record<string, string | undefined>) => {
    const qs = new URLSearchParams();
    if (q && !("q" in patch)) qs.set("q", q);
    lifecycle.forEach((l) => !("lifecycle" in patch) && qs.append("lifecycle", l));
    tagIds.forEach((t) => !("tag" in patch) && qs.append("tag", t));
    if (sort !== "recent" && !("sort" in patch)) qs.set("sort", sort);
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined) qs.delete(k);
      else qs.set(k, v);
    }
    return `/admin/crm${qs.toString() ? `?${qs.toString()}` : ""}`;
  };

  const toggleTag = (tagId: string) => {
    const next = tagIds.includes(tagId)
      ? tagIds.filter((t) => t !== tagId)
      : [...tagIds, tagId];
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    lifecycle.forEach((l) => qs.append("lifecycle", l));
    next.forEach((t) => qs.append("tag", t));
    if (sort !== "recent") qs.set("sort", sort);
    return `/admin/crm${qs.toString() ? `?${qs.toString()}` : ""}`;
  };

  const activeFilters =
    (q ? 1 : 0) + lifecycle.length + tagIds.length;

  return (
    <>
      <PageHeader
        title="CRM — Contacten"
        description={`${contacts.length} resultaten${activeFilters ? ` · ${activeFilters} filter${activeFilters === 1 ? "" : "s"} actief` : ""}`}
        actions={<NewContactDialog tags={allTags} customFields={contactCustomFields} />}
      />
      <PageBody className="max-w-full">
        {/* Search + filters */}
        <form className="mb-4 flex flex-wrap items-center gap-2" action="/admin/crm">
          <Input
            name="q"
            defaultValue={q}
            placeholder="Zoek op naam, e-mail, bedrijf…"
            className="h-10 max-w-sm flex-1"
          />
          {lifecycle.map((l) => (
            <input key={`lc-${l}`} type="hidden" name="lifecycle" value={l} />
          ))}
          {tagIds.map((t) => (
            <input key={`tg-${t}`} type="hidden" name="tag" value={t} />
          ))}
          {sort !== "recent" ? (
            <input type="hidden" name="sort" value={sort} />
          ) : null}
          <Button type="submit" variant="secondary">
            Zoeken
          </Button>
          {activeFilters > 0 ? (
            <Link
              href={{ pathname: "/admin/crm" }}
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Alles resetten
            </Link>
          ) : null}
        </form>

        {/* Lifecycle chips */}
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="mr-2 text-xs font-medium text-muted-foreground">
            Status:
          </span>
          {(["lead", "prospect", "customer", "archived"] as const).map((l) => {
            const active = lifecycle.includes(l);
            const next = active
              ? lifecycle.filter((x) => x !== l)
              : [...lifecycle, l];
            const qs = new URLSearchParams();
            if (q) qs.set("q", q);
            next.forEach((x) => qs.append("lifecycle", x));
            tagIds.forEach((x) => qs.append("tag", x));
            return (
              <Link
                key={l}
                href={{ pathname: "/admin/crm", query: qs.toString() ? Object.fromEntries(qs) : undefined } as never}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {l}
              </Link>
            );
          })}
        </div>

        {/* Tag chips */}
        {allTags.length ? (
          <div className="mb-5 flex flex-wrap items-center gap-1.5">
            <span className="mr-2 text-xs font-medium text-muted-foreground">
              Tags:
            </span>
            {allTags.map((t) => {
              const active = tagIds.includes(t.id);
              return (
                <Link
                  key={t.id}
                  href={toggleTag(t.id) as never}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs transition-colors",
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {t.name}
                  {active ? <X className="ml-1 inline h-3 w-3" /> : null}
                </Link>
              );
            })}
          </div>
        ) : null}

        {/* Table */}
        {contacts.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Geen contacten"
            description={activeFilters ? "Geen resultaten voor deze filters." : "Voeg je eerste contact toe."}
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Naam</TableHead>
                      <TableHead>Bedrijf</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="text-right">Deals</TableHead>
                      <TableHead>Laatst bijgewerkt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((c) => (
                      <TableRow
                        key={c.id}
                        className="cursor-pointer"
                      >
                        <TableCell>
                          <Link
                            href={{ pathname: `/admin/crm/contacts/${c.id}` }}
                            className="font-medium hover:underline"
                          >
                            {[c.firstName, c.lastName].filter(Boolean).join(" ") || "—"}
                          </Link>
                          {c.jobTitle ? (
                            <div className="text-xs text-muted-foreground">
                              {c.jobTitle}
                            </div>
                          ) : null}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {c.company ?? "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {c.email ?? "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              c.lifecycle === "customer"
                                ? "default"
                                : c.lifecycle === "prospect"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {c.lifecycle}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(tagsByContact.get(c.id) ?? []).map((tid) => {
                              const t = tagById.get(tid);
                              if (!t) return null;
                              return (
                                <Badge
                                  key={tid}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {t.name}
                                </Badge>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {dealCountMap.get(c.id) ?? 0}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Intl.DateTimeFormat("nl-NL").format(new Date(c.updatedAt))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </PageBody>
    </>
  );
}
