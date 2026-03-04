import Link from "next/link";
import Image from "next/image";

const HERO_STATS = [
  { value: "10k+", label: "Prestadores" },
  { value: "50k+", label: "Clientes" },
  { value: "200+", label: "Categorias" },
];

export function HeroSection() {
  return (
    <section className="flex w-full h-[634px] max-md:flex-col max-md:h-auto">
      {/* Left — Yellow */}
      <div className="flex flex-col justify-between flex-1 bg-primary p-[72px] max-md:p-7 max-md:gap-5 max-md:pb-10">
        {/* Tag */}
        <span className="font-inter font-bold text-xs text-black/70 tracking-[1px] uppercase">
          ✦ Rede social de serviços
        </span>

        {/* Content */}
        <div className="flex flex-col gap-7 max-md:gap-4">
          <div className="flex flex-col gap-4">
            <h1 className="font-sora font-bold text-[52px] leading-[1.05] tracking-[-2px] text-black max-md:text-[34px] max-md:tracking-[-0.5px]">
              Conecte-se aos melhores serviços da sua região
            </h1>
            <p className="font-inter text-[17px] text-black/70 leading-relaxed max-md:text-[15px]">
              Uma rede social onde prestadores compartilham seus trabalhos e clientes encontram os profissionais ideais.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3 max-md:flex-col">
            <Link
              href="/register"
              className="flex items-center justify-center h-14 px-8 bg-black text-white font-sora font-bold text-[16px] rounded-xl hover:bg-black/85 transition-colors max-md:w-full"
            >
              Criar conta gratuita
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center justify-center h-14 px-8 bg-black/10 text-black font-sora font-bold text-[16px] rounded-xl hover:bg-black/15 transition-colors max-md:w-full"
            >
              Como funciona
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-10 max-md:justify-center">
          {HERO_STATS.map((s) => (
            <div key={s.value} className="flex flex-col gap-0.5">
              <span className="font-sora font-bold text-2xl text-black">{s.value}</span>
              <span className="font-inter text-sm text-black/60">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Dark (desktop only) */}
      <div className="hidden md:flex flex-col items-center justify-center flex-1 bg-[#111111] gap-7 p-[60px]">
        <span className="font-inter font-bold text-xs text-primary tracking-[2px] uppercase">
          PLATAFORMA COMPLETA
        </span>
        <h2 className="font-sora font-bold text-[44px] text-white leading-[1.1] tracking-[-1px] text-center">
          Compartilhe.<br />Conecte.<br />Cresça.
        </h2>
        <p className="font-inter text-base text-white/50 leading-relaxed text-center">
          Publique seus serviços, interaja com clientes<br />e construa sua reputação online.
        </p>

        {/* Mock card */}
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3.5 w-[320px] shadow-[0_8px_40px_rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-sora font-bold text-sm text-black">
                M
              </div>
              <div>
                <p className="font-sora font-bold text-sm text-black">Maria Silva</p>
                <p className="font-inter text-xs text-[#999]">Limpeza · São Paulo</p>
              </div>
            </div>
            <span className="text-xs text-[#999] font-inter">2h atrás</span>
          </div>
          <div className="relative w-full h-[120px] rounded-xl overflow-hidden bg-[#eee]">
            <Image
              src="https://images.unsplash.com/photo-1627669915725-d0c8a0002fce?w=640&q=80"
              alt="Serviço de limpeza"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <p className="font-inter text-[13px] text-[#333] leading-snug">
            Serviço de limpeza residencial concluído! 🧹 Orçamento acessível.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-inter text-sm text-[#555]">❤️ 42</span>
            <span className="font-inter text-sm text-[#555]">💬 8</span>
            <span className="font-inter text-sm text-[#555]">🔁 Compartilhar</span>
          </div>
        </div>
      </div>
    </section>
  );
}
