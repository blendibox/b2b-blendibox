"use client";

import { useEffect, useRef } from "react";


export default function Footer() {



  return (
    <main>
	 {/* Seção Final de Contato */}
      <section className="cta-final" id="contato">
        <div className="cta-final-content">
          <h2 style={{color:"#ffffff"}}>Crie "A" Bolsa! E deixe a sua Marca no Mundo!</h2>
          <p>Entre em contato agora e receba uma proposta personalizada em até 48 horas.</p>
          <a href="wa.me/+5519998061426?text=Tenho interesse em bolsas puffer Personalizada, poderia me fazer um orçamento de [QUANTIDADE] unidades, na cor[COR] do modelo [MODELO]?" className="cta-final-button">FALAR COM ESPECIALISTA</a>
        </div>
      </section>
	  <footer className="footer">
         <div className="footer-container">
            <div className="footer-logo">BLENDIBOX</div>
            <p>© 2026 Blendibox. Todos os direitos reservados.</p>
			  <p>CNPJ: 17.08.-837.0001/69</p>
         </div>
      </footer>
	 </main>
  );
}