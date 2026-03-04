interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="flex-1 bg-dark-background_contraste rounded-2xl p-8 flex flex-col gap-5">
      <div className="flex items-center justify-center w-13 h-13 bg-primary rounded-2xl shrink-0 text-black font-sora font-bold text-lg w-[52px] h-[52px]">
        {number}
      </div>
      <h3 className="font-sora font-bold text-xl text-white">{title}</h3>
      <p className="font-inter text-[15px] text-[#666666] leading-relaxed">{description}</p>
    </div>
  );
}
