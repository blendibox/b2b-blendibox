import React from 'react';

const faixas = [
  {
    vol: '5–100',
    label: 'unidades',
    featured: false,
    badge: null,
    prazo: '±15 dias úteis',
    artes: '1 arte inclusa',
    amostra: 'disponível',
    frete: 'a calcular',
    freteGood: false,
    tags: ['primeiro pedido', 'press kit', 'evento pequeno'],
    copy: 'Perfeito para testar a personalização, validar a arte com sua equipe ou montar um press kit de lançamento com volume controlado.',
  },
  {
    vol: '100–200',
    label: 'unidades',
    featured: true,
    badge: 'mais pedido',
    prazo: '±18 dias úteis',
    artes: 'até 2 artes',
    artesGood: true,
    amostra: 'disponível',
    frete: 'condições especiais',
    freteGood: true,
    tags: ['brinde corporativo', 'campanha', 'influenciadoras'],
    copy: 'A faixa favorita de agências e empresas. Custo por peça mais atrativo, duas artes distintas possíveis e frete com condições negociadas.',
  },
  {
    vol: '200+',
    label: 'unidades',
    featured: false,
    badge: null,
    prazo: 'a combinar',
    artes: 'múltiplas artes',
    artesGood: true,
    amostra: 'disponível',
    frete: 'negociado',
    freteGood: true,
    tags: ['grande escala', 'linha própria', 'produção recorrente'],
    copy: 'Para marcas que querem uma linha completa, revenda ou produção recorrente. Prazo, arte e condições de pagamento negociados diretamente com nossa equipe.',
  },
];

const WHATSAPP_NUMBER = '5511999999999'; // ← substitua pelo número real
const WHATSAPP_MSG = encodeURIComponent(
  'Olá! Vim pelo site e quero um orçamento de bolsas personalizadas por atacado.'
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

export default function VolumeSection() {
  return (
    <section className="benefits">
      <div className="section-header">
        <div className="section-label">Volumes e prazos</div>
        <h2 className="section-title">Quanto, em quanto tempo</h2>
        <p className="hero-subtitle" style={{ maxWidth: 520, margin: '0.5em auto 0' }}>
          Temos faixas pensadas para cada tipo de projeto — do pedido inicial a produções de grande escala.
        </p>
      </div>

      {/* Cards de faixas */}
      <div
        className="benefits-grid"
        style={{ alignItems: 'stretch' }}
      >
        {faixas.map((f, i) => (
          <div
            key={i}
            className="benefit-card reveal"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              border: f.featured ? '2px solid #00BFEA' : undefined,
            }}
          >
            {/* Badge */}
            {f.badge && (
              <div style={{
                position: 'absolute',
                top: -1,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#00BFEA',
                color: '#003d52',
                fontSize: 10,
                fontWeight: 600,
                padding: '3px 12px',
                borderRadius: '0 0 8px 8px',
                whiteSpace: 'nowrap',
                letterSpacing: '0.05em',
              }}>
                {f.badge}
              </div>
            )}

            {/* Volume */}
            <div style={{ paddingTop: f.badge ? 12 : 0 }}>
              <div className="stat-number" style={{ fontSize: 28, lineHeight: 1 }}>{f.vol}</div>
              <div className="stat-label" style={{ marginTop: 2 }}>{f.label}</div>
            </div>

            {/* Divisor */}
            <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.08)', margin: 0 }} />

            {/* Detalhes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Prazo', value: f.prazo, good: false },
                { label: 'Artes', value: f.artes, good: f.artesGood },
                { label: 'Amostra', value: f.amostra, good: false },
                { label: 'Frete', value: f.frete, good: f.freteGood },
              ].map((row, j) => (
                <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 12, opacity: 0.65 }}>{row.label}</span>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 500,
                    textAlign: 'right',
                    color: row.good ? '#1a9e5c' : 'inherit',
                  }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {f.tags.map((tag, j) => (
                <span key={j} style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  borderRadius: 20,
                  background: 'rgba(0,0,0,0.05)',
                  opacity: 0.8,
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Copy */}
            <p className="benefit-text" style={{ margin: 0, marginTop: 'auto' }}>{f.copy}</p>
          </div>
        ))}
      </div>

      {/* Nota de rodapé */}
      <div style={{
        marginTop: '2em',
        fontSize: 12,
        opacity: 0.6,
        lineHeight: 1.6,
        maxWidth: 600,
        margin: '2em auto 0',
        textAlign: 'center',
      }}>
        Todos os pedidos incluem aprovação de arte digital antes da produção.
        Prazos contam a partir da aprovação da arte e confirmação do pagamento.
        Amostras físicas disponíveis mediante orçamento.
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '2.5em' }}>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          <button className="hero-cta">
            SOLICITAR ORÇAMENTO POR ATACADO <span>→</span>
          </button>
        </a>
      </div>
    </section>
  );
}
