import Link from "next/link";
import { Target, ArrowUpRight, Circle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type FocusTask = {
  id: string;
  title: string;
  description?: string;
  bucket: string;
};

type UpNext = {
  id: string;
  title: string;
  bucket: string;
  reminderAt: string | null;
};

export function FocusTaskCard({
  focusTask,
  upcoming,
}: {
  focusTask: FocusTask | null;
  upcoming: UpNext[];
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="relative flex flex-row items-start gap-3 px-5 pt-5">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/70 to-transparent" />
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
          <Target className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          {focusTask ? (
            <>
              <p className="text-caption mb-1">Focus vandaag</p>
              <CardTitle className="text-[1.0625rem]">{focusTask.title}</CardTitle>
              {focusTask.description ? (
                <CardDescription className="mt-1">
                  {focusTask.description}
                </CardDescription>
              ) : null}
            </>
          ) : (
            <>
              <p className="text-caption mb-1">Nog geen focus-taak</p>
              <CardTitle className="text-[1.0625rem]">
                Kies wat vandaag écht telt
              </CardTitle>
              <CardDescription className="mt-1">
                Één ding. Zet 'm op focus in de takenlijst.
              </CardDescription>
            </>
          )}
        </div>
      </CardHeader>

      {upcoming.length ? (
        <CardContent className="border-t border-border pt-4 pb-5">
          <p className="text-caption mb-2">Daarna</p>
          <ul className="space-y-1.5">
            {upcoming.map((t) => (
              <li key={t.id} className="flex items-center gap-2.5 text-sm">
                <Circle className="h-3 w-3 shrink-0 text-muted-foreground/60" strokeWidth={1.8} />
                <span className="flex-1 truncate">{t.title}</span>
                {t.reminderAt ? (
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {new Intl.DateTimeFormat("nl-NL", {
                      day: "numeric",
                      month: "short",
                    }).format(new Date(t.reminderAt))}
                  </Badge>
                ) : null}
              </li>
            ))}
          </ul>
        </CardContent>
      ) : null}

      <CardContent className="border-t border-border pt-3 pb-4">
        <Link
          href={{ pathname: "/coach/taken" }}
          className="group flex items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <span>Alle taken</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
