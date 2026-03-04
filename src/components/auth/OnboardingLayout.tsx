import Link from "next/link"

interface OnboardingLayoutProps {
  children:    React.ReactNode
  cardWidth?:  string
}

export function OnboardingLayout({ children, cardWidth = "max-w-[420px]" }: OnboardingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary gap-10 px-6 py-10">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 bg-black rounded-xl">
          <span className="font-sora font-bold text-[22px] text-primary">B</span>
        </div>
        <span className="font-sora font-bold text-[32px] text-black tracking-[-1px]">biko</span>
      </Link>

      {/* Card */}
      <div className={`w-full ${cardWidth} bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-10 flex flex-col gap-7 max-md:p-6 max-md:gap-6`}>
        {children}
      </div>
    </div>
  )
}
