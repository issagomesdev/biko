import Link from "next/link";

interface AuthPanelProps {
  title: string;
  description: string;
  stats?: { value: string; label: string }[];
}

const DEFAULT_STATS = [
  { value: "10k+", label: "Prestadores" },
  { value: "50k+", label: "Clientes" },
];

export function AuthPanel({
  title,
  description,
  stats = DEFAULT_STATS,
}: AuthPanelProps) {
  return (
    <div className="hidden md:flex flex-col justify-between flex-1 bg-primary p-[60px]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 bg-black rounded-xl">
          <span className="font-sora font-bold text-[22px] text-primary">B</span>
        </div>
        <span className="font-sora font-bold text-[32px] text-black tracking-[-1px]">biko</span>
      </Link>

      {/* Hero */}
      <div className="flex flex-col gap-6">
        <h1 className="font-sora font-bold text-[48px] text-black leading-[1.1] tracking-[-1px]">
          {title}
        </h1>
        <p className="font-inter text-lg text-black/70 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-8">
        {stats.map((s) => (
          <div key={s.value} className="flex flex-col gap-1">
            <span className="font-sora font-bold text-[32px] text-black">{s.value}</span>
            <span className="font-inter text-sm text-black/70">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
