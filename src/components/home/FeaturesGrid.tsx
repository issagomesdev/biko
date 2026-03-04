import { FeatureCard } from "@/src/components/ui/FeatureCard";

const FEATURES = [
  {
    icon: "ph:images-bold",
    title: "Portfólio visual",
    description: "Compartilhe fotos e vídeos dos seus trabalhos para atrair mais clientes.",
  },
  {
    icon: "ph:heart-bold",
    title: "Curtidas e comentários",
    description: "Interaja com a comunidade, receba feedback e aumente seu engajamento.",
  },
  {
    icon: "ph:chat-circle-dots-bold",
    title: "Chat direto",
    description: "Converse diretamente com clientes e prestadores sem sair da plataforma.",
  },
  {
    icon: "ph:magnifying-glass-bold",
    title: "Busca avançada",
    description: "Encontre o serviço certo com filtros por categoria, região e avaliações.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="bg-primary w-full px-20 py-16 flex flex-col items-center gap-11 max-md:px-5 max-md:py-10 max-md:gap-8">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="font-inter font-bold text-xs tracking-[2px] text-black/70 uppercase">
          FUNCIONALIDADES
        </span>
        <h2 className="font-sora font-bold text-[40px] text-black leading-[1.15] tracking-[-1px] max-md:text-[28px]">
          Tudo que você precisa<br />em um só lugar
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-6 w-full max-md:grid-cols-1 max-md:gap-3 lg:grid-cols-2 xl:grid-cols-4">
        {FEATURES.map((feat) => (
          <FeatureCard key={feat.title} {...feat} />
        ))}
      </div>
    </section>
  );
}
