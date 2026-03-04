import Link from "next/link";

interface MobileAuthHeaderProps {
  title: string;
  subtitle: string;
}

export function MobileAuthHeader({ title, subtitle }: MobileAuthHeaderProps) {
  return (
    <div className="md:hidden flex flex-col w-full">
      {/* Yellow logo block */}
      <div className="flex flex-col items-center justify-center gap-3 bg-primary rounded-b-[32px] pt-[50px] pb-5 px-6 h-52">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-14 h-14 bg-black rounded-[14px]">
            <span className="font-sora font-bold text-2xl text-primary">B</span>
          </div>
          <span className="font-sora font-bold text-[38px] text-black tracking-[-1px]">biko</span>
        </Link>
      </div>
      
      {/* Title below yellow block */}
      <div className="flex flex-col items-center gap-1 px-6 pt-3 pb-4">
        <h2 className="font-sora font-bold text-[22px] text-black text-center">{title}</h2>
        <p className="font-inter text-sm text-[#666666] text-center">{subtitle}</p>
      </div>
    </div>
  );
}
