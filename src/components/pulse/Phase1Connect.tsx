import { useState } from "react";
import type { Dict } from "@/lib/pulse-i18n";
import { PhaseHeader } from "./PhaseHeader";

type ConnState = "idle" | "connecting" | "connected";

function JiraGlyph() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-background">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2L2 12l4 4 6-6 6 6 4-4L12 2zm0 12l-4 4 4 4 4-4-4-4z" />
      </svg>
    </div>
  );
}

export function Phase1Connect({
  t,
  onContinue,
}: {
  t: Dict;
  onContinue: () => void;
}) {
  const [state, setState] = useState<ConnState>("idle");

  const connect = () => {
    setState("connecting");
    setTimeout(() => setState("connected"), 1600);
  };

  return (
    <div className="flex flex-col gap-10">
      <PhaseHeader
        index="01"
        label={t.phases.p01}
        title={t.p1.title}
        subtitle={t.p1.desc}
      />

      <div className="animate-soft-in rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-[0_1px_0_0_oklch(0.98_0.002_260)]">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <JiraGlyph />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-semibold tracking-tight">
                  {t.p1.jira}
                </h3>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground/70">
                  Recommended
                </span>
              </div>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {t.p1.jiraDesc}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
              {t.p1.status}
            </div>
            <div
              className={[
                "mt-1 inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-500",
                state === "connected"
                  ? "text-success"
                  : state === "connecting"
                  ? "text-foreground/70"
                  : "text-muted-foreground",
              ].join(" ")}
            >
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full transition-colors duration-500",
                  state === "connected"
                    ? "bg-success"
                    : state === "connecting"
                    ? "bg-foreground/50 animate-pulse"
                    : "bg-muted-foreground/40",
                ].join(" ")}
              />
              {state === "connected"
                ? t.p1.connected
                : state === "connecting"
                ? t.p1.connecting
                : t.p1.notConnected}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/70">
          {state === "idle" && (
            <button
              onClick={connect}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
            >
              {t.p1.connect}
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                fill="none"
              >
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {state === "connecting" && (
            <div className="flex items-center gap-3 text-[13px] text-muted-foreground animate-soft-in">
              <span className="flex gap-1">
                <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-foreground/60" style={{ animationDelay: "0ms" }} />
                <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-foreground/60" style={{ animationDelay: "160ms" }} />
                <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-foreground/60" style={{ animationDelay: "320ms" }} />
              </span>
              <span className="text-shimmer">{t.p1.connecting}</span>
            </div>
          )}
          {state === "connected" && (
            <div className="flex items-start gap-3 animate-soft-in">
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-success/15">
                <svg viewBox="0 0 10 10" className="h-3 w-3 text-success" fill="none">
                  <path d="M2 5.2L4.2 7.2L8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[13px] leading-relaxed text-foreground/80 max-w-md">
                {t.p1.connectedDetail}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="animate-soft-in">
        <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70 font-medium mb-3">
          {t.p1.more}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {["Azure DevOps", "GitHub Projects", "Linear", "ClickUp"].map((n) => (
            <div
              key={n}
              className="group rounded-xl border border-border bg-surface/60 px-4 py-3.5 flex flex-col gap-1.5 opacity-70"
            >
              <div className="text-[13px] font-medium text-foreground/70">{n}</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
                {t.p1.soon}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onContinue}
          disabled={state !== "connected"}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition-all duration-300 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {t.p1.continue}
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
