import { Icon } from "@iconify/react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl p-7 flex flex-col gap-3 flex-1">
      <Icon icon={icon} className="text-black" width={32} height={32} />
      <h3 className="font-sora font-bold text-lg text-black">{title}</h3>
      <p className="font-inter text-sm text-[#555555] leading-relaxed">{description}</p>
    </div>
  );
}
