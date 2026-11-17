"use client";

import { useEffect, useRef } from "react";


export default function Footer() {



  return (
    <main>
	 {/* Seção Final de Contato */}
      <section className="cta-final" id="contato">
        <div className="cta-final-content">
          <h2 style={{color:"#ffffff"}}>Sua marca merece sair do papel.</h2>
          <p>Vamos criar algo que as pessoas queiram levar com elas? Conte o que você está planejando — nossa equipe prepara uma proposta considerando modelo, quantidade, personalização e prazo. Resposta em até 48 horas.</p>
          <a 
		  
		   href="https://wa.me/+5519998061426?text=Tenho interesse em bolsas puffer personalizadas, e quero fazer um orçamento"
		  className="cta-final-button"
		  target="_blank"
		  rel="noopener noreferrer"
		  onClick={(e) => {
			if (typeof window !== 'undefined' && (window as any).openQuoteForm) {
			  e.preventDefault();
			  (window as any).openQuoteForm();
			  return;
			}
			if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
			  (window as any).gtag_report_conversion();
			}
		  }}
	     >
	        FALAR COM NOSSA EQUIPE
		</a>
        </div>
      </section>
	  <footer className="footer">	  
	   <div className="footer-container">      		 
		  <div className="footer-logo">			
			 <img src="/images/logoblendiboxbranco.png" alt="marca Blendibox"  ></img>
		  </div>					
	      <div className="footer-container">  
		    <button className="hero-cta"><a href="/">HOME</a> </button> 
            <button className="hero-cta"><a href="https://www.blendibox.com.br">LOJA</a> </button> 			
            <button className="hero-cta"><a href="/blog">BLOG</a></button>				  
            <button className="hero-cta"><a href="/studio">PUFFER STUDIO </a></button>
            <button className="hero-cta"><a 
			
			 className="cta-final-button"
			  target="_blank"
			  rel="noopener noreferrer"
			  onClick={() => {
				if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
				  (window as any).gtag_report_conversion();
				}
			  }}
			href="https://wa.me/+5519998061426?text=Olá! tenho interesse em orçar bolsas puffer no atacado">WHATSAPP </a></button>		
			
		  </div>
		  <small >© 2026 Blendibox. Todos os direitos reservados.</small>
	   </div>
      </footer>
	 </main>
  );
}