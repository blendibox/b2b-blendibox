"use client";

import { useEffect, useRef } from "react";


export default function Menu() {

  // Função para Scroll Suave (substitui o onclick nativo)
  const scrollToContact = () => {
    const element = document.getElementById('contato');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    
	   <main>
	{/* Navegação */}
      <nav className="nav">
        <div className="nav-container">
          <div className="logo"><a href='/'>
		    <img src="/images/logoblendibox.webp" ></img>
		  </a></div>
          <button className="nav-cta" onClick={scrollToContact}>
            SOLICITAR ORÇAMENTO
          </button>
        </div>
      </nav>
	  </main>
  );
}