import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NoAccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Geen actieve inschrijving</CardTitle>
          <CardDescription>
            We hebben voor jouw account nog geen actieve inschrijving gevonden.
            Als je net betaald hebt: geef het systeem een paar minuten om te
            synchroniseren. Voor vragen: mail Reza of je coach.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link
            href="https://www.win.nl/aanbod"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Bekijk het aanbod
          </Link>
          <form action="/api/auth/sign-out" method="post">
            <Button type="submit" variant="ghost" className="w-full">
              Uitloggen
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
