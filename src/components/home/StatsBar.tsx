import { StatItem } from "@/src/components/ui/StatItem";

const STATS = [
  { value: "10k+", label: "Prestadores ativos" },
  { value: "50k+", label: "Clientes cadastrados" },
  { value: "4.8★", label: "Avaliação média" },
  { value: "100+", label: "Cidades atendidas" },
];

export function StatsBar() {
  return (
    <section className="bg-[#111111] w-full">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center h-[133px]">
        {STATS.map((s, i) => (
          <div key={s.value} className="flex-1 flex items-center justify-center">
            <StatItem value={s.value} label={s.label} variant="dark" />
          </div>
        ))}
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col items-center gap-2 px-6 py-8">
        <span className="font-sora font-bold text-[36px] text-primary">200+</span>
        <span className="font-inter text-sm text-white/50 text-center leading-relaxed">
          Categorias de serviços disponíveis
        </span>
        <span className="font-inter text-xs text-white/30 text-center">
          10k+ prestadores · 50k+ clientes · 4.8★ avaliação
        </span>
      </div>
    </section>
  );
}
