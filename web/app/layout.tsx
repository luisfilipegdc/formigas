import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Cabecalho from "@/components/Cabecalho";
import "./globals.css";

const titulo = Fraunces({ variable: "--fonte-titulo", subsets: ["latin"], display: "swap" });
const texto = Inter({ variable: "--fonte-texto", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Bio no Bolso", template: "%s · Bio no Bolso" },
  description: "Enciclopédia interativa da natureza para famílias e escolas.",
  // Versão em construção: fora do Google até o lançamento.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#164A3A" },
    { media: "(prefers-color-scheme: dark)", color: "#121715" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${titulo.variable} ${texto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Cabecalho />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">{children}</main>
        <footer className="border-t border-borda">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-suave flex flex-wrap gap-x-6 gap-y-2">
            <span>Bio no Bolso</span>
            <a href="/planos" className="hover:text-texto">Planos</a>
            <a href="/privacidade" className="hover:text-texto">Privacidade</a>
            <a href="/termos" className="hover:text-texto">Termos de uso</a>
            <a href="https://estudodebolso.com.br" className="hover:text-texto">Explorar os bichos</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
