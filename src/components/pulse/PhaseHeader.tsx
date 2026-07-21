export function PhaseHeader({
  index,
  label,
  title,
  subtitle,
}: {
  index: string;
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="animate-soft-in">
      <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80 font-medium mb-5">
        <span className="tabular-nums">{index}</span>
        <span className="h-px w-6 bg-border" />
        <span>{label}</span>
      </div>
      <h2 className="text-[32px] sm:text-[38px] leading-[1.1] font-semibold tracking-[-0.02em] text-foreground max-w-2xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}
