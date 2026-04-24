"use client";

import { useState, useEffect, useRef } from "react";
import { Sun, Play, Pause, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MorningRitual({ ritualDone }: { ritualDone: boolean }) {
  const [seconds, setSeconds] = useState(600); // 10 min default
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (seconds === 0 && running) {
      setRunning(false);
    }
  }, [seconds, running]);

  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  const total = 600;
  const pct = ((total - seconds) / total) * 100;

  const label = ritualDone ? "Ritueel voltooid — dank voor je aandacht" : "Begin je ochtend bewust";

  return (
    <Card className="h-full">
      <CardHeader className="px-5 pt-5 pb-2">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
              ritualDone
                ? "bg-success/15 text-success"
                : "bg-primary/12 text-primary",
            )}
          >
            <Sun className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-caption mb-0.5">Ochtend-ritueel</p>
            <CardTitle className="text-[1.0625rem]">{label}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {/* Timer circle */}
        <div className="relative mx-auto mb-3 flex h-32 w-32 items-center justify-center">
          <svg
            className="absolute inset-0 -rotate-90"
            viewBox="0 0 100 100"
            aria-hidden
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.5s linear" }}
            />
          </svg>
          <span className="relative font-heading text-2xl font-semibold tabular-nums">
            {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2">
          {running ? (
            <Button
              type="button"
              onClick={() => setRunning(false)}
              variant="outline"
              size="sm"
            >
              <Pause className="h-3.5 w-3.5" /> Pauzeren
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setRunning(true)}
              size="sm"
              disabled={seconds === 0}
            >
              <Play className="h-3.5 w-3.5" />
              {seconds === total ? "Start 10 min" : "Doorgaan"}
            </Button>
          )}
          <Button
            type="button"
            onClick={() => {
              setRunning(false);
              setSeconds(600);
            }}
            variant="ghost"
            size="sm"
            aria-label="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
