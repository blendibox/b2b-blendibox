'use client';

import React, { useEffect } from 'react';
import Menu from "../Menu";
import Footer from "../Footer";
import VideoAutoPlay from "../VideoAutoPlay";

const WHATSAPP_NUMBER = "5519998061426"; // ← substitua pelo número real
const WHATSAPP_MSG = encodeURIComponent(
  "Olá! Vim pelo site e quero um orçamento de press kit personalizado para minha marca."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

const cases = [
  { name: "Mboom", project: "Press kit de lançamento", city: "São Paulo", image: 'images/mboom.png' },
  { name: "Toda Up", project: "Campanha com influenciadoras", city: "Nacional" , image: 'images/todaup.jpg'},
  { name: "Pam by Pamela", project: "Branding premium", city: "Coleção exclusiva" , image: 'images/pambypamela.png'},
];

const diferenciais = [
  {
    icon: "✨",
    title: "Campanhas Memoráveis",
    text: "Criamos bolsas puffer personalizadas que transformam ações promocionais em experiências premium.",
  },
  {
    icon: "📸",
    title: "Visual que Viraliza",
    text: "Peças desenvolvidas para impressionar em unboxings, eventos e conteúdos nas redes sociais.",
  },
  {
    icon: "🧵",
    title: "Quilt & Bordado Exclusivos",
    text: "Cada detalhe é pensado para refletir a identidade e o posicionamento da sua marca.",
  },
  {
    icon: "💎",
    title: "Muito Além de um Brinde",
    text: "Entregue uma peça útil, sofisticada e desejada — não apenas mais um item promocional.",
  },
];

const passos = [
  { num: "01", title: "Briefing", text: "Você envia o projeto, referências e identidade visual da marca." },
  { num: "02", title: "Arte", text: "Nossa equipe desenvolve o quilt e o bordado personalizados." },
  { num: "03", title: "Aprovação", text: "Você aprova a arte digital antes de irmos para produção." },
  { num: "04", title: "Entrega", text: "Produção e entrega em ±15 dias úteis após aprovação." },
];

const faq = [
  { q: "Qual o pedido mínimo?", a: "A partir de 50 unidades para projetos personalizados." },
  { q: "Vocês atendem todo o Brasil?", a: "Sim, enviamos para todo o território nacional." },
  { q: "Posso usar minha logo?", a: "Sim, podemos bordar sua marca ou logo." },
  { q: "Como recebo o orçamento?", a: "Via WhatsApp, com proposta detalhada em até 24h úteis." },
  { q: "Qual o prazo de produção?", a: "Em média ±15 dias úteis após confirmação do pedido." },
  { q: "Vocês fazem necessaires também?", a: "Sim, produzimos bolsas e necessaires puffer personalizadas." },
];

export default function PressKitPage() {

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToContact = () => {
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      <Menu />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">Press Kits Personalizados</span>
          <h1>Press kits que transformam lançamentos em experiências memoráveis</h1>
          <p className="hero-subtitle">
            Bolsas puffer com quilt e bordado exclusivos, desenvolvidas para marcas que querem
            causar impacto real — em unboxings, eventos e campanhas de influenciadores.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Pedido Mínimo</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">±15</div>
              <div className="stat-label">Dias Úteis*</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Arte Personalizável</div>
            </div>
            <small>*Verifique prazo no orçamento.</small>
          </div>

          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <button className="hero-cta" onClick={scrollToContact}>
              SOLICITAR ORÇAMENTO <span>→</span>
            </button>
          </a>
        </div>

        {/* Substitua o div abaixo por <VideoAutoPlay/> quando tiver o vídeo do press kit */}
        <div className="hero-image">
          <div className="hero-image-main" style={{height: 'auto'}}>
		  <VideoAutoPlay	
		  
			  src="/video/bypamela.mp4"
			/>
          </div>
          <div className="hero-badge">
            <div className="badge-text">Cases de Sucesso</div>
            <div className="badge-subtext">
              Mboom, Toda Up, Pam by Pamela e outras marcas já confiam na Blendibox
            </div>
          </div>
        </div>
      </section>

      {/* ── BARRA DE CREDIBILIDADE ── */}
      <section className="benefits" style={{ paddingTop: '3em', paddingBottom: '3em' }}>
        <div className="section-header">
          <div className="section-label">+ de 50 marcas e empresas atendidas</div>
          <h2 className="section-title">Projetos que viraram referência</h2>
        </div>

        <div className="benefits-grid reveal">
          {cases.map((c, i) => (
            <div key={i} className="benefit-card">
             <img src={c.image}></img>
            
              <h3 className="benefit-title">{c.name}</h3>
              <p className="benefit-text">{c.project} · {c.city}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIFERENCIAIS ── */}
      <section className="benefits">
        <div className="section-header">
          <div className="section-label">Vantagens Exclusivas</div>
          <h2 className="section-title">Por que escolher a Blendibox para seu press kit?</h2>
        </div>

        <div className="benefits-grid">
          {diferenciais.map((d, i) => (
            <div key={i} className="benefit-card reveal">
              <div className="benefit-icon">{d.icon}</div>
              <h3 className="benefit-title">{d.title}</h3>
              <p className="benefit-text">{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALERIA DE CASES ── */}
      <section className="benefits">
        <div className="section-header">
          <div className="section-label">Veja Alguns Projetos:</div>
          <h2 className="section-title">Bolsa para press kit</h2>
        </div>

        <div className="benefits-grid">
          {[
            { title: "Pam by Pamela · Branding", src: "./images/pambypamela_presskit.jpg" },
        
          ].map((item, i) => (
            <div key={i} className="benefit-card reveal">
              <h3 className="benefit-title">{item.title}</h3>
              <div className="card-image">
                <img src={item.src} alt={item.title} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="benefits">
        <div className="section-header">
          <div className="section-label">Processo</div>
          <h2 className="section-title">A bolsa do seu press kit em 4 passos</h2>
        </div>

        <div className="benefits-grid">
          {passos.map((p, i) => (
            <div key={i} className="benefit-card reveal">
              <div className="stat-number" style={{ marginBottom: '0.5em' }}>{p.num}</div>
              <h3 className="benefit-title">{p.title}</h3>
              <p className="benefit-text">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="benefits" id="faq">
        <div className="section-header">
          <div className="section-label">Dúvidas Frequentes</div>
          <h2 className="section-title">Perguntas sobre press kit personalizado</h2>
        </div>

        <div className="benefits-grid">
          {faq.map((item, i) => (
            <div key={i} className="benefit-card reveal">
              <h3 className="benefit-title">{item.q}</h3>
              <p className="benefit-text">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="benefits" id="contato">
        <div className="section-header reveal">
          <div className="section-label">Vamos conversar?</div>
          <h2 className="section-title">Pronta para transformar sua próxima campanha?</h2>
          <p className="hero-subtitle" style={{ maxWidth: 520, margin: '1em auto 0' }}>
            Fale com a nossa equipe pelo WhatsApp e receba uma proposta personalizada
            para o seu projeto em até 24 horas.
          </p>
          <div style={{ marginTop: '2em' }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <button className="hero-cta">
                QUERO MEU PRESS KIT PERSONALIZADO <span>→</span>
              </button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
