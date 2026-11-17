"use client";

import { useEffect, useRef } from "react";


export default function Menu() {

  // Abre o form de orçamento (na home) ou rola até o contato (outras páginas)
  const scrollToContact = () => {
    if (typeof window !== 'undefined' && (window as any).openQuoteForm) {
      (window as any).openQuoteForm();
      return;
    }
    const element = document.getElementById('contato');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    
	   <main>
	{/* Navegação */}
      <nav className="nav">
        <div className="nav-container">
          <div className="logo"><a href='/' aria-label="ir para a página principal">
		    <img src="/images/logoblendibox.webp" alt="marca Blendibox" ></img>
		  </a></div>
          <button className="nav-cta" onClick={scrollToContact}>
            SOLICITAR ORÇAMENTO
          </button>
        </div>
      </nav>
	  </main>
  );
}