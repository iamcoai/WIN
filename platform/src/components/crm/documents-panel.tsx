"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  Download,
  FileAudio,
  FileVideo,
  File as FileIcon,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { uploadDocument, getDocumentUrl, deleteDocument } from "@/modules/documents/actions";
import { cn } from "@/lib/utils";

type Doc = {
  id: string;
  name: string;
  description: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
};

function iconFor(mime: string | null) {
  if (!mime) return FileIcon;
  if (mime.startsWith("image/")) return ImageIcon;
  if (mime.startsWith("audio/")) return FileAudio;
  if (mime.startsWith("video/")) return FileVideo;
  if (mime === "application/pdf" || mime.startsWith("text/") || mime.includes("document"))
    return FileText;
  return FileIcon;
}

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function DocumentsPanel({
  docs,
  entity,
}: {
  docs: Doc[];
  entity: { contactId?: string; dealId?: string; workshopId?: string };
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, startUpload] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    const fd = new FormData();
    fd.set("file", file);
    if (entity.contactId) fd.set("contactId", entity.contactId);
    if (entity.dealId) fd.set("dealId", entity.dealId);
    if (entity.workshopId) fd.set("workshopId", entity.workshopId);

    startUpload(async () => {
      setError(null);
      const res = await uploadDocument(fd);
      if (!res.ok) {
        setError(res.error);
      } else {
        router.refresh();
      }
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  async function openDoc(id: string) {
    const url = await getDocumentUrl(id);
    if (url) window.open(url, "_blank");
  }

  function onRemove(id: string) {
    if (!window.confirm("Document verwijderen?")) return;
    startUpload(async () => {
      await deleteDocument(id);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Documenten</CardTitle>
            <CardDescription>
              PDF's, audio, foto's — {docs.length}{" "}
              {docs.length === 1 ? "bestand" : "bestanden"}
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {uploading ? "Uploaden…" : "Upload"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="mb-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        ) : null}

        {docs.length === 0 ? (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5",
            )}
          >
            <Upload className="h-5 w-5 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">
              Klik of sleep een bestand — max 50 MB
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {docs.map((d) => {
              const Icon = iconFor(d.mimeType);
              return (
                <div
                  key={d.id}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card/50 px-3 py-2 transition-colors hover:bg-muted/40"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                  </div>
                  <button
                    type="button"
                    onClick={() => openDoc(d.id)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <p className="truncate text-sm font-medium hover:text-primary">
                      {d.name}
                    </p>
                    <p className="text-[0.6875rem] text-muted-foreground tabular-nums">
                      {formatSize(d.sizeBytes)} ·{" "}
                      {new Intl.DateTimeFormat("nl-NL", {
                        day: "numeric",
                        month: "short",
                      }).format(new Date(d.createdAt))}
                    </p>
                  </button>
                  <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => openDoc(d.id)}
                      className="rounded p-1.5 text-muted-foreground/70 hover:bg-muted hover:text-foreground"
                      aria-label="Open"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(d.id)}
                      className="rounded p-1.5 text-muted-foreground/70 hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Verwijder"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
