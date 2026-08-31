type StatCardVariant = "gain" | "loss" | "neutral";

export function StatCard({
  label,
  value,
  variant = "neutral",
}: {
  label: string;
  value: string;
  variant?: StatCardVariant;
}) {
  const valueColor =
    variant === "gain"
      ? "text-gain"
      : variant === "loss"
      ? "text-loss"
      : "text-foreground";

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-muted-foreground/40">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 font-mono text-2xl font-semibold ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}