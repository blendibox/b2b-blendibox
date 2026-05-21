import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond } from "next/font/google"
import { Playfair_Display } from "next/font/google";
import Script from 'next/script';
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "900"],
  variable: "--font-cinzel",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
   title: {
	  default: "Blendibox | Bolsas Puffer Personalizadas",
	  template: "%s | Blendibox"
	},
	metadataBase: new URL(
	  "https://presskit.blendibox.com.br"
	),
  description: "A Blendibox é especialista em bolsas puffer personalizadas, nécessaires personalizadas e brindes corporativos premium para empresas, marcas, influenciadores e eventos. Criamos bolsas exclusivas com alto valor percebido para press kits, ações de marketing, lançamentos, academias, marcas fitness e campanhas publicitárias. Produzimos bolsas artesanais personalizadas com logo, tote bags puffer, nécessaires puffer e brindes criativos sob encomenda, transformando ideias em peças únicas e virais. Com pedido mínimo acessível, fabricação própria e personalização completa, a Blendibox ajuda marcas a fortalecerem sua identidade através de bolsas modernas, aesthetic e funcionais. Desenvolva sua bolsa personalizada com diferentes cores, formatos, costuras e estampas usando o Puffer Studio. Ideal para branding, eventos corporativos, kits para influenciadores e experiências premium.",
  keywords: [
  "bolsas personalizadas",
  "bolsa puffer personalizada",
  "necessaire personalizada",
  "nécessaire personalizada",
  "bolsa personalizada para empresas",
  "brindes corporativos personalizados",
  "press kit personalizado",
  "bolsa para evento personalizada",
  "bolsa com logo personalizada",
  "bolsas promocionais",
  "bolsas para marcas",
  "fornecedor de bolsas personalizadas",
  "fábrica de bolsas personalizadas",
  "bolsa puffer atacado",
  "bolsa personalizada atacado",
  "bolsas para influenciadoras",
  "brindes para lançamento de marca",
  "bolsa aesthetic personalizada",
  "bolsa personalizada para academia",
  "bolsa personalizada fitness",
  "necessaire puffer personalizada",
  "nécessaire puffer personalizada",
  "fornecedor de brindes corporativos",
  "bolsas para ações de marketing",
  "bolsas para eventos corporativos",
  "brindes premium personalizados",
  "brindes de alto valor percebido",
  "kits personalizados para empresas",
  "fabricação própria de bolsas",
  "bolsas personalizadas para marcas",
  "brindes para influencers",
  "bolsa personalizada para press kit",
  "bolsas para campanhas publicitárias",
  "brindes criativos para empresas",
  "bolsas promocionais premium",
  "bolsa puffer viral",
  "bolsa tumblr personalizada",
  "bolsa puffer aesthetic",
  "bolsa puff personalizada",
  "tote bag puffer",
  "bolsa puff rosa",
  "necessaire puffer",
  "nécessaire puffer",
  "bolsa fashion personalizada",
  "bolsa estilo pinterest",
  "bolsa tendência 2026",
  "bolsa coração puffer",
  "bolsa kawaii personalizada",
  "bolsas personalizadas no brasil",
  "fabricante de bolsas personalizadas",
  "brindes corporativos premium",
  "bolsa personalizada artesanal",
  "bolsa puffer com logo",
  "bolsa puff personalizada para marca",
  "fornecedor de bolsa puffer",
  "bolsas personalizadas femininas",
  "bolsas para branding",
  "bolsas para marketing",
  "brindes criativos personalizados",
  "empresa de bolsas personalizadas",
  "fabricante de tote bag personalizada",
  "tote bag personalizada",
  "bolsa personalizada luxo",
  "bolsa personalizada premium",
  "bolsa personalizada fashion",
  "bolsa personalizada moderna",
  "bolsas exclusivas personalizadas",
  "bolsa para influenciadora",
  "bolsa para criadores de conteúdo",
  "brindes para eventos",
  "brindes para academias",
  "brindes para marcas fitness",
  "bolsa fitness personalizada",
  "necessaire personalizada atacado",
  "nécessaire personalizada atacado",
  "bolsas em atacado personalizadas",
  "pedido mínimo bolsas personalizadas",
  "bolsa personalizada sob encomenda",
  "bolsa feita à mão personalizada",
  "bolsas artesanais personalizadas",
  "puffer studio",
  "blendibox",
  "bolsa personalizada blendibox",
  "necessaire personalizada blendibox",
  "bolsa puffer blendibox",
  "brindes corporativos blendibox"
],
  openGraph: {
    title: "Blendibox",
    description:
      "Bolsas personalizadas que fortalecem sua marca.",
    url: "https://presskit.blendibox.com.br",
    siteName: "Blendibox B2B",
	images: [
      {
        url: "https://presskit.blendibox.com.br/coracao.png",
        width: 2496,
        height: 1664,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
  card: "summary_large_image",

  title:
    "Blendibox | Bolsas Personalizadas Premium",

  description:
    "Bolsas puffer personalizadas para marcas, press kits e campanhas premium.",

  images: [
    "https://presskit.blendibox.com.br/coracao.png"
  ]
},

robots: {
  index: true,
  follow: true,

  googleBot: {
    index: true,
    follow: true,

    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
},
alternates: {
  canonical:
    "https://presskit.blendibox.com.br",
},
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const organizationSchema = {
    "@context": "https://schema.org",

    "@type": "Organization",

    name: "Blendibox",

    url: "https://presskit.blendibox.com.br",

    logo:
      "https://presskit.blendibox.com.br/coracao.png",

    sameAs: [
      "https://instagram.com/blendibox"
    ],

    description:
      "Bolsas puffer personalizadas premium para marcas, empresas e press kits."
  };
  


  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
		
      </head>

      <body
        className={`${cinzel.variable} ${cormorant.variable} ${playfair.variable} antialiased`}
      >
	  	   {/* Google Ads Tag — forma correta em Next.js */}
      <Script     src="https://www.googletagmanager.com/gtag/js?id=AW-10790588738"       strategy="afterInteractive" ></Script>
    <Script id="google-ads" strategy="afterInteractive">
	  {`
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'AW-10790588738');
	  `}
	</Script>
	<Script id="google-ads-conversion" strategy="afterInteractive">
  {`
    function gtag_report_conversion(url) {
      var callback = function () {
        if (typeof(url) != 'undefined') {
          window.location = url;
        }
      };
      gtag('event', 'conversion', {
        'send_to': 'AW-10790588738/9IulCL_PmrEcEMKirZko',
        'value': 1.0,
        'currency': 'BRL',
        'event_callback': callback
      });
      return false;
    }
  `}
</Script>
	
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              organizationSchema
            ),
          }}
        />
	

        {children}
      </body>
    </html>
  );
}