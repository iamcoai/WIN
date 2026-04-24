"use client";

import { Button } from "@/components/ui/button";

export function ConnectGoogleButton({
  oauthConfigured,
}: {
  oauthConfigured: boolean;
}) {
  return (
    <Button
      type="button"
      disabled={!oauthConfigured}
      onClick={() => {
        if (!oauthConfigured) {
          window.alert(
            "OAuth nog niet ingesteld. Vraag Chris om GOOGLE_CLIENT_ID/SECRET toe te voegen.",
          );
          return;
        }
        window.location.href = "/api/calendar/google/connect";
      }}
    >
      {oauthConfigured ? "Verbind Google Calendar" : "Nog niet beschikbaar"}
    </Button>
  );
}
