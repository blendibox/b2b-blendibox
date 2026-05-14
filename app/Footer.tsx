"use client";

import { useEffect, useRef } from "react";


export default function Footer() {



  return (
    <main>
	 {/* Seção Final de Contato */}
      <section className="cta-final" id="contato">
        <div className="cta-final-content">
          <h2 style={{color:"#ffffff"}}>Transformamos sua Marca em uma Experiência Memorável!</h2>
          <p>Entre em contato agora e receba uma proposta personalizada em até 48 horas.</p>
          <a href="https://wa.me/+5519998061426?text=Tenho interesse em bolsas puffer personalizadas, e quero fazer um orçamento" className="cta-final-button">FALAR COM ESPECIALISTA</a>
        </div>
      </section>
	  <footer className="footer">
         <div className="footer-container">
            <div className="footer-logo">
			 <img src="/images/logoblendiboxbranco.png" ></img>
			</div>
            <p>© 2026 Blendibox. Todos os direitos reservados.</p>
			  <p>CNPJ: 17.08.-837.0001/69 |  Whatsapp: <a href="https://wa.me/+5519998061426?text=Tenho interesse em bolsas puffer personalizadas, e quero fazer um orçamento">(19) 99806-1426</a> </p>
              <p><small>Feito com ❤️ | São Paulo - Brasil</small></p>
		 </div>
      </footer>
	 </main>
  );
}