import Link from "next/link";

export function TwoColumn() {
  return (
    <section id="providers" className="flex w-full h-[480px] max-md:flex-col max-md:h-auto">
      {/* Para Prestadores — Dark */}
      <div className="flex flex-col justify-center gap-6 bg-[#111111] px-20 py-[72px] max-md:px-6 max-md:py-10">
        <span className="font-inter font-bold text-xs tracking-[2px] text-primary uppercase">
          PARA PRESTADORES
        </span>
        <h2 className="font-sora font-bold text-[36px] text-white leading-[1.2] tracking-[-1px] max-md:text-[28px]">
          Mostre seu trabalho,<br />cresça seu negócio
        </h2>
        <p className="font-inter text-base text-white/50 leading-relaxed max-md:text-[15px]">
          Crie um perfil profissional, publique seus trabalhos e seja encontrado por milhares de clientes em sua região.
        </p>
        <Link
          href="/register?type=provider"
          className="self-start flex items-center justify-center h-[52px] px-7 bg-primary text-black font-sora font-bold text-base rounded-xl hover:brightness-95 transition-all max-md:w-full max-md:self-stretch"
        >
          Começar como Prestador →
        </Link>
      </div>

      {/* Para Clientes — Light */}
      <div id="clients" className="flex flex-col justify-center gap-6 bg-background_contraste px-20 py-[72px] max-md:px-6 max-md:py-10">
        <span className="font-inter font-bold text-xs tracking-[2px] text-black/70 uppercase">
          PARA CLIENTES
        </span>
        <h2 className="font-sora font-bold text-[36px] text-black leading-[1.2] tracking-[-1px] max-md:text-[24px]">
          Encontre serviços<br />de qualidade
        </h2>
        <p className="font-inter text-base text-[#666666] leading-relaxed max-md:text-[15px]">
          Explore publicações de prestadores, veja portfólios reais, leia comentários e entre em contato diretamente.
        </p>
        <Link
          href="/register?type=client"
          className="self-start flex items-center justify-center h-[52px] px-7 bg-black text-white font-sora font-bold text-base rounded-xl hover:bg-black/85 transition-colors max-md:w-full max-md:self-stretch"
        >
          Encontrar serviços →
        </Link>
      </div>
    </section>
  );
}
