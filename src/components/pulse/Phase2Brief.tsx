import { useRef } from "react";
import type { Dict } from "@/lib/pulse-i18n";
import { PhaseHeader } from "./PhaseHeader";
import { BackButton } from "./BackButton";

export function Phase2Brief({
  t,
  value,
  onValueChange,
  onContinue,
  onBack,
}: {
  t: Dict;
  value: string;
  onValueChange: (v: string) => void;
  onContinue: (brief: string) => void;
  onBack?: () => void;
}) {
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const pick = (text: string) => {
    onValueChange(text);
    requestAnimationFrame(() => areaRef.current?.focus());
  };

  const showStarters = value.trim().length === 0;

  return (
    <div className="flex flex-col gap-6">
      <BackButton t={t} onBack={onBack} />
      <div className="flex flex-col gap-10">
        <PhaseHeader
          index="02"
          label={t.phases.p02}
          title={t.p2.title}
          subtitle={t.p2.subtitle}
        />

        <div className="animate-soft-in rounded-2xl border border-border bg-card p-2 shadow-[0_1px_0_0_oklch(0.98_0.002_260)] focus-within:border-border-strong transition-colors">
          <textarea
            ref={areaRef}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={t.p2.placeholder}
            rows={6}
            className="w-full resize-none rounded-xl bg-transparent px-5 py-4 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <div className="text-[11px] text-muted-foreground/70 tabular-nums">
              {value.trim().length} {t.p2.chars}
            </div>
            <button
              onClick={() => value.trim() && onContinue(value.trim())}
              disabled={value.trim().length < 8}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[12.5px] font-medium text-background transition-all duration-300 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {t.p2.cta}
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

        <div
          className={[
            "transition-all duration-500",
            showStarters
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-1 pointer-events-none h-0 overflow-hidden",
          ].join(" ")}
          aria-hidden={!showStarters}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70 font-medium">
              {t.p2.starters}
            </div>
            <div className="text-[11px] text-muted-foreground/60">
              {t.p2.startersHint}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {t.p2.opts.map((opt, i) => (
              <button
                key={i}
                onClick={() => pick(opt)}
                className="group text-left rounded-xl border border-border bg-surface-elevated hover:bg-accent hover:border-border-strong transition-all duration-300 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary text-[11px] font-semibold tabular-nums text-secondary-foreground/70 group-hover:bg-foreground group-hover:text-background transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-foreground">
                      {t.p2.optLabels[i]}
                    </div>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                      {opt}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
