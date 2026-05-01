'use client'; // Necessário para animações e eventos de clique

import React, { useEffect } from 'react';

export default function LandingPage() {
  
  // Função para Scroll Suave (substitui o onclick nativo)
  const scrollToContact = () => {
    const element = document.getElementById('contato');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Animação de entrada usando Intersection Observer (Equivalente ao seu <script>)
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      {/* Navegação */}
      <nav className="nav">
        <div className="nav-container">
          <div className="logo">BLENDIBOX</div>
          <button className="nav-cta" onClick={scrollToContact}>
            SOLICITAR ORÇAMENTO
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">Soluções B2B</span>
          <h1>Bolsas personalizadas que fortalecem sua marca</h1>
          <p className="hero-subtitle">
            Transforme bolsas puffer em poderosas ferramentas de branding para sua empresa, evento ou marca pessoal.
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Pedido Mínimo</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15</div>
              <div className="stat-label">Dias Úteis</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Personalizável</div>
            </div>
          </div>

          <button className="hero-cta" onClick={scrollToContact}>
            INICIAR MEU PEDIDO <span>→</span>
          </button>
        </div>

        <div className="hero-image">
          <div className="hero-image-main"></div>
          <div className="hero-badge">
            <div className="badge-text">Cases de Sucesso</div>
            <div className="badge-subtext">Mboom, Fitaup, Pamby Pamela e outras marcas já confiam na Blendibox</div>
          </div>
        </div>
      </section>

      {/* Benefícios (Exemplo de Card com Classe de Animação) */}
      <section className="benefits">
        <div className="section-header">
          <div className="section-label">Vantagens Exclusivas</div>
          <h2 className="section-title">Por que escolher a Blendibox para seu projeto B2B?</h2>
        </div>
        
        <div className="benefits-grid">
          {[
            { icon: "🎨", title: "Personalização Total", text: "Cores customizadas, bordados, patches e mais." },
            { icon: "⚡", title: "Produção Ágil", text: "Entrega garantida em 15-20 dias úteis." },
            { icon: "💎", title: "Qualidade Premium", text: "Materiais duráveis e acabamento impecável." },
            { icon: "📦", title: "Pedido Mínimo", text: "A partir de apenas 50 unidades." }
          ].map((benefit, index) => (
            <div key={index} className="benefit-card reveal">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-text">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seção Final de Contato */}
      <section className="cta-final" id="contato">
        <div className="cta-final-content">
          <h2>Pronto para criar bolsas que representam sua marca?</h2>
          <p>Entre em contato agora e receba uma proposta personalizada em até 48 horas.</p>
          <a href="mailto:contato@blendibox.com.br" className="cta-final-button">FALAR COM ESPECIALISTA</a>
        </div>
      </section>

      <footer className="footer">
         <div className="footer-container">
            <div className="footer-logo">BLENDIBOX</div>
            <p>© 2026 Blendibox. Todos os direitos reservados.</p>
         </div>
      </footer>
    </main>
  );
}
