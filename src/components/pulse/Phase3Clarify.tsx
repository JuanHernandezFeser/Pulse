import { useEffect, useState } from "react";
import type { Dict } from "@/lib/pulse-i18n";
import { PhaseHeader } from "./PhaseHeader";
import { PulseMark } from "./PulseMark";

export function Phase3Clarify({
  t,
  brief,
  onContinue,
}: {
  t: Dict;
  brief: string;
  onContinue: () => void;
}) {
  const questions = [
    { q: t.p3.q1, opts: t.p3.q1opts },
    { q: t.p3.q2, opts: t.p3.q2opts },
    { q: t.p3.q3, opts: t.p3.q3opts },
  ];
  const [answers, setAnswers] = useState<(string | null)[]>([null, null, null]);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (visibleCount < questions.length && answers[visibleCount - 1]) {
      const id = setTimeout(() => setVisibleCount((v) => v + 1), 420);
      return () => clearTimeout(id);
    }
  }, [answers, visibleCount, questions.length]);

  const allAnswered = answers.every(Boolean);

  const setAnswer = (i: number, v: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <PhaseHeader
        index="03"
        label={t.phases.p03}
        title={t.p3.title}
        subtitle={t.p3.subtitle}
      />

      <div className="animate-soft-in rounded-2xl border border-border bg-surface/60 p-5 flex items-start gap-3">
        <div className="mt-0.5">
          <PulseMark size={22} />
        </div>
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70 font-medium mb-1">
            Strategic Brief
          </div>
          <p className="text-[13.5px] leading-relaxed text-foreground/80 line-clamp-3">
            {brief}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {questions.slice(0, visibleCount).map((item, i) => (
          <div key={i} className="animate-soft-in">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <PulseMark size={20} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60 font-medium mb-1.5">
                  {String(i + 1).padStart(2, "0")} · PULSE
                </div>
                <div className="text-[17px] font-medium tracking-tight text-foreground">
                  {item.q}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.opts.map((opt) => {
                    const active = answers[i] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setAnswer(i, opt)}
                        className={[
                          "rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-300",
                          active
                            ? "bg-foreground text-background border-foreground"
                            : "bg-surface-elevated text-foreground/80 border-border hover:border-border-strong hover:bg-accent",
                        ].join(" ")}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onContinue}
          disabled={!allAnswered}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition-all duration-300 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {t.p3.cta}
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
