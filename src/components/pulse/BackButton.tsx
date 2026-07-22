import type { Dict } from "@/lib/pulse-i18n";

export function BackButton({ t, onBack }: { t: Dict; onBack?: () => void }) {
  if (!onBack) return null;
  return (
    <button
      onClick={onBack}
      className="inline-flex items-center gap-1.5 self-start text-[12px] font-medium text-muted-foreground/80 hover:text-foreground transition-colors duration-300 -ml-1 px-1 py-1 rounded"
      aria-label={t.back}
    >
      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
        <path
          d="M9 4L5 8l4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {t.back}
    </button>
  );
}
