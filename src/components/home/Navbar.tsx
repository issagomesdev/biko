import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between h-[72px] px-[60px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] sticky top-0 z-50 max-md:px-5 max-md:h-[60px]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-10 h-10 bg-black rounded-[10px]">
          <span className="font-sora font-bold text-[22px] text-primary">B</span>
        </div>
        <span className="font-sora font-bold text-[26px] text-black tracking-tight max-md:text-xl">
          biko
        </span>
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-9">
        <Link href="#features" className="font-inter text-[15px] text-[#555555] hover:text-black transition-colors">
          Funcionalidades
        </Link>
        <Link href="#clients" className="font-inter text-[15px] text-[#555555] hover:text-black transition-colors">
          Para Clientes
        </Link>
        <Link href="#providers" className="font-inter text-[15px] text-[#555555] hover:text-black transition-colors">
          Para Prestadores
        </Link>
      </div>

      {/* Desktop CTAs */}
      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/login"
          className="font-inter font-semibold text-[15px] text-black px-6 py-2.5 rounded-lg hover:bg-black/5 transition-colors"
        >
          Entrar
        </Link>
        <Link
          href="/register"
          className="font-inter font-semibold text-[15px] text-black bg-primary px-6 py-2.5 rounded-lg hover:brightness-95 transition-all"
        >
          Cadastrar
        </Link>
      </div>

      {/* Mobile CTA */}
      <div className="md:hidden flex items-center gap-2.5">
        <Link
          href="/register"
          className="font-inter font-semibold text-sm text-black bg-primary px-4 py-2 rounded-lg"
        >
          Cadastrar
        </Link>
      </div>
    </nav>
  );
}
