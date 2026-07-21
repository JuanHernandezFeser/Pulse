import type { Dict } from "@/lib/pulse-i18n";

export type PhaseKey = "p01" | "p02" | "p03" | "p04" | "p05" | "p06" | "p07";

const ORDER: PhaseKey[] = ["p01", "p02", "p03", "p04", "p05", "p06", "p07"];

export function Timeline({
  t,
  activeIndex,
  completedThrough,
}: {
  t: Dict;
  activeIndex: number;
  completedThrough: number; // last completed index (-1 if none)
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
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px bg-border"
          aria-hidden
        />
        {ORDER.map((key, i) => {
          const done = i <= completedThrough;
          const active = i === activeIndex;
          const locked = i > completedThrough + 1;
          const label = t.phases[key];
          const num = String(i + 1).padStart(2, "0");
          return (
            <li key={key} className="relative flex items-start gap-3 pl-0">
              <span
                className={[
                  "relative z-10 mt-[3px] flex h-[15px] w-[15px] items-center justify-center rounded-full border transition-all duration-300",
                  done
                    ? "bg-foreground border-foreground"
                    : active
                    ? "bg-background border-foreground"
                    : "bg-background border-border",
                ].join(" ")}
              >
                {done ? (
                  <svg
                    viewBox="0 0 10 10"
                    className="h-[8px] w-[8px] text-background"
                    fill="none"
                  >
                    <path
                      d="M2 5.2L4.2 7.2L8 3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : active ? (
                  <span className="h-[6px] w-[6px] rounded-full bg-foreground animate-pulse" />
                ) : null}
              </span>
              <div className="flex flex-col leading-tight">
                <span
                  className={[
                    "text-[10px] tracking-[0.16em] font-medium",
                    active
                      ? "text-foreground/70"
                      : locked
                      ? "text-muted-foreground/40"
                      : "text-muted-foreground/70",
                  ].join(" ")}
                >
                  {num}
                </span>
                <span
                  className={[
                    "text-[13px] font-medium transition-colors",
                    done
                      ? "text-foreground"
                      : active
                      ? "text-foreground"
                      : locked
                      ? "text-muted-foreground/45"
                      : "text-muted-foreground",
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
