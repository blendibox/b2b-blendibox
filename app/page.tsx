'use client'; // Necessário para animações e eventos de clique

import React, { useEffect } from 'react';

import VideoAutoPlay from "./VideoAutoPlay";
import VideoAutoPlay2 from "./VideoAutoPlay2";
import Footer from "./Footer";
import Menu from "./Menu";

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
      <Menu/>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">Soluções B2B</span>
          <h1>Bolsas personalizadas que fortalecem sua marca</h1>
          <p className="hero-subtitle">
            Transforme Bolsas Puffer em poderosas ferramentas de branding para sua empresa, evento ou marca pessoal.
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Pedido Mínimo</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">+-15</div>
              <div className="stat-label">Dias Úteis*</div>
			 
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Arte Personalizável</div>
            </div>
			 <small>*Verifique prazo no orçamento.</small>
          </div>

          <button className="hero-cta" onClick={scrollToContact}>
            INICIAR MEU PEDIDO <span>→</span>
          </button>
        </div>

        <div className="hero-image">
          <div className="hero-image-main">
		  <VideoAutoPlay/>
		  </div>
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
          <h2 className="section-title">Por que escolher a Blendibox para seu Projeto?</h2>
        </div>

		
        <div className="benefits-grid">
          {[
		    { icon: "💎", title: "Alto Valor Percebido", text: "Ideal para Press Kits, Eventos e ações de Marketing" },
            { icon: "⚡", title: "Trend", text: "Transformamos sua marca em uma Bolsa Puffer Viral" },
            { icon: "🎨", title: "Artesanal", text: "Do seu logo à bolsa pronta,tudo feito por pessoas!" },          
            { icon: "📦", title: "Pedido Mínimo", text: "A partir de apenas 50 unidades." }
          ].map((benefit, index) => (
            <div key={index} className="benefit-card reveal">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-text">{benefit.text}</p>
            </div>
          ))}
        </div>
		<div style={{marginTop: 6 + 'em'}}>
	
		
		
		
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">Expresse sua idéia</span>
          <h1>Personalizado de Verdade!</h1>
          <p className="hero-subtitle">
            Use nossa ferramenta para dar asas à sua imaginação!
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">Passo 1</div>
              <div className="stat-label">Suba a imagem Principal</div>
            </div>
			<div className="stat-item">
              <div className="stat-number">Passo 2</div>
              <div className="stat-label">Posicione a sua Arte</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">Passo 3</div>
              <div className="stat-label">Escolha a Bolsa e Cor</div>
            </div>
            
          </div>

          <button className="hero-cta" >
            <a href='/studio'>ACESSAR PUFFER STUDIO  <span>→</span></a>
          </button>
        </div>

        <div className="hero-image">
          <div className="hero-image-main">
		  	<VideoAutoPlay2/>
		  </div>
          <div className="hero-badge">
            <div className="badge-text">Use sua Criatividade</div>
            <div className="badge-subtext">Faça um teste de como ficará sua bolsa</div>
          </div>
        </div>
      </section>
		
		</div>
			<div style={{marginTop: 10 + 'em'}}></div>
		     <div className="section-header">
			    
             <h3 className="section-title">Aqui, sua criatividade vira peça exclusiva!</h3>
			 <div className="section-label" style={{marginTop: 2 + 'em'}}>Veja Alguns Exemplos:</div>
           </div>
		
		  <div className="benefits-grid">
          {[
		    { icon: "💎", title: "Costuras Horizontais (puffer clássico)", text: "./images/maxitote_vermelha.png" },
            { icon: "⚡", title: "Corações Bordados", text: "./images/maxitote_lilas.png" },
			{ icon: "📦", title: "Costura Puffer de corações", text: "./images/maxitote_verde.jpg" },
            { icon: "🎨", title: "Puffer com o tema flores", text: "./images/maxipuffer_lilas.jpg" }  ,       
            { icon: "⚡", title: "Puffer Coração grande", text: "./images/coracao.png" },
			{ icon: "📦", title: "Costura Puffer fitness", text: "./images/verdefit.png" },
            { icon: "🎨", title: "Puffer com o tema beleza", text: "./images/rosaspa.png" } ,        
            { icon: "🎨", title: "Costura Puffer fitness", text: "./images/amarelofit.png" } 
          ].map((benefit, index) => (
            <div key={index} className="benefit-card reveal">
              <h3 className="benefit-title">{benefit.title}</h3>
			  <div className="card-image">
              <img   alt={benefit.title} src={benefit.text}></img>
               </div>
			</div>
          ))}
        </div>
      </section>

     

    <Footer/>
    </main>
  );
}
