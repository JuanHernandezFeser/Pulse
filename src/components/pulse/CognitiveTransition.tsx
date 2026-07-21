import { useEffect, useState } from "react";
import type { Dict } from "@/lib/pulse-i18n";
import { PulseMark } from "./PulseMark";

export function CognitiveTransition({ t }: { t: Dict }) {
  const lines = [t.transition.l1, t.transition.l2, t.transition.l3];
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= lines.length - 1) return;
    const id = setTimeout(() => setStep((s) => s + 1), 1800);
    return () => clearTimeout(id);
  }, [step, lines.length]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl animate-soft-in">
      <div className="scale-[1.6] mb-10">
        <PulseMark size={64} />
      </div>
      <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground/70 font-medium mb-4">
        PULSE Cognitive Intelligence
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
