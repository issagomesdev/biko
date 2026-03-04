import { StepCard } from "@/src/components/ui/StepCard";

const STEPS = [
  {
    number: "1",
    title: "Crie sua conta",
    description: "Cadastre-se gratuitamente como prestador ou cliente em menos de 2 minutos.",
  },
  {
    number: "2",
    title: "Publique ou explore",
    description:
      "Prestadores publicam seus trabalhos. Clientes exploram o feed e descobrem profissionais por localização.",
  },
  {
    number: "3",
    title: "Conecte e feche negócio",
    description:
      "Converse via chat, combine os detalhes e pronto — negócio fechado sem complicação.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-dark-background w-full px-20 py-20 flex flex-col gap-14 max-md:px-6 max-md:py-10 max-md:gap-7">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="font-sora font-bold text-[44px] text-white tracking-[-1px] max-md:text-[28px]">
          Como funciona
        </h2>
        <p className="font-inter text-lg text-[#666666] max-md:text-[15px]">
          Em três passos simples, você já está conectado
        </p>
      </div>

      {/* Steps */}
      <div className="flex gap-5 max-md:flex-col">
        {STEPS.map((step) => (
          <StepCard key={step.number} {...step} />
        ))}
      </div>
    </section>
  );
}
