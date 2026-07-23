import { useEffect, useMemo, useRef, useState } from "react";
import type { Dict } from "@/lib/pulse-i18n";
import type { ScenarioData } from "@/lib/scenarios";
import { PulseMark } from "./PulseMark";
import { BackButton } from "./BackButton";

const FINAL_STEP = 14;

export function CognitiveEngine({
  t,
  scenario,
  analysisLoading,
  analysisError,
  onValidate,
  onBack,
}: {
  t: Dict;
  scenario: ScenarioData;
  analysisLoading?: boolean;
  analysisError?: string | null;
  onValidate?: () => void;
  onBack?: () => void;
}) {
  const [step, setStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Only start the animation when data is ready
  useEffect(() => {
    if (analysisLoading) return;

    const schedule = [600, 700, 700, 900, 900, 500, 500, 900, 1400, 900, 1200, 1000, 900, 900];
    let acc = 0;
    schedule.forEach((delay, i) => {
      acc += delay;
      const id = setTimeout(() => setStep(i + 1), acc);
      timers.current.push(id);
    });
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [analysisLoading]);

  const timelineState = useMemo(() => {
    return t.engine.timeline.map((_, i) => {
      if (i <= 2) return "completed" as const;
      if (i === 3) return step >= 4 ? "completed" : "running";
      if (i === 4) return step >= 10 ? "completed" : step >= 4 ? "running" : "pending";
      if (i === 5) return step >= 12 ? "completed" : step >= 10 ? "running" : "pending";
      return "pending" as const;
    });
  }, [step, t.engine.timeline]);

  return (
    <div className="mx-auto max-w-[1240px] px-6 lg:px-10 pt-6 pb-32">
      <div className="mb-6">
        <BackButton t={t} onBack={onBack} />
      </div>

      {analysisError && <AnalysisErrorBanner error={analysisError} />}

      {analysisLoading ? (
        <AnalysisLoading />
      ) : (
        <div className="grid lg:grid-cols-[240px_1fr] gap-14">
          <aside>
            <EngineTimeline t={t} states={timelineState} />
          </aside>

          <div className="min-w-0 flex flex-col gap-20">
            <EngineHeader t={t} />

            <MarketModeling t={t} scenario={scenario} step={step} />

            {step >= 4 && <CompetitiveLandscape t={t} scenario={scenario} step={step} />}

            {step >= 7 && <Benchmark t={t} scenario={scenario} step={step} />}

            {step >= 9 && <FeatureGaps t={t} scenario={scenario} />}

            {step >= 10 && <EvidenceCollection t={t} scenario={scenario} step={step} />}

            {step >= 12 && <ResultsBlock t={t} scenario={scenario} />}

            {step >= 13 && <ConfidenceEngine t={t} scenario={scenario} />}

            {step >= 14 && <PulseConclusion t={t} onValidate={onValidate} />}
          </div>
        </div>
      )}

      {!analysisLoading && <AskPulseFab t={t} visible={step >= FINAL_STEP} />}
    </div>
  );
}

function AnalysisLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 animate-soft-in">
      <PulseMark size={48} />
      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-[22px] font-semibold tracking-tight text-foreground">
          Analyzing market data
        </h3>
        <p className="text-[14px] text-muted-foreground max-w-md">
          Gemini is generating a competitive analysis based on your brief. This may take a few
          seconds.
        </p>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-foreground/40 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function AnalysisErrorBanner({ error }: { error: string }) {
  return (
    <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3 animate-soft-in">
      <svg
        viewBox="0 0 20 20"
        className="h-5 w-5 text-destructive shrink-0 mt-0.5"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      <div className="flex flex-col gap-1">
        <div className="text-[13px] font-medium text-destructive">Gemini API Error</div>
        <div className="text-[12.5px] text-muted-foreground leading-relaxed">
          {error}. Displaying fallback data instead.
        </div>
      </div>
    </div>
  );
}

function EngineHeader({ t }: { t: Dict }) {
  return (
    <div className="animate-soft-in flex flex-col gap-4">
      <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-border bg-surface-elevated/80 pl-2 pr-4 py-1.5">
        <PulseMark size={18} />
        <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-foreground/80">
          {t.engine.badge}
        </span>
      </div>
      <h2 className="text-[34px] sm:text-[42px] leading-[1.05] font-semibold tracking-[-0.02em] text-foreground max-w-3xl">
        <span className="text-shimmer">{t.engine.title}</span>
      </h2>
    </div>
  );
}

function EngineTimeline({
  t,
  states,
}: {
  t: Dict;
  states: Array<"pending" | "running" | "completed">;
}) {
  return (
    <nav
      aria-label={t.timelineLabel}
      className="hidden lg:flex flex-col gap-5 sticky top-24 select-none"
    >
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 font-medium">
        {t.timelineLabel}
      </div>
      <ol className="relative flex flex-col gap-4">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" aria-hidden />
        {t.engine.timeline.map((label, i) => {
          const s = states[i];
          return (
            <li key={label} className="relative flex items-start gap-3">
              <span
                className={[
                  "relative z-10 mt-[3px] flex h-[15px] w-[15px] items-center justify-center rounded-full border transition-all duration-500",
                  s === "completed"
                    ? "bg-foreground border-foreground"
                    : s === "running"
                      ? "bg-background border-foreground"
                      : "bg-background border-border",
                ].join(" ")}
              >
                {s === "completed" ? (
                  <svg viewBox="0 0 10 10" className="h-[8px] w-[8px] text-background" fill="none">
                    <path
                      d="M2 5.2L4.2 7.2L8 3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : s === "running" ? (
                  <span className="h-[6px] w-[6px] rounded-full bg-foreground animate-pulse" />
                ) : null}
              </span>
              <div className="flex flex-col leading-tight">
                <span
                  className={[
                    "text-[10px] tracking-[0.16em] font-medium",
                    s === "pending" ? "text-muted-foreground/40" : "text-muted-foreground/70",
                  ].join(" ")}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={[
                    "text-[13px] font-medium transition-colors",
                    s === "pending" ? "text-muted-foreground/45" : "text-foreground",
                  ].join(" ")}
                >
                  {label}
                </span>
                {s === "running" && (
                  <span className="mt-1 text-[10px] uppercase tracking-[0.14em] text-foreground/60">
                    {t.engine.running}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="animate-soft-in flex flex-col gap-8">
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70 font-medium mb-3">
          {eyebrow}
        </div>
        <h3 className="text-[26px] sm:text-[30px] leading-[1.1] font-semibold tracking-[-0.02em] text-foreground">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function MarketModeling({ t, scenario, step }: { t: Dict; scenario: ScenarioData; step: number }) {
  return (
    <Section eyebrow={t.engine.market.eyebrow} title={t.engine.market.title}>
      <div className="grid sm:grid-cols-2 gap-3">
        {scenario.marketCards.map((c, i) => (
          <RevealCard key={c.label} show={step >= i + 1} delayIndex={i}>
            <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70 font-medium mb-2">
              {c.label}
            </div>
            <div className="text-[15px] font-medium text-foreground leading-snug">{c.value}</div>
          </RevealCard>
        ))}
      </div>

      <div
        className={[
          "rounded-2xl border border-border bg-surface-elevated/70 p-6 transition-all duration-500",
          step >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70 font-medium mb-4">
          {t.engine.market.intentTitle}
        </div>
        <ul className="flex flex-col gap-2.5">
          {scenario.marketIntents.map((line, i) => (
            <li
              key={line}
              className="flex items-center gap-3 text-[14.5px] text-foreground"
              style={{
                animation:
                  step >= 4
                    ? `soft-in 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 140}ms both`
                    : undefined,
              }}
            >
              <CheckDot />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function CompetitiveLandscape({
  t,
  scenario,
  step,
}: {
  t: Dict;
  scenario: ScenarioData;
  step: number;
}) {
  return (
    <Section eyebrow={t.engine.competitive.eyebrow} title={t.engine.competitive.title}>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {scenario.competitors.map((c, i) => (
          <RevealCard key={c} show={step >= 4} delayIndex={i} compact>
            <div className="flex flex-col gap-2">
              <div className="text-[15px] font-semibold tracking-tight text-foreground">{c}</div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground/70">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                {t.engine.competitive.detected}
              </div>
            </div>
          </RevealCard>
        ))}
      </div>

      <div
        className={[
          "rounded-2xl border border-border bg-foreground text-background p-6 flex items-center justify-between transition-all duration-500",
          step >= 6 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-background/60 font-medium mb-1.5">
            {t.engine.competitive.ecosystem}
          </div>
          <div className="text-[18px] font-semibold tracking-tight">
            {t.engine.competitive.completed}
          </div>
        </div>
        <div className="text-[13px] text-background/70">
          {t.engine.competitive.mapped.replace("{n}", String(scenario.competitors.length))}
        </div>
      </div>
    </Section>
  );
}

function Benchmark({ t, scenario, step }: { t: Dict; scenario: ScenarioData; step: number }) {
  const max = Math.max(...scenario.bench.map((b) => b.features));
  const fill = step >= 8;
  const done = step >= 9;

  return (
    <Section eyebrow={t.engine.benchmark.eyebrow} title={t.engine.benchmark.title}>
      <div className="grid grid-cols-5 gap-3">
        {scenario.bench.map((b, i) => {
          const h = (b.features / max) * 100;
          return (
            <RevealCard key={b.name} show delayIndex={i} compact>
              <div className="flex flex-col items-stretch gap-3 h-full">
                <div className="text-[13px] font-medium text-foreground">{b.name}</div>
                <div className="relative h-24 w-full rounded-md bg-surface overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-foreground/85 transition-[height] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ height: step >= 7 ? `${h}%` : "0%" }}
                  />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[20px] font-semibold tabular-nums tracking-tight text-foreground">
                    {b.features}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                    {t.engine.benchmark.features}
                  </span>
                </div>
              </div>
            </RevealCard>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-surface-elevated/70 p-6">
        <div className="grid gap-4">
          {t.engine.benchmark.tracks.map((track, i) => (
            <div key={track} className="flex items-center gap-4">
              <div className="w-52 text-[13px] font-medium text-foreground/85">{track}</div>
              <div className="relative h-[6px] flex-1 rounded-full bg-surface overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-foreground rounded-full transition-[width] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: fill ? "100%" : "0%",
                    transitionDuration: `${1000 + i * 200}ms`,
                    transitionDelay: `${i * 120}ms`,
                  }}
                />
              </div>
              <div className="w-12 text-right text-[11px] tabular-nums text-muted-foreground/70">
                {fill ? "100%" : "0%"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={[
          "text-[13px] font-medium text-foreground/80 flex items-center gap-2 transition-opacity duration-500",
          done ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <CheckDot />
        {t.engine.benchmark.consolidated}
      </div>
    </Section>
  );
}

function FeatureGaps({ t, scenario }: { t: Dict; scenario: ScenarioData }) {
  return (
    <Section eyebrow={t.engine.gaps.eyebrow} title={t.engine.gaps.title}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {t.engine.gaps.items.map((g, i) => (
          <RevealCard key={g.label} show delayIndex={i}>
            <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70 font-medium mb-3">
              {g.label}
            </div>
            <div className="text-[40px] font-semibold tracking-[-0.03em] text-foreground leading-none tabular-nums">
              {scenario.gapValues[i]}
            </div>
            <div className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">{g.desc}</div>
          </RevealCard>
        ))}
      </div>
    </Section>
  );
}

function EvidenceCollection({
  t,
  scenario,
  step,
}: {
  t: Dict;
  scenario: ScenarioData;
  step: number;
}) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (step < 10) return;
    const id = setInterval(() => setTick((tk) => tk + 1), 240);
    return () => clearInterval(id);
  }, [step]);

  return (
    <Section eyebrow={t.engine.evidence.eyebrow} title={t.engine.evidence.title}>
      <div className="flex flex-wrap gap-2">
        {scenario.sources.map((s, i) => {
          const active = tick > i;
          const state =
            t.engine.evidence.states[(i + Math.floor(tick / 3)) % t.engine.evidence.states.length];
          return (
            <div
              key={s}
              className={[
                "group inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12.5px] transition-all duration-500",
                active
                  ? "border-foreground/25 bg-surface-elevated text-foreground"
                  : "border-border bg-surface text-muted-foreground/60",
              ].join(" ")}
              style={{
                animation: `soft-in 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms both`,
              }}
            >
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full transition-all",
                  active ? "bg-foreground" : "bg-border-strong",
                ].join(" ")}
              />
              <span className="font-medium">{s}</span>
              {active && (
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                  {state}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function ResultsBlock({ t, scenario }: { t: Dict; scenario: ScenarioData }) {
  return (
    <section className="animate-soft-in grid grid-cols-2 sm:grid-cols-5 gap-3">
      {scenario.results.map((r, i) => (
        <RevealCard key={r.label} show delayIndex={i} compact>
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70 font-medium mb-2">
            {r.label}
          </div>
          <div className="text-[28px] font-semibold tracking-[-0.02em] text-foreground tabular-nums">
            {r.value}
          </div>
        </RevealCard>
      ))}
    </section>
  );
}

function ConfidenceEngine({ t, scenario }: { t: Dict; scenario: ScenarioData }) {
  const confidencePercent = parseInt(scenario.overallConfidence);
  return (
    <section className="animate-soft-in rounded-2xl border border-border bg-surface-elevated/70 p-8">
      <div className="grid lg:grid-cols-[280px_1fr] gap-10 items-center">
        <div className="flex flex-col items-start gap-2">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 font-medium">
            {t.engine.confidence.overall}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[64px] font-semibold tracking-[-0.03em] text-foreground leading-none tabular-nums">
              {confidencePercent}
            </span>
            <span className="text-[22px] font-medium text-muted-foreground">%</span>
          </div>
          <div className="mt-3 h-[6px] w-full rounded-full bg-surface overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full"
              style={{
                width: `${confidencePercent}%`,
                animation: "soft-in 1.2s cubic-bezier(0.22,1,0.36,1) both",
              }}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {scenario.confidenceItems.map((c, i) => (
            <div
              key={c.label}
              className="rounded-xl border border-border bg-surface p-4 flex items-center justify-between"
              style={{
                animation: `soft-in 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms both`,
              }}
            >
              <span className="text-[12.5px] text-muted-foreground">{c.label}</span>
              <span className="text-[13.5px] font-medium text-foreground">{c.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PulseConclusion({ t, onValidate }: { t: Dict; onValidate?: () => void }) {
  return (
    <section className="animate-soft-in flex flex-col gap-6">
      <div className="rounded-3xl border border-border bg-foreground text-background p-10">
        <div className="flex items-start gap-4">
          <PulseMark size={28} />
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-background/60 font-medium mb-3">
              {t.engine.conclusion.eyebrow}
            </div>
            <h4 className="text-[26px] sm:text-[30px] leading-[1.15] font-semibold tracking-[-0.02em]">
              {t.engine.conclusion.title}
            </h4>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-background/80">
              {t.engine.conclusion.desc}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onValidate}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[13.5px] font-medium text-background transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
        >
          {t.engine.conclusion.cta}
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
        <button className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-6 py-3 text-[13.5px] font-medium text-foreground transition-all duration-300 hover:bg-accent active:scale-[0.98]">
          {t.engine.conclusion.review}
        </button>
      </div>
    </section>
  );
}

function AskPulseFab({ t, visible }: { t: Dict; visible: boolean }) {
  if (!visible) return null;
  return (
    <button
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface-elevated/90 backdrop-blur px-4 py-3 text-[13px] font-medium text-foreground shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-accent active:scale-[0.98] animate-soft-in"
      aria-label={t.engine.ask}
    >
      <PulseMark size={18} />
      {t.engine.ask}
    </button>
  );
}

function CheckDot() {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground">
      <svg viewBox="0 0 10 10" className="h-[8px] w-[8px] text-background" fill="none">
        <path
          d="M2 5.2L4.2 7.2L8 3"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function RevealCard({
  show = true,
  delayIndex = 0,
  compact = false,
  children,
}: {
  show?: boolean;
  delayIndex?: number;
  compact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-border bg-surface-elevated/70 transition-all",
        compact ? "p-4" : "p-5",
      ].join(" ")}
      style={{
        animation: show
          ? `soft-in 0.55s cubic-bezier(0.22,1,0.36,1) ${delayIndex * 120}ms both`
          : undefined,
        opacity: show ? undefined : 0,
      }}
    >
      {children}
    </div>
  );
}
