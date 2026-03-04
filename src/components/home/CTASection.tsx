import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-primary w-full px-20 py-[100px] flex flex-col items-center gap-6 max-md:px-6 max-md:py-7 max-md:gap-5">
      <h2 className="font-sora font-bold text-[52px] text-black tracking-[-2px] text-center max-md:text-[30px] max-md:tracking-[-0.5px]">
        Pronto para começar?
      </h2>
      <p className="font-inter text-lg text-black/70 text-center max-md:text-[15px] max-md:max-w-[341px]">
        Junte-se a milhares de prestadores e clientes que já estão no Biko.
      </p>
      <Link
        href="/register"
        className="flex items-center justify-center bg-black text-primary font-inter font-bold text-lg px-[52px] py-[18px] rounded-xl hover:bg-black/85 transition-colors max-md:w-full max-md:h-[52px] max-md:text-base max-md:px-0"
      >
        Criar conta gratuita
      </Link>
    </section>
  );
}
