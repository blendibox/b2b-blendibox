import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond } from "next/font/google"
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "900"],
  variable: "--font-cinzel",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
})

export const metadata = {
  title: "Demiurgo Solar-Serpentino | Escape Gnóstico",
  description:
    "Explore a cosmologia do Demiurgo Solar-Serpentino, os sete arcontes planetários e o caminho além de Saturno rumo ao Pleroma.",
  keywords: [
    "gnosticismo",
    "demiurgo",
    "arcontes",
    "saturno oculto",
    "sete esferas planetárias",
    "escape da reencarnação",
    "pleroma",
	"demiurgo significado",
	"o que é gnosticismo",
	"arcontes gnósticos",
	"saturno ocultismo",
	"sete esferas planetárias",
	"escape da reencarnação",
	"pleroma significado",
	"cosmologia gnóstica explicação",
	"demiurgo solar serpente",
	"culto a saturno esoterismo",
	"como atravessar as sete esferas",
	"ogdóade significado gnóstico"

  ],
  openGraph: {
    title: "O Demiurgo Solar-Serpentino",
    description:
      "Descubra os sete arcontes e o caminho gnóstico de libertação.",
    url: "https://escapegnostico.blendibox.com.br/",
    siteName: "Escape Gnóstico",
	images: [
      {
        url: "https://escapegnostico.blendibox.com.br/demiurgo.jpeg",
        width: 2496,
        height: 1664,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
	<head>
	  <link rel="preconnect" href="https://fonts.googleapis.com" />
	</head>
      <body
        className={`${cinzel.variable} ${cormorant.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
