import { PulseMark } from "./PulseMark";
import { translations, type Lang } from "@/lib/pulse-i18n";

export function TopBar({
  lang,
  onLangChange,
}: {
  lang: Lang;
  onLangChange: (l: Lang) => void;
}) {
  const t = translations[lang];
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <PulseMark size={22} />
          <span className="text-[15px] font-semibold tracking-tight">
            PULSE
          </span>
          <span className="hidden sm:inline text-[12px] text-muted-foreground ml-2 pl-3 border-l border-border">
            Experience
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="inline-flex items-center rounded-full border border-border bg-surface p-[3px] text-[12px] font-medium"
            role="group"
            aria-label="Language"
          >
            {(["en", "es"] as Lang[]).map((l) => {
              const active = lang === l;
              return (
                <button
                  key={l}
                  onClick={() => onLangChange(l)}
                  className={[
                    "px-3 py-1 rounded-full transition-all duration-300",
                    active
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {l === "en" ? "English" : "Español"}
                </button>
              );
            })}
          </div>
          <a
            href="https://pulse-website-ecru.vercel.app/"
            className="hidden sm:inline-flex items-center rounded-full border border-border bg-foreground px-5 py-2 text-[13px] font-medium text-background transition-colors hover:bg-foreground/90"
          >
            {t.knowAbout}
          </a>
        </div>
      </div>
    </header>
  );
}
