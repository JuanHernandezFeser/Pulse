import { useEffect, useMemo, useRef, useState } from "react";
import type { Dict } from "@/lib/pulse-i18n";
import { PulseMark } from "./PulseMark";
import { BackButton } from "./BackButton";

type Phase =
  | "flow-transition"
  | "flow"
  | "blueprint-transition"
  | "blueprint"
  | "delivery"
  | "final";

export function FlowDelivery({
  t,
  onRestart,
  onBackToEngine,
}: {
  t: Dict;
  onRestart?: () => void;
  onBackToEngine?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("flow-transition");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  return (
    <>
      {phase === "flow-transition" && (
        <Overlay
          badge="PULSE → FLOW"
          lines={t.flow.transitionFlow}
          onDone={() => setPhase("flow")}
        />
      )}

      {phase === "blueprint-transition" && (
        <Overlay
          badge="PULSE Blueprint Engine"
          lines={t.flow.transitionBlueprint}
          onDone={() => setPhase("blueprint")}
        />
      )}

      {phase === "flow" && (
        <FlowValidation
          t={t}
          onGenerate={() => setPhase("blueprint-transition")}
          onBack={onBackToEngine}
        />
      )}

      {phase === "blueprint" && (
        <Blueprint
          t={t}
          onReady={() => setPhase("delivery")}
          onBack={() => setPhase("flow")}
        />
      )}

      {phase === "delivery" && (
        <DeliveryHub
          t={t}
          onFinish={() => setPhase("final")}
          onRestart={onRestart}
          onBack={() => setPhase("blueprint")}
        />
      )}

      {phase === "final" && (
        <FinalScreen t={t} onRestart={onRestart} onBack={() => setPhase("delivery")} />
      )}
    </>
  );
}

function Overlay({
  badge,
  lines,
  onDone,
}: {
  badge: string;
  lines: string[];
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= lines.length - 1) {
      const id = setTimeout(onDone, 1500);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setStep((s) => s + 1), 1700);
    return () => clearTimeout(id);
  }, [step, lines.length, onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl animate-soft-in">
      <div className="scale-[1.6] mb-10">
        <PulseMark size={64} />
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 mb-6">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
        <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-violet-600 dark:text-violet-300">
          {badge}
        </span>
      </div>
      <div className="relative h-8 w-full max-w-md text-center overflow-hidden">
        {lines.map((line, i) => (
          <div
            key={i}
            className="absolute inset-0 flex items-center justify-center transition-all duration-500"
            style={{
              opacity: i === step ? 1 : 0,
              transform: `translateY(${(i - step) * 12}px)`,
            }}
          >
            <span className="text-shimmer text-[16px] font-medium tracking-tight">
              {line}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-10 flex gap-1.5">
        {lines.map((_, i) => (
          <span
            key={i}
            className={[
              "h-1 rounded-full transition-all duration-500",
              i <= step ? "bg-foreground w-6" : "bg-border w-3",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineNav({
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
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function FlowValidation({
  t,
  onGenerate,
  onBack,
}: {
  t: Dict;
  onGenerate: () => void;
  onBack?: () => void;
}) {
  const [step, setStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const schedule = [700, 500, 500, 500, 500, 900, 900, 900, 900];
    let acc = 0;
    schedule.forEach((delay, i) => {
      acc += delay;
      timers.current.push(setTimeout(() => setStep(i + 1), acc));
    });
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const states = useMemo(() => {
    return t.engine.timeline.map((_, i) => {
      if (i <= 5) return "completed" as const;
      if (i === 6) return step >= 9 ? "completed" : "running";
      return "pending" as const;
    });
  }, [step, t.engine.timeline]);

  return (
    <div className="mx-auto max-w-[1240px] px-6 lg:px-10 pt-6 pb-32">
      <div className="mb-6">
        <BackButton t={t} onBack={onBack} />
      </div>
      <div className="grid lg:grid-cols-[240px_1fr] gap-14">
        <aside>
          <TimelineNav t={t} states={states} />
        </aside>
        <div className="min-w-0 flex flex-col gap-20">
          <div className="animate-soft-in flex flex-col gap-4">
            <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-violet-500/30 bg-violet-500/10 pl-2 pr-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-violet-600 dark:text-violet-300">
                {t.flow.badge}
              </span>
            </div>
            <h2 className="text-[34px] sm:text-[42px] leading-[1.05] font-semibold tracking-[-0.02em] text-foreground max-w-3xl">
              <span className="text-shimmer">{t.flow.title}</span>
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-2xl">
              {t.flow.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {t.flow.panels.map((p, i) => (
              <div
                key={p.label}
                className={[
                  "rounded-2xl border border-border bg-surface-elevated/60 p-5 transition-all duration-700",
                  step > i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
                ].join(" ")}
              >
                <div className="text-[28px] font-semibold tracking-tight text-foreground">
                  {p.value}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
                  {p.label}
                </div>
              </div>
            ))}
          </div>

          {step >= 5 && (
            <section className="flex flex-col gap-6 animate-soft-in">
              <SectionTitle overline={t.flow.evidenceOverline} title={t.flow.evidenceTitle} />
              <div className="grid md:grid-cols-2 gap-4">
                <EvidenceCard
                  t={t}
                  title={t.flow.cases[0].title}
                  status="validated"
                  confidence="94%"
                  evidence={t.flow.cases[0].evidence}
                />
                <EvidenceCard
                  t={t}
                  title={t.flow.cases[1].title}
                  status="rejected"
                  confidence="18%"
                  evidence={t.flow.cases[1].evidence}
                  reason={t.flow.cases[1].reason}
                />
              </div>
            </section>
          )}

          {step >= 6 && (
            <section className="flex flex-col gap-6 animate-soft-in">
              <SectionTitle overline={t.flow.matrixOverline} title={t.flow.matrixTitle} />
              <div className="grid md:grid-cols-3 gap-4">
                {t.flow.matrix.map((m, i) => (
                  <MatrixCard
                    key={m.opportunity}
                    t={t}
                    opportunity={m.opportunity}
                    value={m.value}
                    confidence={m.confidence}
                    complexity={m.complexity}
                    status={i < 2 ? "validated" : "rejected"}
                    reason={m.reason}
                  />
                ))}
              </div>
            </section>
          )}

          {step >= 7 && (
            <section className="animate-soft-in">
              <div className="rounded-3xl border border-border bg-surface-elevated/60 p-8 md:p-10">
                <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
                  <div className="flex flex-col gap-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 font-medium">
                      {t.flow.confidenceEngine}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {t.flow.confidenceMini.map((m) => (
                        <MiniStat key={m.label} label={m.label} value={m.value} />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:items-end gap-1">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70 font-medium">
                      {t.flow.overallConfidence}
                    </div>
                    <div className="text-[56px] leading-none font-semibold tracking-tight text-foreground">
                      94%
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {step >= 8 && (
            <section className="animate-soft-in">
              <SectionTitle overline={t.flow.executiveOverline} title={t.flow.executiveTitle} />
              <div className="mt-6 relative overflow-hidden rounded-3xl border border-border bg-foreground text-background p-8 md:p-12">
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" aria-hidden />
                <div className="relative flex flex-col gap-6">
                  <div className="inline-flex items-center gap-2 self-start rounded-full border border-background/20 bg-background/10 px-3 py-1">
                    <PulseMark size={14} />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-background/80">
                      {t.flow.recommendationBadge}
                    </span>
                  </div>
                  <h3 className="text-[28px] sm:text-[34px] leading-[1.1] font-semibold tracking-[-0.02em] max-w-3xl">
                    {t.flow.recommendationTitle}
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-[14px] text-background/80">
                    {t.flow.reasons.map((r) => (
                      <li key={r} className="flex items-start gap-2">
                        <span className="mt-[7px] h-1 w-1 rounded-full bg-background/70" />
                        {r}
                      </li>
                    ))}
                  </ul>
                  {step >= 9 && (
                    <button
                      onClick={onGenerate}
                      className="mt-4 self-start inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-[14px] font-medium tracking-tight hover:opacity-90 transition-opacity animate-soft-in"
                    >
                      {t.flow.generateBlueprint}
                      <span aria-hidden>→</span>
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ overline, title }: { overline: string; title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 font-medium">
        {overline}
      </div>
      <h3 className="text-[24px] sm:text-[28px] leading-tight font-semibold tracking-[-0.015em] text-foreground max-w-3xl">
        {title}
      </h3>
    </div>
  );
}

function EvidenceCard({
  t,
  title,
  status,
  confidence,
  evidence,
  reason,
}: {
  t: Dict;
  title: string;
  status: "validated" | "rejected";
  confidence: string;
  evidence: string;
  reason?: string;
}) {
  const isValid = status === "validated";
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated/60 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[17px] font-semibold tracking-tight text-foreground">{title}</h4>
        <span
          className={[
            "text-[10px] uppercase tracking-[0.16em] font-medium px-2.5 py-1 rounded-full border",
            isValid
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
          ].join(" ")}
        >
          {isValid ? t.flow.validated : t.flow.rejected}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <MiniStat label={t.flow.confidenceLabel} value={confidence} />
        <MiniStat label={reason ? t.flow.reasonLabel : t.flow.evidenceLabel} value={reason ?? t.flow.verified} />
      </div>
      <p className="text-[13px] text-muted-foreground leading-relaxed">{evidence}</p>
    </div>
  );
}

function MatrixCard({
  t,
  opportunity,
  value,
  confidence,
  complexity,
  status,
  reason,
}: {
  t: Dict;
  opportunity: string;
  value: string;
  confidence: string;
  complexity: string;
  status: "validated" | "rejected";
  reason?: string;
}) {
  const isValid = status === "validated";
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated/60 p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-[15px] font-semibold tracking-tight text-foreground">{opportunity}</h4>
        <span
          className={[
            "text-[10px] uppercase tracking-[0.16em] font-medium px-2 py-0.5 rounded-full border shrink-0",
            isValid
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
          ].join(" ")}
        >
          {isValid ? t.flow.validated : t.flow.rejected}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-[12px]">
        <Row label={t.flow.businessValue} value={value} />
        <Row label={t.flow.confidenceLabel} value={confidence} />
        <Row label={t.flow.complexityLabel} value={complexity} />
        {reason && <Row label={t.flow.reasonLabel} value={reason} />}
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">{label}</dt>
      <dd className="text-[13px] font-medium text-foreground">{value}</dd>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">{label}</div>
      <div className="text-[15px] font-medium text-foreground tracking-tight">{value}</div>
    </div>
  );
}

function Blueprint({
  t,
  onReady,
  onBack,
}: {
  t: Dict;
  onReady: () => void;
  onBack?: () => void;
}) {
  const [revealed, setRevealed] = useState(0);
  const [ready, setReady] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    let acc = 0;
    t.blueprint.modules.forEach((_, i) => {
      acc += 380;
      timers.current.push(setTimeout(() => setRevealed(i + 1), acc));
    });
    timers.current.push(setTimeout(() => setReady(true), acc + 600));
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [t.blueprint.modules]);

  const states = useMemo(
    () =>
      t.engine.timeline.map((_, i) => {
        if (i <= 7) return "completed" as const;
        if (i === 8) return ready ? "completed" : "running";
        return "pending" as const;
      }),
    [ready, t.engine.timeline]
  );

  return (
    <div className="mx-auto max-w-[1240px] px-6 lg:px-10 pt-6 pb-32">
      <div className="mb-6">
        <BackButton t={t} onBack={onBack} />
      </div>
      <div className="grid lg:grid-cols-[240px_1fr] gap-14">
        <aside>
          <TimelineNav t={t} states={states} />
        </aside>
        <div className="min-w-0 flex flex-col gap-20">
          <div className="animate-soft-in flex flex-col gap-4">
            <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-border bg-surface-elevated/80 pl-2 pr-4 py-1.5">
              <PulseMark size={18} />
              <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-foreground/80">
                {t.blueprint.badge}
              </span>
            </div>
            <h2 className="text-[34px] sm:text-[42px] leading-[1.05] font-semibold tracking-[-0.02em] text-foreground max-w-3xl">
              <span className="text-shimmer">{t.blueprint.title}</span>
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-2xl">
              {t.blueprint.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {t.blueprint.modules.map((m, i) => (
              <div
                key={m.title}
                className={[
                  "rounded-2xl border border-border bg-surface-elevated/60 p-5 flex items-start gap-4 transition-all duration-500",
                  revealed > i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
                ].join(" ")}
              >
                <div className="mt-0.5 h-7 w-7 rounded-full border border-border bg-background flex items-center justify-center text-[10px] font-medium text-muted-foreground shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="text-[14px] font-semibold tracking-tight text-foreground">
                    {m.title}
                  </div>
                  <div className="text-[12px] text-muted-foreground leading-relaxed">
                    {m.detail}
                  </div>
                </div>
                {revealed > i && (
                  <span className="ml-auto text-[10px] uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400 shrink-0">
                    {t.blueprint.ready}
                  </span>
                )}
              </div>
            ))}
          </div>

          {ready && (
            <section className="animate-soft-in flex flex-col gap-8">
              <div className="rounded-3xl border border-border bg-foreground text-background p-8 md:p-10 relative overflow-hidden">
                <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" aria-hidden />
                <div className="relative flex flex-col md:flex-row md:items-center gap-6 justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-background/60 font-medium mb-2">
                      {t.blueprint.packageEyebrow}
                    </div>
                    <h3 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em]">
                      {t.blueprint.packageTitle}
                    </h3>
                    <p className="text-[14px] text-background/70 mt-2 max-w-xl">
                      {t.blueprint.packageDesc}
                    </p>
                  </div>
                  <button
                    onClick={onReady}
                    className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-[14px] font-medium tracking-tight hover:opacity-90 transition-opacity"
                  >
                    {t.blueprint.openDelivery}
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </div>

              <div>
                <SectionTitle overline={t.blueprint.artifactsOverline} title={t.blueprint.artifactsTitle} />
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {t.blueprint.artifacts.map((a, i) => (
                    <div
                      key={a}
                      className="group rounded-2xl border border-border bg-surface-elevated/60 p-5 flex items-center gap-3 hover:border-foreground/40 transition-colors"
                    >
                      <ArtifactIcon index={i} />
                      <div className="text-[13px] font-medium tracking-tight text-foreground">
                        {a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function ArtifactIcon({ index }: { index: number }) {
  const icons = [
    "M4 5h12M4 9h12M4 13h8",
    "M4 4h12v12H4z M4 8h12 M8 4v12",
    "M4 4h12v12H4z M4 8h12",
    "M4 14L8 8l3 3 5-6",
    "M4 5h12v3H4z M4 10h12v3H4z",
    "M5 4h10v12H5z M5 8h10",
    "M4 6h12M4 10h12M4 14h8",
    "M4 4h12v12H4z M8 8l4 4M12 8l-4 4",
    "M4 14a6 6 0 0112 0",
    "M10 4a6 6 0 100 12 6 6 0 000-12z M10 4v12",
    "M6 3h8v14H6z M6 7h8 M6 11h8",
  ];
  return (
    <div className="h-9 w-9 rounded-xl border border-border bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d={icons[index % icons.length]} />
      </svg>
    </div>
  );
}

function DeliveryHub({
  t,
  onFinish,
  onRestart,
  onBack,
}: {
  t: Dict;
  onFinish: () => void;
  onRestart?: () => void;
  onBack?: () => void;
}) {
  const [jiraStep, setJiraStep] = useState<number>(-1);
  const [pdfState, setPdfState] = useState<"idle" | "generating" | "done">("idle");
  const jiraTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const states = useMemo(
    () =>
      t.engine.timeline.map((_, i) => {
        if (i <= 8) return "completed" as const;
        if (i === 9) return "running" as const;
        return "pending" as const;
      }),
    [t.engine.timeline]
  );

  const jiraLines = t.delivery.jira.lines;

  const publishJira = () => {
    if (jiraStep >= 0) return;
    setJiraStep(0);
    let acc = 0;
    jiraLines.forEach((_, i) => {
      acc += 900;
      jiraTimers.current.push(setTimeout(() => setJiraStep(i + 1), acc));
    });
  };

  const generatePdf = () => {
    if (pdfState !== "idle") return;
    setPdfState("generating");
    setTimeout(() => {
      const pdf = buildExecutivePdf(t);
      const blob = new Blob([pdf], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "PULSE-Executive-Report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setPdfState("done");
    }, 2200);
  };

  useEffect(() => () => jiraTimers.current.forEach(clearTimeout), []);

  return (
    <div className="mx-auto max-w-[1240px] px-6 lg:px-10 pt-6 pb-32">
      <div className="mb-6">
        <BackButton t={t} onBack={onBack} />
      </div>
      <div className="grid lg:grid-cols-[240px_1fr] gap-14">
        <aside>
          <TimelineNav t={t} states={states} />
        </aside>

        <div className="min-w-0 flex flex-col gap-16">
          <div className="animate-soft-in flex flex-col gap-4">
            <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-border bg-surface-elevated/80 pl-2 pr-4 py-1.5">
              <PulseMark size={18} />
              <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-foreground/80">
                {t.delivery.badge}
              </span>
            </div>
            <h2 className="text-[34px] sm:text-[42px] leading-[1.05] font-semibold tracking-[-0.02em] text-foreground max-w-3xl">
              <span className="text-shimmer">{t.delivery.title}</span>
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-2xl">
              {t.delivery.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ActionCard
              t={t}
              title={t.delivery.jira.title}
              subtitle={t.delivery.jira.subtitle}
              accent
              onClick={publishJira}
              disabled={jiraStep >= 0}
              running={jiraStep >= 0 && jiraStep < jiraLines.length}
              done={jiraStep >= jiraLines.length}
              cta={jiraStep >= jiraLines.length ? t.delivery.jira.published : jiraStep >= 0 ? t.delivery.jira.publishing : t.delivery.jira.publish}
            >
              {jiraStep >= 0 && (
                <div className="mt-5 flex flex-col gap-1.5">
                  {jiraLines.map((l, i) => (
                    <div
                      key={l}
                      className={[
                        "flex items-center gap-2 text-[12px] transition-all duration-500",
                        jiraStep > i ? "opacity-100" : "opacity-30",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "h-3.5 w-3.5 rounded-full border flex items-center justify-center",
                          jiraStep > i
                            ? "bg-emerald-500 border-emerald-500 text-background"
                            : jiraStep === i
                            ? "border-foreground"
                            : "border-border",
                        ].join(" ")}
                      >
                        {jiraStep > i ? (
                          <svg viewBox="0 0 10 10" className="h-2 w-2" fill="none">
                            <path d="M2 5.2L4.2 7.2L8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : jiraStep === i ? (
                          <span className="h-1 w-1 rounded-full bg-foreground animate-pulse" />
                        ) : null}
                      </span>
                      <span className="text-foreground/85">{l}</span>
                    </div>
                  ))}
                </div>
              )}
            </ActionCard>

            <ActionCard
              t={t}
              title={t.delivery.pdf.title}
              subtitle={t.delivery.pdf.subtitle}
              onClick={generatePdf}
              disabled={pdfState !== "idle"}
              running={pdfState === "generating"}
              done={pdfState === "done"}
              cta={pdfState === "done" ? t.delivery.pdf.done : pdfState === "generating" ? t.delivery.pdf.generating : t.delivery.pdf.generate}
            >
              {pdfState !== "idle" && (
                <div className="mt-5 text-[12px] text-muted-foreground flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />
                  {pdfState === "generating" ? t.delivery.pdf.composing : t.delivery.pdf.delivered}
                </div>
              )}
            </ActionCard>

            <ActionCard
              t={t}
              title={t.delivery.pkg.title}
              subtitle={t.delivery.pkg.subtitle}
              cta={t.delivery.pkg.cta}
              onClick={() => {
                const blob = new Blob([JSON.stringify({ package: "PULSE Engineering Package", artifacts: t.blueprint.artifacts }, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "PULSE-Engineering-Package.json";
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              }}
            />

            <ActionCard
              t={t}
              title={t.delivery.review.title}
              subtitle={t.delivery.review.subtitle}
              cta={t.delivery.review.cta}
              onClick={onFinish}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-border bg-surface-elevated/60 p-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 font-medium mb-1">
                {t.delivery.wrapEyebrow}
              </div>
              <div className="text-[16px] font-semibold tracking-tight text-foreground">
                {t.delivery.wrapTitle}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onFinish}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background text-foreground px-5 py-2.5 text-[13px] font-medium hover:border-foreground/40 transition-colors"
              >
                {t.delivery.wrapUp}
              </button>
              <button
                onClick={onRestart}
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-[13px] font-medium hover:opacity-90 transition-opacity"
              >
                {t.delivery.newAnalysis}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  t,
  title,
  subtitle,
  cta,
  onClick,
  disabled,
  running,
  done,
  accent,
  children,
}: {
  t: Dict;
  title: string;
  subtitle: string;
  cta?: string;
  onClick?: () => void;
  disabled?: boolean;
  running?: boolean;
  done?: boolean;
  accent?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-6 md:p-7 flex flex-col gap-3 transition-colors",
        accent
          ? "border-foreground/20 bg-surface-elevated"
          : "border-border bg-surface-elevated/60 hover:border-foreground/30",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="text-[17px] font-semibold tracking-tight text-foreground">{title}</div>
          <div className="text-[13px] text-muted-foreground leading-relaxed">{subtitle}</div>
        </div>
        {done && (
          <span className="shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {t.delivery.doneLabel}
          </span>
        )}
      </div>
      {cta && (
        <button
          onClick={onClick}
          disabled={disabled}
          className={[
            "self-start mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium tracking-tight transition-all",
            done
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              : running
              ? "bg-foreground/90 text-background opacity-80"
              : "bg-foreground text-background hover:opacity-90",
            disabled && !running ? "cursor-not-allowed" : "",
          ].join(" ")}
        >
          {running && <span className="h-1.5 w-1.5 rounded-full bg-background animate-pulse" />}
          {cta}
        </button>
      )}
      {children}
    </div>
  );
}

function FinalScreen({
  t,
  onRestart,
  onBack,
}: {
  t: Dict;
  onRestart?: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="mx-auto max-w-[1240px] px-6 lg:px-10 pt-6 pb-32">
      <div className="mb-6">
        <BackButton t={t} onBack={onBack} />
      </div>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-soft-in">
        <div className="scale-[1.4] mb-10">
          <PulseMark size={64} />
        </div>
        <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70 font-medium mb-6">
          {t.final.eyebrow}
        </div>
        <h2 className="text-[42px] sm:text-[56px] leading-[1.02] font-semibold tracking-[-0.025em] text-foreground max-w-3xl">
          <span className="text-shimmer">{t.final.title}</span>
        </h2>
        <p className="mt-6 max-w-xl text-[16px] text-muted-foreground leading-relaxed">
          {t.final.desc}
        </p>
        <button
          onClick={onRestart}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-[14px] font-medium tracking-tight hover:opacity-90 transition-opacity"
        >
          {t.final.cta}
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

function buildExecutivePdf(t: Dict): string {
  const lines = [
    t.pdf.heading,
    "",
    t.pdf.s1,
    t.pdf.s1body,
    "",
    t.pdf.s2,
    t.pdf.s2body,
    "",
    t.pdf.s3,
    t.pdf.s3a,
    t.pdf.s3b,
    t.pdf.s3c,
    "",
    t.pdf.s4,
    t.pdf.s4body,
    "",
    t.pdf.s5,
    t.pdf.s5body,
  ];

  const header = "%PDF-1.4\n";
  const objects: string[] = [];
  const addObj = (body: string) => {
    objects.push(body);
    return objects.length;
  };

  const contentStream =
    "BT\n/F1 14 Tf\n72 780 Td\n" +
    lines
      .map((l, i) =>
        i === 0
          ? `(${escapePdf(l)}) Tj\n0 -28 Td\n`
          : `(${escapePdf(l)}) Tj\n0 -18 Td\n`
      )
      .join("") +
    "ET";

  addObj("<< /Type /Catalog /Pages 2 0 R >>");
  addObj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  addObj(
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>"
  );
  addObj(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`);
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let output = header;
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(output.length);
    output += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefStart = output.length;
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => {
    output += `${o.toString().padStart(10, "0")} 00000 n \n`;
  });
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return output;
}

function escapePdf(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
