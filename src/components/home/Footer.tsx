import Link from "next/link";

const PLATFORM_LINKS = [
  { label: "Feed", href: "/feed" },
  { label: "Busca", href: "/search" },
  { label: "Notificações", href: "/notifications" },
];

const ACCOUNT_LINKS = [
  { label: "Cadastrar", href: "/register" },
  { label: "Entrar", href: "/login" },
  { label: "Editar Perfil", href: "/profile" },
];

export function Footer() {
  return (
    <footer className="bg-dark-background w-full">
      {/* Desktop */}
      <div className="hidden md:flex items-start justify-between px-20 py-[60px] gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-4 w-[300px]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-lg">
              <span className="font-sora font-bold text-sm text-black">B</span>
            </div>
            <span className="font-sora font-bold text-[22px] text-white tracking-[-1px]">biko</span>
          </Link>
          <p className="font-inter text-sm text-[#555555] leading-relaxed">
            A rede social para serviços que conecta prestadores e clientes em todo o Brasil.
          </p>
          <p className="font-inter text-[13px] text-[#444444]">
            © 2025 Biko. Todos os direitos reservados.
          </p>
        </div>

        {/* Plataforma */}
        <FooterLinkGroup title="Plataforma" links={PLATFORM_LINKS} />

        {/* Conta */}
        <FooterLinkGroup title="Conta" links={ACCOUNT_LINKS} />
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-center h-[60px] px-6">
        <p className="font-inter text-xs text-white/30">© 2025 Biko · Todos os direitos reservados</p>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <span className="font-sora font-semibold text-sm text-white">{title}</span>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="font-inter text-sm text-[#555555] hover:text-white transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
