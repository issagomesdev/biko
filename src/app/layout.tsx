import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { QueryProvider } from "@/src/components/providers/QueryProvider";
import { Toaster } from "sonner";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-sora",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Biko",
  description: "A rede social de serviços que conecta prestadores e clientes.",
  icons: { icon: "/midia/icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      <body className={`${sora.variable} ${inter.variable} font-inter antialiased`}>
        <QueryProvider>{children}</QueryProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
