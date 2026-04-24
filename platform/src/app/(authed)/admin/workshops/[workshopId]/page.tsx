import { notFound } from "next/navigation";
import Link from "next/link";
import { asc, eq, inArray, notInArray, sql } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/lib/db";
import {
  contact,
  customField,
  task,
  workshop,
  workshopAttendee,
} from "@/lib/db/schema";
import { AttendeePicker } from "./attendee-picker";
import { AttendeeStatusSelect } from "./attendee-status-select";

export default async function WorkshopDetail({
  params,
}: {
  params: Promise<{ workshopId: string }>;
}) {
  const { workshopId } = await params;
  const [w] = await db.select().from(workshop).where(eq(workshop.id, workshopId)).limit(1);
  if (!w) notFound();

  const attendees = await db
    .select({
      id: workshopAttendee.id,
      status: workshopAttendee.status,
      registeredAt: workshopAttendee.registeredAt,
      contactId: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      company: contact.company,
    })
    .from(workshopAttendee)
    .innerJoin(contact, eq(contact.id, workshopAttendee.contactId))
    .where(eq(workshopAttendee.workshopId, workshopId))
    .orderBy(asc(workshopAttendee.registeredAt));

  const attendeeContactIds = attendees.map((a) => a.contactId);
  const availableContacts = await db
    .select({
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
    })
    .from(contact)
    .where(
      attendeeContactIds.length
        ? notInArray(contact.id, attendeeContactIds)
        : sql`true`,
    )
    .orderBy(asc(contact.lastName));

  const linkedTasks = await db
    .select()
    .from(task)
    .where(eq(task.workshopId, workshopId));

  const cfDefs = await db
    .select()
    .from(customField)
    .where(eq(customField.entity, "workshop"))
    .orderBy(asc(customField.position));
  const cfValues = (w.customFields as Record<string, unknown>) ?? {};

  return (
    <>
      <PageHeader
        title={w.title}
        description={
          w.startsAt
            ? `${new Intl.DateTimeFormat("nl-NL", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(w.startsAt))}${w.location ? ` · ${w.location}` : ""}`
            : undefined
        }
        actions={
          <Badge variant={w.status === "open" ? "default" : "secondary"}>
            {w.status}
          </Badge>
        }
      />
      <PageBody className="max-w-5xl">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Aanmeldingen</CardTitle>
                  <CardDescription>
                    {attendees.length}
                    {w.capacity ? ` van ${w.capacity} plaatsen bezet` : " aangemeld"}
                  </CardDescription>
                </div>
                <AttendeePicker
                  workshopId={workshopId}
                  contacts={availableContacts.map((c) => ({
                    id: c.id,
                    label: [c.firstName, c.lastName].filter(Boolean).join(" ") || c.email || c.id,
                  }))}
                />
              </CardHeader>
              <CardContent className="p-0">
                {attendees.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground">
                    Nog geen aanmeldingen.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Naam</TableHead>
                        <TableHead>Bedrijf</TableHead>
                        <TableHead>Aangemeld</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendees.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell>
                            <Link
                              href={{ pathname: `/admin/crm/contacts/${a.contactId}` }}
                              className="font-medium hover:underline"
                            >
                              {[a.firstName, a.lastName].filter(Boolean).join(" ") || a.email}
                            </Link>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {a.company ?? "—"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Intl.DateTimeFormat("nl-NL").format(new Date(a.registeredAt))}
                          </TableCell>
                          <TableCell>
                            <AttendeeStatusSelect
                              attendeeId={a.id}
                              initial={a.status}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {linkedTasks.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Gelinkte taken</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {linkedTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-md border border-border p-2.5 text-sm"
                    >
                      <span>{t.title}</span>
                      <Badge variant="outline">{t.column}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </div>

          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Type</p>
                  <p>{w.type}</p>
                </div>
                {w.priceCents ? (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Prijs</p>
                    <p>€{(w.priceCents / 100).toLocaleString("nl-NL")}</p>
                  </div>
                ) : null}
                {w.capacity ? (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Capaciteit</p>
                    <p>{attendees.length} / {w.capacity}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {cfDefs.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Eigen velden</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {cfDefs.map((cf) => {
                    const v = cfValues[cf.key];
                    return (
                      <div key={cf.id} className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-muted-foreground">
                          {cf.label}
                        </span>
                        <span>
                          {v == null || v === "" ? (
                            <span className="text-muted-foreground/60">—</span>
                          ) : (
                            String(v)
                          )}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ) : null}

            {w.description ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Omschrijving</CardTitle>
                </CardHeader>
                <CardContent className="whitespace-pre-wrap text-sm">
                  {w.description}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </PageBody>
    </>
  );
}
