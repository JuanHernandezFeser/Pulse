import { useEffect, useMemo, useRef, useState } from "react";
import { PulseMark } from "./PulseMark";

const TIMELINE = [
  "Workspace",
  "Brief",
  "Context",
  "Market Modeling",
  "Competitive Intelligence",
  "Evidence Collection",
  "FLOW Validation",
  "Executive Decision",
  "Blueprint",
  "Delivery",
] as const;

type Phase =
  | "flow-transition"
  | "flow"
  | "blueprint-transition"
  | "blueprint"
  | "delivery"
  | "final";

export function FlowDelivery({ onRestart }: { onRestart?: () => void }) {
  const [phase, setPhase] = useState<Phase>("flow-transition");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  return (
    <>
      {phase === "flow-transition" && (
        <Overlay
          badge="PULSE → FLOW"
          lines={[
            "Transferring cognitive model...",
            "FLOW Validation Engine Activated",
          ]}
          onDone={() => setPhase("flow")}
        />
      )}

      {phase === "blueprint-transition" && (
        <Overlay
          badge="PULSE Blueprint Engine"
          lines={[
            "Consolidating validated intelligence...",
            "Generating engineering assets...",
          ]}
          onDone={() => setPhase("blueprint")}
        />
      )}

      {phase === "flow" && (
        <FlowValidation onGenerate={() => setPhase("blueprint-transition")} />
      )}

      {phase === "blueprint" && (
        <Blueprint onReady={() => setPhase("delivery")} />
      )}

      {phase === "delivery" && (
        <DeliveryHub onFinish={() => setPhase("final")} onRestart={onRestart} />
      )}

      {phase === "final" && <FinalScreen onRestart={onRestart} />}
    </>
  );
}

/* --------------------------- Overlay --------------------------- */

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

/* --------------------------- Timeline (reused shape) --------------------------- */

function TimelineNav({
  states,
}: {
  states: Array<"pending" | "running" | "completed">;
}) {
  return (
    <nav
      aria-label="Cognitive Process"
      className="hidden lg:flex flex-col gap-5 sticky top-24 select-none"
    >
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 font-medium">
        Cognitive Process
      </div>
      <ol className="relative flex flex-col gap-4">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" aria-hidden />
        {TIMELINE.map((label, i) => {
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

/* --------------------------- FLOW Validation --------------------------- */

function FlowValidation({ onGenerate }: { onGenerate: () => void }) {
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
    return TIMELINE.map((_, i) => {
      if (i <= 5) return "completed" as const;
      if (i === 6) return step >= 9 ? "completed" : "running";
      return "pending" as const;
    });
  }, [step]);

  const panels = [
    { label: "Market Signals", value: "326" },
    { label: "Evidence Sources", value: "148" },
    { label: "Validated Opportunities", value: "12" },
    { label: "Rejected Opportunities", value: "4" },
    { label: "Validation In Progress", value: "7" },
  ];

  return (
    <div className="mx-auto max-w-[1240px] px-6 lg:px-10 pt-14 pb-32">
      <div className="grid lg:grid-cols-[240px_1fr] gap-14">
        <aside>
          <TimelineNav states={states} />
        </aside>
        <div className="min-w-0 flex flex-col gap-20">
          {/* Header */}
          <div className="animate-soft-in flex flex-col gap-4">
            <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-violet-500/30 bg-violet-500/10 pl-2 pr-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-violet-600 dark:text-violet-300">
                FLOW · Market Validation Engine
              </span>
            </div>
            <h2 className="text-[34px] sm:text-[42px] leading-[1.05] font-semibold tracking-[-0.02em] text-foreground max-w-3xl">
              <span className="text-shimmer">Evidence Validation</span>
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-2xl">
              Validating real market demand before recommending engineering investment.
            </p>
          </div>

          {/* Validation Panels */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {panels.map((p, i) => (
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

          {/* Evidence cases */}
          {step >= 5 && (
            <section className="flex flex-col gap-6 animate-soft-in">
              <SectionTitle overline="Evidence Cases" title="What FLOW validated — and what it rejected" />
              <div className="grid md:grid-cols-2 gap-4">
                <EvidenceCard
                  title="AI Recruiting Assistant"
                  status="validated"
                  confidence="94%"
                  evidence="126 verified public mentions across Gartner, GitHub, Reddit and industry reports."
                />
                <EvidenceCard
                  title="Offline Candidate Ranking"
                  status="rejected"
                  confidence="18%"
                  evidence="Only 4 public mentions. Insufficient market validation."
                  reason="Insufficient market validation"
                />
              </div>
            </section>
          )}

          {/* Matrix */}
          {step >= 6 && (
            <section className="flex flex-col gap-6 animate-soft-in">
              <SectionTitle overline="Validation Matrix" title="Opportunities ranked by validated business impact" />
              <div className="grid md:grid-cols-3 gap-4">
                <MatrixCard
                  opportunity="AI Candidate Ranking"
                  value="Very High"
                  confidence="94%"
                  complexity="Medium"
                  status="validated"
                />
                <MatrixCard
                  opportunity="Predictive Talent Scoring"
                  value="High"
                  confidence="91%"
                  complexity="Medium"
                  status="validated"
                />
                <MatrixCard
                  opportunity="Offline Recruiting Mode"
                  value="Low"
                  confidence="18%"
                  complexity="High"
                  status="rejected"
                  reason="Weak evidence"
                />
              </div>
            </section>
          )}

          {/* Confidence */}
          {step >= 7 && (
            <section className="animate-soft-in">
              <div className="rounded-3xl border border-border bg-surface-elevated/60 p-8 md:p-10">
                <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
                  <div className="flex flex-col gap-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 font-medium">
                      Confidence Engine
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <MiniStat label="Evidence Quality" value="Verified" />
                      <MiniStat label="Market Coverage" value="Excellent" />
                      <MiniStat label="Benchmark Reliability" value="95%" />
                      <MiniStat label="Strategic Priority" value="High" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:items-end gap-1">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70 font-medium">
                      Overall Confidence
                    </div>
                    <div className="text-[56px] leading-none font-semibold tracking-tight text-foreground">
                      94%
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Executive Recommendation */}
          {step >= 8 && (
            <section className="animate-soft-in">
              <SectionTitle overline="Executive Decision" title="Executive Recommendation" />
              <div className="mt-6 relative overflow-hidden rounded-3xl border border-border bg-foreground text-background p-8 md:p-12">
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" aria-hidden />
                <div className="relative flex flex-col gap-6">
                  <div className="inline-flex items-center gap-2 self-start rounded-full border border-background/20 bg-background/10 px-3 py-1">
                    <PulseMark size={14} />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-background/80">
                      PULSE Recommendation
                    </span>
                  </div>
                  <h3 className="text-[28px] sm:text-[34px] leading-[1.1] font-semibold tracking-[-0.02em] max-w-3xl">
                    Prioritize AI-assisted candidate matching before redesigning the recruiting workflow.
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-[14px] text-background/80">
                    {[
                      "Highest validated business impact",
                      "Strong public demand",
                      "Competitive differentiation",
                      "Engineering feasibility",
                      "Validated by FLOW",
                    ].map((r) => (
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
                      Generate Engineering Blueprint
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
  title,
  status,
  confidence,
  evidence,
  reason,
}: {
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
          {isValid ? "Validated" : "Rejected"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <MiniStat label="Confidence" value={confidence} />
        <MiniStat label={reason ? "Reason" : "Evidence"} value={reason ?? "Verified"} />
      </div>
      <p className="text-[13px] text-muted-foreground leading-relaxed">{evidence}</p>
    </div>
  );
}

function MatrixCard({
  opportunity,
  value,
  confidence,
  complexity,
  status,
  reason,
}: {
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
          {isValid ? "Validated" : "Rejected"}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-[12px]">
        <Row label="Business Value" value={value} />
        <Row label="Confidence" value={confidence} />
        <Row label="Complexity" value={complexity} />
        {reason && <Row label="Reason" value={reason} />}
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

/* --------------------------- Blueprint --------------------------- */

const BLUEPRINT_MODULES = [
  { title: "Strategic Summary", detail: "Executive narrative connecting market signals to the recommended bet." },
  { title: "Functional Specification", detail: "End-to-end product behavior described in enterprise language." },
  { title: "Business Requirements", detail: "Outcomes and constraints owned by product leadership." },
  { title: "Functional Requirements", detail: "Precise capability contracts for engineering." },
  { title: "Acceptance Criteria", detail: "Verifiable outcomes for each capability." },
  { title: "Implementation Roadmap", detail: "Phased plan aligned to validated business impact." },
  { title: "Epics", detail: "Structured investment blocks ready for backlog." },
  { title: "Features", detail: "Slices scoped for measurable value." },
  { title: "User Stories", detail: "Contextualized workflows with actor and outcome." },
  { title: "Technical Tasks", detail: "Engineering breakdown per feature." },
  { title: "Dependencies", detail: "Cross-team and platform prerequisites." },
  { title: "Business Risks", detail: "Adoption, market and revenue exposure." },
  { title: "Technical Risks", detail: "Architectural and delivery exposure." },
  { title: "Expected Business Impact", detail: "Quantified outcome model at 6, 12 and 18 months." },
];

const ARTIFACTS = [
  "Executive Report",
  "Engineering Blueprint",
  "Functional Specification",
  "Product Roadmap",
  "Epics",
  "Stories",
  "Tasks",
  "Evidence Report",
  "Benchmark Report",
  "Validation Report",
  "Jira Package",
];

function Blueprint({ onReady }: { onReady: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const [ready, setReady] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    let acc = 0;
    BLUEPRINT_MODULES.forEach((_, i) => {
      acc += 380;
      timers.current.push(setTimeout(() => setRevealed(i + 1), acc));
    });
    timers.current.push(setTimeout(() => setReady(true), acc + 600));
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const states = useMemo(
    () =>
      TIMELINE.map((_, i) => {
        if (i <= 7) return "completed" as const;
        if (i === 8) return ready ? "completed" : "running";
        return "pending" as const;
      }),
    [ready]
  );

  return (
    <div className="mx-auto max-w-[1240px] px-6 lg:px-10 pt-14 pb-32">
      <div className="grid lg:grid-cols-[240px_1fr] gap-14">
        <aside>
          <TimelineNav states={states} />
        </aside>
        <div className="min-w-0 flex flex-col gap-20">
          <div className="animate-soft-in flex flex-col gap-4">
            <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-border bg-surface-elevated/80 pl-2 pr-4 py-1.5">
              <PulseMark size={18} />
              <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-foreground/80">
                PULSE · Blueprint Engine
              </span>
            </div>
            <h2 className="text-[34px] sm:text-[42px] leading-[1.05] font-semibold tracking-[-0.02em] text-foreground max-w-3xl">
              <span className="text-shimmer">Engineering Blueprint</span>
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-2xl">
              PULSE is composing the enterprise-ready blueprint from the validated intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {BLUEPRINT_MODULES.map((m, i) => (
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
                    Ready
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
                      Engineering Package
                    </div>
                    <h3 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em]">
                      Engineering Package Ready
                    </h3>
                    <p className="text-[14px] text-background/70 mt-2 max-w-xl">
                      A complete, validated and executable strategic package generated end-to-end.
                    </p>
                  </div>
                  <button
                    onClick={onReady}
                    className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-[14px] font-medium tracking-tight hover:opacity-90 transition-opacity"
                  >
                    Open Delivery Hub
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </div>

              <div>
                <SectionTitle overline="Artifacts" title="Generated by PULSE" />
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {ARTIFACTS.map((a, i) => (
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

/* --------------------------- Delivery Hub --------------------------- */

function DeliveryHub({
  onFinish,
  onRestart,
}: {
  onFinish: () => void;
  onRestart?: () => void;
}) {
  const [jiraStep, setJiraStep] = useState<number>(-1);
  const [pdfState, setPdfState] = useState<"idle" | "generating" | "done">("idle");
  const jiraTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const states = useMemo(
    () =>
      TIMELINE.map((_, i) => {
        if (i <= 8) return "completed" as const;
        if (i === 9) return "running" as const;
        return "pending" as const;
      }),
    []
  );

  const publishJira = () => {
    if (jiraStep >= 0) return;
    const lines = [
      "Publishing...",
      "Epic Created",
      "23 Stories Created",
      "81 Tasks Created",
      "Evidence Attached",
      "Ready for Sprint Planning",
    ];
    setJiraStep(0);
    let acc = 0;
    lines.forEach((_, i) => {
      acc += 900;
      jiraTimers.current.push(setTimeout(() => setJiraStep(i + 1), acc));
    });
  };

  const generatePdf = () => {
    if (pdfState !== "idle") return;
    setPdfState("generating");
    setTimeout(() => {
      // Simulate a lightweight PDF download
      const pdf = buildExecutivePdf();
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

  const jiraLines = [
    "Publishing...",
    "Epic Created",
    "23 Stories Created",
    "81 Tasks Created",
    "Evidence Attached",
    "Ready for Sprint Planning",
  ];

  return (
    <div className="mx-auto max-w-[1240px] px-6 lg:px-10 pt-14 pb-32">
      <div className="grid lg:grid-cols-[240px_1fr] gap-14">
        <aside>
          <TimelineNav states={states} />
        </aside>

        <div className="min-w-0 flex flex-col gap-16">
          <div className="animate-soft-in flex flex-col gap-4">
            <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-border bg-surface-elevated/80 pl-2 pr-4 py-1.5">
              <PulseMark size={18} />
              <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-foreground/80">
                Delivery Hub
              </span>
            </div>
            <h2 className="text-[34px] sm:text-[42px] leading-[1.05] font-semibold tracking-[-0.02em] text-foreground max-w-3xl">
              <span className="text-shimmer">Deliver the decision.</span>
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-2xl">
              Publish the validated blueprint to your enterprise systems, or export executive-ready assets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ActionCard
              title="Publish to Jira"
              subtitle="Push the entire epic, stories, tasks and evidence to your workspace."
              accent
              onClick={publishJira}
              disabled={jiraStep >= 0}
              running={jiraStep >= 0 && jiraStep < jiraLines.length}
              done={jiraStep >= jiraLines.length}
              cta={jiraStep >= jiraLines.length ? "Published" : jiraStep >= 0 ? "Publishing" : "Publish"}
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
              title="Generate Executive PDF"
              subtitle="Board-ready summary: strategy, benchmark, validation and roadmap."
              onClick={generatePdf}
              disabled={pdfState !== "idle"}
              running={pdfState === "generating"}
              done={pdfState === "done"}
              cta={pdfState === "done" ? "Downloaded" : pdfState === "generating" ? "Generating" : "Generate"}
            >
              {pdfState !== "idle" && (
                <div className="mt-5 text-[12px] text-muted-foreground flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />
                  {pdfState === "generating"
                    ? "Composing Executive Summary, Benchmark, Opportunities, Impact and Roadmap..."
                    : "Delivered to your device."}
                </div>
              )}
            </ActionCard>

            <ActionCard
              title="Download Engineering Package"
              subtitle="Full blueprint, artifacts and evidence — zipped for delivery."
              cta="Download"
              onClick={() => {
                const blob = new Blob([JSON.stringify({ package: "PULSE Engineering Package", artifacts: ARTIFACTS }, null, 2)], {
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
              title="Review Generated Blueprint"
              subtitle="Preview the composed blueprint before publishing to Jira."
              cta="Preview"
              onClick={onFinish}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-border bg-surface-elevated/60 p-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 font-medium mb-1">
                When you're done
              </div>
              <div className="text-[16px] font-semibold tracking-tight text-foreground">
                Start a new strategic analysis
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onFinish}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background text-foreground px-5 py-2.5 text-[13px] font-medium hover:border-foreground/40 transition-colors"
              >
                Wrap up
              </button>
              <button
                onClick={onRestart}
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-[13px] font-medium hover:opacity-90 transition-opacity"
              >
                Start New Strategic Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
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
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Done
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

/* --------------------------- Final --------------------------- */

function FinalScreen({ onRestart }: { onRestart?: () => void }) {
  return (
    <div className="mx-auto max-w-[1240px] px-6 lg:px-10 pt-24 pb-32">
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-soft-in">
        <div className="scale-[1.4] mb-10">
          <PulseMark size={64} />
        </div>
        <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70 font-medium mb-6">
          PULSE
        </div>
        <h2 className="text-[42px] sm:text-[56px] leading-[1.02] font-semibold tracking-[-0.025em] text-foreground max-w-3xl">
          <span className="text-shimmer">Strategic Intelligence Delivered</span>
        </h2>
        <p className="mt-6 max-w-xl text-[16px] text-muted-foreground leading-relaxed">
          From market intelligence to engineering execution. Completely autonomous. Validated by FLOW. Ready for enterprise delivery.
        </p>
        <button
          onClick={onRestart}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-[14px] font-medium tracking-tight hover:opacity-90 transition-opacity"
        >
          Start Another Analysis
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

/* --------------------------- Minimal PDF builder --------------------------- */

function buildExecutivePdf(): string {
  const lines = [
    "PULSE Executive Report",
    "",
    "1. Executive Summary",
    "Prioritize AI-assisted candidate matching before redesigning the recruiting workflow.",
    "",
    "2. Competitive Benchmark",
    "Stripe, Ramp and adjacent leaders analyzed across 12 capabilities.",
    "",
    "3. Validated Opportunities",
    "AI Candidate Ranking - Confidence 94%",
    "Predictive Talent Scoring - Confidence 91%",
    "Offline Recruiting Mode - Rejected (18%)",
    "",
    "4. Business Impact",
    "Overall Confidence: 94%. Benchmark Reliability: 95%.",
    "",
    "5. Engineering Roadmap",
    "Phased delivery of validated capabilities, ready for sprint planning.",
  ];

  // Very small hand-rolled PDF
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

  addObj("<< /Type /Catalog /Pages 2 0 R >>"); // 1
  addObj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"); // 2
  addObj(
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>"
  ); // 3
  addObj(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`); // 4
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"); // 5

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
