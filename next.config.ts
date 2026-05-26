import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	
  output: 'export',
  reactStrictMode: true,

  async headers() {
    return [
      // ── Fontes, imagens e ícones — imutáveis (1 ano) ──────────────────────
      // O Next.js já faz hash no nome desses arquivos em build,
      // então pode cachear com segurança por 1 ano.
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // ── Imagens da pasta /public — 30 dias ────────────────────────────────
      // Sem hash no nome, então não pode ser "immutable".
      // 30 dias é seguro para imagens que mudam raramente.
      {
        source: "/:path*.(png|jpg|jpeg|webp|avif|svg|ico|gif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },

      // ── Vídeos — 7 dias com stale-while-revalidate ────────────────────────
      // O pufferstudio.mp4 estava com apenas 10 min.
      // 7 dias resolve o aviso do Lighthouse sem risco de servir versão velha
      // por muito tempo. Se o vídeo mudar, troque o nome do arquivo.
      {
        source: "/:path*.(mp4|webm|ogg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },

      // ── Fontes locais (se houver em /public/fonts) — 1 ano ───────────────
      {
        source: "/:path*.(woff|woff2|ttf|otf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // ── CSS e JS da pasta /public (não os do _next/static) ───────────────
      {
        source: "/:path*.(css|js)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=3600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;