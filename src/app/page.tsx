import {
  Navbar,
  HeroSection,
  StatsBar,
  FeatureSection,
  HowItWorks,
  FeaturesGrid,
  TwoColumn,
  CTASection,
  Footer,
} from "@/src/components/home";

const FEATURE_SECTIONS = [
  {
    tag: "PORTFÓLIO",
    icon: "ph:images-bold",
    tagVariant: "yellow" as const,
    title: "Mostre seu trabalho para o mundo",
    description:
      "Crie um perfil profissional, publique fotos dos seus serviços e construa sua reputação online. Receba curtidas, comentários e novos clientes.",
    imageUrl: "https://images.unsplash.com/photo-1530240852689-f7a9c6d9f6c7?w=1080&q=80",
    imageAlt: "Profissional mostrando portfólio",
    bg: "bg-white",
    reverse: false,
  },
  {
    tag: "DESCOBERTA",
    icon: "ph:map-pin-bold",
    tagVariant: "dark" as const,
    title: "Encontre o profissional certo perto de você",
    description:
      "Filtre por categoria, cidade, tipo de usuário e muito mais. Descubra prestadores com avaliações reais e portfólio verificado na sua região.",
    imageUrl: "https://images.unsplash.com/photo-1549287283-8c51cee844e0?w=1080&q=80",
    imageAlt: "Busca de profissionais",
    bg: "bg-background_contraste",
    reverse: true,
  },
  {
    tag: "CONEXÃO",
    icon: "ph:handshake-bold",
    tagVariant: "yellow" as const,
    title: "Interaja e feche negócios",
    description:
      "Curta, comente, envie mensagens privadas e conecte-se diretamente com prestadores ou clientes. Cada interação é uma oportunidade de negócio.",
    imageUrl: "https://images.unsplash.com/photo-1704565522499-321a97525d9e?w=1080&q=80",
    imageAlt: "Conexão entre pessoas",
    bg: "bg-white",
    reverse: false,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-col">
        <HeroSection />
        <StatsBar />
        {FEATURE_SECTIONS.map((section) => (
          <FeatureSection key={section.tag} {...section} />
        ))}
        <HowItWorks />
        <FeaturesGrid />
        <TwoColumn />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
