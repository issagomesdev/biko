interface StatItemProps {
  value: string;
  label: string;
  variant?: "dark" | "light";
}

export function StatItem({ value, label, variant = "dark" }: StatItemProps) {
  const valueColor = variant === "dark" ? "text-primary" : "text-black";
  const labelColor = variant === "dark" ? "text-white/50" : "text-black/60";

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`font-sora font-bold text-4xl ${valueColor}`}>{value}</span>
      <span className={`font-inter text-sm font-semibold ${labelColor}`}>{label}</span>
    </div>
  );
}
