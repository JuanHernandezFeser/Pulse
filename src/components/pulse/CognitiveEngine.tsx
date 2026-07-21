import { useEffect, useMemo, useRef, useState } from "react";
import { PulseMark } from "./PulseMark";

const TIMELINE = [
  { key: "workspace", label: "Workspace" },
  { key: "brief", label: "Brief" },
  { key: "context", label: "Context" },
  { key: "market", label: "Market Modeling" },
  { key: "competitive", label: "Competitive Intelligence" },
  { key: "evidence", label: "Evidence Collection" },
  { key: "flow", label: "FLOW Validation" },
  { key: "recommendation", label: "Recommendation" },
  { key: "blueprint", label: "Blueprint" },
  { key: "delivery", label: "Delivery" },
] as const;

// Sub-phase indices (map to timeline)
// 3 = market, 4 = competitive+benchmark+gaps, 5 = evidence
// Steps drive progressive reveal on the right column.
// 0..3   Market Modeling reveals
// 4..6   Competitive Landscape reveals
// 7..8   Benchmark reveal + bars
// 9      Feature Gap cards
// 10..11 Evidence collection
// 12     Results
// 13     Confidence
// 14     Conclusion + CTAs
const FINAL_STEP = 14;

export function CognitiveEngine({ onValidate }: { onValidate?: () => void }) {
  const [step, setStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const schedule = [
      600, 700, 700, 900, // market cards
      900, 500, 500, // competitors trickle
      900, 1400, // benchmark bars fill
      900, // gaps
      1200, 1000, // evidence + results
      900, 900, // confidence + conclusion
    ];
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
  }, []);

  // Timeline states
  // completed 0..2 always (workspace, brief, context)
  // market running when step < 4, completed at >=4
  // competitive running 4..9 (through benchmark+gaps), completed at >=10
  // evidence running 10..11, completed >=12
  const timelineState = useMemo(() => {
    return TIMELINE.map((_, i) => {
      if (i <= 2) return "completed" as const;
      if (i === 3) return step >= 4 ? "completed" : "running";
      if (i === 4) return step >= 10 ? "completed" : step >= 4 ? "running" : "pending";
      if (i === 5) return step >= 12 ? "completed" : step >= 10 ? "running" : "pending";
      return "pending" as const;
    });
  }, [step]);

  return (
    <div className="mx-auto max-w-[1240px] px-6 lg:px-10 pt-14 pb-32">
      <div className="grid lg:grid-cols-[240px_1fr] gap-14">
        <aside>
          <EngineTimeline states={timelineState} />
        </aside>

        <div className="min-w-0 flex flex-col gap-20">
          <EngineHeader />

          <MarketModeling step={step} />

          {step >= 4 && <CompetitiveLandscape step={step} />}

          {step >= 7 && <Benchmark step={step} />}

          {step >= 9 && <FeatureGaps />}

          {step >= 10 && <EvidenceCollection step={step} />}

          {step >= 12 && <ResultsBlock />}

          {step >= 13 && <ConfidenceEngine />}

          {step >= 14 && <PulseConclusion onValidate={onValidate} />}
        </div>
      </div>

      <AskPulseFab visible={step >= FINAL_STEP} />
    </div>
  );
}

/* ------------------------ Header ------------------------ */

function EngineHeader() {
  return (
    <div className="animate-soft-in flex flex-col gap-4">
      <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-border bg-surface-elevated/80 pl-2 pr-4 py-1.5">
        <PulseMark size={18} />
        <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-foreground/80">
          PULSE · Cognitive Intelligence Engine
        </span>
      </div>
      <h2 className="text-[34px] sm:text-[42px] leading-[1.05] font-semibold tracking-[-0.02em] text-foreground max-w-3xl">
        <span className="text-shimmer">Building a strategic understanding of your market.</span>
      </h2>
    </div>
  );
}

/* ------------------------ Timeline ------------------------ */

function EngineTimeline({
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
        {TIMELINE.map((item, i) => {
          const s = states[i];
          return (
            <li key={item.key} className="relative flex items-start gap-3">
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
                    s === "pending"
                      ? "text-muted-foreground/45"
                      : "text-foreground",
                  ].join(" ")}
                >
                  {item.label}
                </span>
                {s === "running" && (
                  <span className="mt-1 text-[10px] uppercase tracking-[0.14em] text-foreground/60">
                    Running
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

/* ------------------------ Section wrapper ------------------------ */

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

/* ------------------------ Market Modeling ------------------------ */

const MARKET_CARDS = [
  { label: "Business Domain", value: "Enterprise Software" },
  { label: "Product Category", value: "AI Product Intelligence" },
  { label: "Target Market", value: "Enterprise Organizations" },
  {
    label: "Primary Users",
    value: "Product Teams · Product Managers · Engineering Leaders · Delivery Teams",
  },
];

const INTENT = [
  "Improve product competitiveness",
  "Generate validated opportunities",
  "Prioritize engineering investment",
];

function MarketModeling({ step }: { step: number }) {
  return (
    <Section eyebrow="Phase · Market Modeling" title="Understanding your business.">
      <div className="grid sm:grid-cols-2 gap-3">
        {MARKET_CARDS.map((c, i) => (
          <RevealCard key={c.label} show={step >= i + 1} delayIndex={i}>
            <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70 font-medium mb-2">
              {c.label}
            </div>
            <div className="text-[15px] font-medium text-foreground leading-snug">
              {c.value}
            </div>
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
          Strategic Intent Recognized
        </div>
        <ul className="flex flex-col gap-2.5">
          {INTENT.map((line, i) => (
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

/* ------------------------ Competitive Landscape ------------------------ */

const COMPETITORS = ["Stripe", "Ramp", "Mercury", "Brex", "Rippling"];

function CompetitiveLandscape({ step }: { step: number }) {
  // Reveal competitors on step 4..6 progressively — all five over ~1s
  return (
    <Section eyebrow="Phase · Competitive Intelligence" title="Building Competitive Landscape.">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {COMPETITORS.map((c, i) => (
          <RevealCard key={c} show={step >= 4} delayIndex={i} compact>
            <div className="flex flex-col gap-2">
              <div className="text-[15px] font-semibold tracking-tight text-foreground">{c}</div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground/70">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                Detected
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
            Competitive Ecosystem
          </div>
          <div className="text-[18px] font-semibold tracking-tight">Completed</div>
        </div>
        <div className="text-[13px] text-background/70">5 competitors mapped</div>
      </div>
    </Section>
  );
}

/* ------------------------ Consolidated Benchmark ------------------------ */

const BENCH = [
  { name: "Stripe", features: 184 },
  { name: "Ramp", features: 171 },
  { name: "Mercury", features: 166 },
  { name: "Brex", features: 179 },
  { name: "Rippling", features: 193 },
];

const BENCH_TRACKS = [
  "Feature Mapping",
  "Capability Mapping",
  "Journey Comparison",
  "UX Benchmark",
  "Engineering Complexity",
];

function Benchmark({ step }: { step: number }) {
  const max = Math.max(...BENCH.map((b) => b.features));
  const fill = step >= 8; // bars fill
  const done = step >= 9;

  return (
    <Section eyebrow="Phase · Consolidated Benchmark" title="Cross-competitor feature analysis.">
      <div className="grid grid-cols-5 gap-3">
        {BENCH.map((b, i) => {
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
                    Features
                  </span>
                </div>
              </div>
            </RevealCard>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-surface-elevated/70 p-6">
        <div className="grid gap-4">
          {BENCH_TRACKS.map((t, i) => (
            <div key={t} className="flex items-center gap-4">
              <div className="w-52 text-[13px] font-medium text-foreground/85">{t}</div>
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
        Benchmark Consolidated Successfully
      </div>
    </Section>
  );
}

/* ------------------------ Feature Gap Discovery ------------------------ */

const GAPS = [
  {
    label: "Detected Feature Gaps",
    value: 31,
    desc: "Total capability deltas across competitors.",
  },
  {
    label: "Critical Opportunities",
    value: 12,
    desc: "High-impact gaps with strong strategic upside.",
  },
  {
    label: "Incremental Improvements",
    value: 11,
    desc: "Refinements that raise product parity.",
  },
  {
    label: "Strategic Innovations",
    value: 8,
    desc: "Non-obvious moves competitors have not made.",
  },
];

function FeatureGaps() {
  return (
    <Section eyebrow="Phase · Feature Gap Discovery" title="Where the opportunity lives.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {GAPS.map((g, i) => (
          <RevealCard key={g.label} show delayIndex={i}>
            <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70 font-medium mb-3">
              {g.label}
            </div>
            <div className="text-[40px] font-semibold tracking-[-0.03em] text-foreground leading-none tabular-nums">
              {g.value}
            </div>
            <div className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
              {g.desc}
            </div>
          </RevealCard>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------ Evidence Collection ------------------------ */

const SOURCES = [
  "Gartner",
  "NNGroup",
  "G2",
  "Google Scholar",
  "GitHub",
  "Official Documentation",
  "Developer Blogs",
  "Product Hunt",
  "Stack Overflow",
  "Reddit",
  "LinkedIn Engineering",
  "Release Notes",
  "Public APIs",
  "Open Source Projects",
  "Customer Reviews",
  "Technical Articles",
];

const STATES = ["Analyzed", "Verified", "Indexed"] as const;

function EvidenceCollection({ step }: { step: number }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (step < 10) return;
    const id = setInterval(() => setTick((t) => t + 1), 240);
    return () => clearInterval(id);
  }, [step]);

  return (
    <Section eyebrow="Phase · Market Evidence Collection" title="Cross-source public evidence.">
      <div className="flex flex-wrap gap-2">
        {SOURCES.map((s, i) => {
          const active = tick > i;
          const state = STATES[(i + Math.floor(tick / 3)) % STATES.length];
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

/* ------------------------ Results ------------------------ */

const RESULTS = [
  { label: "Sources Consulted", value: "148" },
  { label: "Market Signals", value: "326" },
  { label: "Validated Mentions", value: "512" },
  { label: "Relevant Documents", value: "83" },
  { label: "Engineering References", value: "97" },
];

function ResultsBlock() {
  return (
    <section className="animate-soft-in grid grid-cols-2 sm:grid-cols-5 gap-3">
      {RESULTS.map((r, i) => (
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

/* ------------------------ Confidence ------------------------ */

const CONFIDENCE = [
  { label: "Data Freshness", value: "High" },
  { label: "Source Diversity", value: "Excellent" },
  { label: "Evidence Quality", value: "Verified" },
  { label: "Benchmark Coverage", value: "95%" },
];

function ConfidenceEngine() {
  return (
    <section className="animate-soft-in rounded-2xl border border-border bg-surface-elevated/70 p-8">
      <div className="grid lg:grid-cols-[280px_1fr] gap-10 items-center">
        <div className="flex flex-col items-start gap-2">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 font-medium">
            Overall Analysis Confidence
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[64px] font-semibold tracking-[-0.03em] text-foreground leading-none tabular-nums">
              94
            </span>
            <span className="text-[22px] font-medium text-muted-foreground">%</span>
          </div>
          <div className="mt-3 h-[6px] w-full rounded-full bg-surface overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full"
              style={{
                width: "94%",
                animation: "soft-in 1.2s cubic-bezier(0.22,1,0.36,1) both",
              }}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {CONFIDENCE.map((c, i) => (
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

/* ------------------------ Conclusion + CTAs ------------------------ */

function PulseConclusion({ onValidate }: { onValidate?: () => void }) {
  return (
    <section className="animate-soft-in flex flex-col gap-6">
      <div className="rounded-3xl border border-border bg-foreground text-background p-10">
        <div className="flex items-start gap-4">
          <PulseMark size={28} />
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-background/60 font-medium mb-3">
              PULSE Conclusion
            </div>
            <h4 className="text-[26px] sm:text-[30px] leading-[1.15] font-semibold tracking-[-0.02em]">
              Strategic Insights Ready.
            </h4>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-background/80">
              PULSE successfully built a comprehensive market model combining competitive
              intelligence, product benchmarking and public evidence. The analysis is now ready
              for FLOW validation.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onValidate}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[13.5px] font-medium text-background transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
        >
          Validate Opportunities with FLOW
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
          Review Intelligence
        </button>
      </div>
    </section>
  );
}

/* ------------------------ Ask PULSE FAB ------------------------ */

function AskPulseFab({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <button
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface-elevated/90 backdrop-blur px-4 py-3 text-[13px] font-medium text-foreground shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-accent active:scale-[0.98] animate-soft-in"
      aria-label="Ask PULSE"
    >
      <PulseMark size={18} />
      Ask PULSE
    </button>
  );
}

/* ------------------------ Bits ------------------------ */

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
