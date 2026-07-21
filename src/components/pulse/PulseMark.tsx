export function PulseMark({ size = 28 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full pulse-orb" />
      <div
        className="relative rounded-full bg-foreground/90"
        style={{ width: size * 0.32, height: size * 0.32 }}
      />
    </div>
  );
}
