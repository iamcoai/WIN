import { asc } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { db } from "@/lib/db";
import { availabilityRule, bookingSettings } from "@/lib/db/schema";
import { AvailabilityEditor } from "./availability-editor";

export default async function BeschikbaarheidPage() {
  const [settingsRows, rules] = await Promise.all([
    db.select().from(bookingSettings).limit(1),
    db
      .select()
      .from(availabilityRule)
      .orderBy(asc(availabilityRule.weekday), asc(availabilityRule.startMinute)),
  ]);
  const settings = settingsRows[0];

  return (
    <>
      <PageHeader
        title="Beschikbaarheid"
        description="Wanneer bezoekers een kennismaking kunnen inplannen. Wijzigingen staan direct live op de website."
      />
      <PageBody>
        <AvailabilityEditor
          settings={{
            active: settings.active,
            slotMinutes: settings.slotMinutes,
            bufferMinutes: settings.bufferMinutes,
            minNoticeHours: settings.minNoticeHours,
            maxDaysAhead: settings.maxDaysAhead,
            location: settings.location,
          }}
          rules={rules.map((r) => ({
            id: r.id,
            weekday: r.weekday,
            startMinute: r.startMinute,
            endMinute: r.endMinute,
            active: r.active,
          }))}
        />
      </PageBody>
    </>
  );
}
