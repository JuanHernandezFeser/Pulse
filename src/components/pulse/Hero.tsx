import type { Dict } from "@/lib/pulse-i18n";
import { PulseMark } from "./PulseMark";

export function Hero({ t, onStart }: { t: Dict; onStart: () => void }) {
  return (
    <section className="relative pt-20 pb-28 flex flex-col items-center text-center animate-soft-in-slow">
      <div className="mb-10">
        <PulseMark size={56} />
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-[11px] font-medium tracking-[0.12em] uppercase text-muted-foreground mb-8">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        {t.hero.eyebrow}
      </div>
      <h1 className="max-w-3xl text-[44px] sm:text-[54px] leading-[1.05] font-semibold tracking-[-0.03em] text-foreground">
        {t.hero.title}
      </h1>
      <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        {t.hero.subtitle}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {[t.hero.pill1, t.hero.pill2, t.hero.pill3].map((p) => (
          <span
            key={p}
            className="rounded-full border border-border bg-surface-elevated px-3.5 py-1.5 text-[12px] font-medium text-foreground/80"
          >
            {p}
          </span>
        ))}
      </div>
      <button
        onClick={onStart}
        className="group mt-12 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[14px] font-medium text-background transition-all duration-300 hover:opacity-90 hover:gap-3 active:scale-[0.98]"
      >
        {t.hero.cta}
        <svg
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
          fill="none"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
}
