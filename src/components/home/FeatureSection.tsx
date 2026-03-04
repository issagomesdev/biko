import Image from "next/image";
import { Icon } from "@iconify/react";

interface FeatureSectionProps {
  tag: string;
  icon: string;
  tagVariant?: "yellow" | "dark";
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  reverse?: boolean;
  bg?: string;
}

export function FeatureSection({
  tag,
  icon,
  tagVariant = "yellow",
  title,
  description,
  imageUrl,
  imageAlt,
  reverse = false,
  bg = "bg-white",
}: FeatureSectionProps) {
  const tagBg = tagVariant === "yellow" ? "bg-primary/20 text-black" : "bg-black/10 text-black";

  const image = (
    <div className="relative w-[480px] h-[380px] rounded-2xl overflow-hidden shrink-0 max-md:w-full max-md:h-[200px]">
      <Image src={imageUrl} alt={imageAlt} fill className="object-cover" unoptimized />
    </div>
  );

  const content = (
    <div className="flex flex-col gap-5 justify-center flex-1">
      <span className={`self-start flex items-center gap-1.5 font-inter font-bold text-xs tracking-widest uppercase px-3 py-1.5 rounded-full ${tagBg}`}>
        <Icon icon={icon} width={14} height={14} />
        {tag}
      </span>
      <h2 className="font-sora font-bold text-[34px] leading-[1.2] tracking-[-0.5px] text-black max-md:text-[26px]">
        {title}
      </h2>
      <p className="font-inter text-[15px] text-[#555555] leading-relaxed">{description}</p>
    </div>
  );

  return (
    <section className={`${bg} w-full`}>
      <div className={`flex items-center gap-20 px-20 py-0 h-[520px] max-md:flex-col max-md:h-auto max-md:px-6 max-md:py-10 max-md:gap-5 ${reverse ? "flex-row-reverse" : "flex-row"}`}>
        {content}
        {image}
      </div>
    </section>
  );
}
