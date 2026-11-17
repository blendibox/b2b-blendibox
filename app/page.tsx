'use client'; // Necessário para animações e eventos de clique

import React, { useEffect, useState } from 'react';

import VideoAutoPlay from "./VideoAutoPlay";
import Footer from "./Footer";
import Menu from "./Menu";

/* ═══════════════════════════════════════════════
   DADOS DE ORÇAMENTO (fonte única de preços)
   Desconto aplicado SÓ na bolsa. Bordado 1 cor
   (R$ 12/un) incluso, sem desconto.
═══════════════════════════════════════════════ */
const WA_NUMBER = "5519998061426";
const BORDADO = 12.0;
const UNID_POR_SEMANA = 25; // produção base do corpo — ajuste aqui
const BORDADOS_POR_DIA = 40; // bordado: 5/hora × 8h — somado ao prazo quando há personalização

// Endpoint do Worker (Cloudflare + Resend) que recebe a captura de lead e envia por e-mail.
// Deixe "" enquanto o Worker não estiver no ar: a captura fica desativada e o form segue funcionando.
const CAPTURE_ENDPOINT = "";

const MODELOS = [
  { id: "maxi-tote",   nome: "Maxi Tote",   base: 150.0,  img: "/images/bolsa_maxitote_medidas.png",  dim: "40 × 35 cm",            use: "Mais espaço — campanhas e dia a dia." },
  { id: "tote-g",      nome: "Tote G",      base: 160.0,  img: "/images/toteg.webp",                  dim: "45 × 36 × 12 cm",       use: "A maior — viagem, praia, muito espaço." },
  { id: "shopper",     nome: "Shopper",     base: 96.0,   img: "/images/bolsa_shopper_alca_nylon_blendibox.jpg", dim: "45 × 40 × 12 cm", use: "Alça de nylon — espaçosa e resistente." },
  { id: "maxi-puffer", nome: "Maxi Puffer", base: 89.9,   img: "/images/maxi_puffer_medidas.png",      dim: "30 × 30 cm",            use: "A original, compacta." },
  { id: "3-em-1",      nome: "3 em 1",      base: 79.0,   img: "/images/bolsa-puffer-3-em-1-de-ombro-transversal-e-mochila-blendibox-3em1-puffer-preto-6ae4f26c27bdc-large.jpg", dim: "Ombro · Transversal · Mochila", use: "Converte em 3 jeitos — a mais versátil." },
];

const QUANTIDADES = [10, 50, 100, 150, 200, 250, 300];
const DESCONTO: Record<number, number> = { 10: 0, 50: 0.10, 100: 0.20, 150: 0.25, 200: 0.25, 250: 0.28, 300: 0.30 };
const CORES = ["Marinho", "Preto", "Areia", "Marrom", "Rosa", "Outra"];

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Data (yyyy-mm-dd) prevista = hoje + semanas de prazo
const dataPrevistaISO = (semanas: number) => {
  const d = new Date();
  d.setDate(d.getDate() + semanas * 7);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};
const dataBR = (iso: string) => (iso ? new Date(iso + "T00:00:00").toLocaleDateString("pt-BR") : "");

// WhatsApp: só dígitos; válido = 10 a 13 dígitos (com ou sem DDI/DDD)
const soDigitos = (s: string) => s.replace(/\D/g, "");
const whatsappValido = (s: string) => { const d = soDigitos(s); return d.length >= 10 && d.length <= 13; };

export default function LandingPage() {

  /* ── Form de orçamento ── */
  const [showForm, setShowForm] = useState(false);
  const [empresa, setEmpresa]   = useState("");
  const [modeloId, setModeloId] = useState("");
  const [qtd, setQtd]           = useState<number | "">("");
  const [cor, setCor]           = useState("");
  const [comBordado, setComBordado] = useState(true);
  const [data, setData]         = useState("");
  const [dataTouched, setDataTouched] = useState(false);
  const [logo, setLogo]         = useState("");
  const [erro, setErro]         = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [consent, setConsent]   = useState(false);
  const abandonoRef  = React.useRef(false);
  const hidratadoRef = React.useRef(false);

  const openForm = () => { setErro(""); setShowForm(true); };

  // Estimativa ao vivo
  const modeloSel = MODELOS.find((m) => m.id === modeloId);
  const desc = typeof qtd === "number" ? (DESCONTO[qtd] ?? 0) : 0;
  const unit = modeloSel && typeof qtd === "number" ? modeloSel.base * (1 - desc) + (comBordado ? BORDADO : 0) : 0;
  const total = typeof qtd === "number" ? unit * qtd : 0;
  const temEstimativa = !!modeloSel && typeof qtd === "number";
  // Prazo = produção base (25/sem) + bordado (qtd ÷ 40/dia, só com personalização), em dias → semanas
  const prazoDias = typeof qtd === "number"
    ? (qtd / UNID_POR_SEMANA) * 7 + (comBordado ? qtd / BORDADOS_POR_DIA : 0)
    : 0;
  const prazoSemanas = typeof qtd === "number" ? Math.max(1, Math.round(prazoDias / 7)) : 0;
  const prazoLabel = `${prazoSemanas} ${prazoSemanas === 1 ? "semana" : "semanas"}`;

  // Sugere a data prevista (hoje + prazo) ao escolher a quantidade,
  // enquanto a cliente não ajustar manualmente.
  useEffect(() => {
    if (typeof qtd === "number" && !dataTouched) {
      setData(dataPrevistaISO(prazoSemanas));
    }
  }, [qtd, prazoSemanas, dataTouched]);

  // Permite que Menu/Footer (componentes separados) abram o form na home
  useEffect(() => {
    (window as any).openQuoteForm = () => setShowForm(true);
    return () => { try { delete (window as any).openQuoteForm; } catch {} };
  }, []);

  // Retomar simulação salva no navegador (localStorage) — só no cliente, após montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem("blendibox_orc");
      if (raw) {
        const s = JSON.parse(raw);
        if (s.whatsapp) setWhatsapp(s.whatsapp);
        if (s.empresa)  setEmpresa(s.empresa);
        if (s.modeloId) setModeloId(s.modeloId);
        if (typeof s.qtd === "number") setQtd(s.qtd);
        if (s.cor) setCor(s.cor);
        if (typeof s.comBordado === "boolean") setComBordado(s.comBordado);
        if (s.data) { setData(s.data); setDataTouched(true); }
        if (s.logo) setLogo(s.logo);
      }
    } catch {}
    hidratadoRef.current = true;
  }, []);

  // Persistir a simulação enquanto a pessoa preenche
  useEffect(() => {
    if (!hidratadoRef.current) return;
    try {
      localStorage.setItem("blendibox_orc", JSON.stringify({
        whatsapp, empresa, modeloId, qtd, cor, comBordado, data, logo,
      }));
    } catch {}
  }, [whatsapp, empresa, modeloId, qtd, cor, comBordado, data, logo]);

  // Monta o payload da simulação para captura (e-mail via Worker)
  function montarPayload(motivo: string) {
    return {
      motivo,
      whatsapp: whatsapp.trim(),
      empresa: empresa.trim(),
      modelo: modeloSel ? modeloSel.nome : (modeloId || "não informado"),
      quantidade: typeof qtd === "number" ? qtd : null,
      cor: cor || "a definir",
      personalizacao: comBordado ? "com bordado" : "sem bordado",
      logo: comBordado ? (logo || "a confirmar") : "—",
      data: data || "sem data",
      estimativaUnit: temEstimativa ? Number(unit.toFixed(2)) : null,
      estimativaTotal: temEstimativa ? Number(total.toFixed(2)) : null,
      prazo: typeof qtd === "number" ? prazoLabel : null,
      origem: typeof window !== "undefined" ? window.location.href : "",
      ts: new Date().toISOString(),
    };
  }

  // Envia a simulação ao Worker. Só captura com WhatsApp válido + consentimento.
  function capturaLead(motivo: string, usarBeacon = false) {
    if (!CAPTURE_ENDPOINT) return;            // Worker ainda não configurado
    if (!whatsappValido(whatsapp)) return;
    if (!consent) return;
    try {
      const body = JSON.stringify(montarPayload(motivo));
      if (usarBeacon && navigator.sendBeacon) {
        navigator.sendBeacon(CAPTURE_ENDPOINT, new Blob([body], { type: "application/json" }));
      } else {
        fetch(CAPTURE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {}
  }

  // Rede de segurança: preencheu WhatsApp + consentiu e saiu sem enviar → beacon (best-effort)
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden" && !abandonoRef.current && whatsappValido(whatsapp) && consent) {
        abandonoRef.current = true;
        capturaLead("abandono", true);
      }
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whatsapp, consent, empresa, modeloId, qtd, cor, comBordado, data, logo]);

  function enviarWhatsapp() {
    if (!whatsappValido(whatsapp)) {
      setErro("Informe um WhatsApp válido com DDD para continuar.");
      return;
    }
    if (!empresa.trim() || !modeloId || typeof qtd !== "number") {
      setErro("Preencha empresa, modelo e quantidade para continuar.");
      return;
    }
    if (!consent) {
      setErro("Marque o consentimento para prosseguir.");
      return;
    }
    // Captura o lead (e-mail via Worker) antes de abrir o WhatsApp; evita beacon duplicado
    abandonoRef.current = true;
    capturaLead("whatsapp");
    const linhas = [
      "Olá! Quero um orçamento de bolsas puffer personalizadas.",
      `• Empresa/marca: ${empresa.trim()}`,
      `• WhatsApp p/ retorno: ${whatsapp.trim()}`,
      `• Modelo: ${modeloSel ? modeloSel.nome : "Ainda não sei"}`,
      `• Quantidade: ${qtd} unidades`,
      `• Cor: ${cor || "a definir"}`,
      `• Data necessária: ${data || "sem data definida"}`,
      `• Personalização: ${comBordado ? "Com bordado da logo" : "Sem personalização (bolsa lisa)"}`,
    ];
    if (comBordado) {
      linhas.push(`• Logo vetorizada: ${logo || "a confirmar"}`);
    }
    if (temEstimativa) {
      linhas.push(`• Estimativa vista no site: ~${brl(unit)}/un · total ~${brl(total)}`);
    }
    if (typeof qtd === "number") {
      linhas.push(`• Prazo estimado: ~${prazoLabel}`);
    }
    const msg = encodeURIComponent(linhas.join("\n"));
    if (typeof window !== "undefined" && (window as any).gtag_report_conversion) {
      (window as any).gtag_report_conversion();
    }
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
    setShowForm(false);
  }

  // Animação de entrada usando Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('animate-fade-in');
      });
    }, { threshold: 0.1 });
    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <Menu/>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">Blendibox B2B</span>
          <h1>Bolsas puffer personalizadas para marcas que querem ser lembradas.</h1>
          <p className="hero-subtitle">
            Produção própria. Bordado personalizado. Projetos com a identidade da sua marca —
            do briefing à entrega, com atendimento próximo.
          </p>

          <button className="hero-cta" onClick={openForm}>
            SOLICITAR ORÇAMENTO <span>→</span>
          </button>
        </div>

        <div className="hero-image">
          <div className="hero-image-main">
            <VideoAutoPlay src="/video/bolsasQuiltBlendibox.mp4" />
          </div>
          <div className="hero-badge">
            <div className="badge-text">Marcas que já escolheram a Blendibox</div>
            <div className="badge-subtext">Mboom, Fitaup, Pamby Pamela e outras marcas já levaram a experiência Blendibox para seus clientes, equipes e eventos.</div>
          </div>
        </div>
      </section>

      {/* ── Catálogo ── */}
      <section className="benefits" id="modelos">
        <div className="section-header">
          <div className="section-label">Nosso catálogo</div>
          <h2 className="section-title">Encontre o modelo ideal para sua marca</h2>
          <p style={{ maxWidth: '640px', margin: '1em auto 0', color: '#6b5e52', textAlign: 'center' }}>
            Escolha o modelo, a cor e personalize com seu logo bordado. Projetos premium para eventos,
            press kits e ações de marca — não brinde genérico.
          </p>
        </div>
        <div className="benefits-grid">
          {MODELOS.map((m, index) => (
            <div key={index} className="benefit-card reveal">
              <div className="card-image"><img alt={m.nome} src={m.img} /></div>
              <h3 className="benefit-title">{m.nome}</h3>
              <p className="benefit-text"><strong>{m.dim}</strong><br/>{m.use}</p>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: '1.5em', color: '#6b5e52' }}>
          5 modelos · bordado personalizado incluso · condições especiais para pedidos em quantidade.
        </p>
        <div style={{ textAlign: 'center', marginTop: '1.2em' }}>
          <button className="hero-cta" onClick={openForm}>
            SOLICITAR ORÇAMENTO <span>→</span>
          </button>
        </div>
      </section>

      {/* ── Como funciona (4 passos) ── */}
      <section className="benefits" id="como-funciona">
        <div className="section-header">
          <div className="section-label">Simples do começo ao fim</div>
          <h2 className="section-title">Como funciona</h2>
        </div>
        <div className="benefits-grid">
          {[
            { n: "01", title: "Escolha seu modelo", text: "Encontre a bolsa que combina com sua proposta, seu público e a ocasião." },
            { n: "02", title: "Personalize com sua marca", text: "Envie sua logo e defina a posição do bordado. Nossa equipe orienta você durante o processo." },
            { n: "03", title: "Receba seu orçamento", text: "Informe a quantidade e a data desejada. Avaliamos a produção e apresentamos as condições e o prazo possíveis." },
            { n: "04", title: "Aprove e acompanhe a produção", text: "Com tudo alinhado, seguimos para a fabricação do seu pedido." },
          ].map((p, index) => (
            <div key={index} className="benefit-card reveal">
              <div className="benefit-icon">{p.n}</div>
              <h3 className="benefit-title">{p.title}</h3>
              <p className="benefit-text">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Prazo ── */}
      <section className="benefits" id="prazos">
        <div className="section-header">
          <div className="section-label">Planejamento sem surpresas</div>
          <h2 className="section-title">Sua data importa. Nosso prazo também.</h2>
          <p style={{ maxWidth: '680px', margin: '1.2em auto 0', color: '#6b5e52', textAlign: 'center', lineHeight: 1.7 }}>
            Tem um evento, lançamento ou campanha com data marcada? Conte para nós.
            Como fabricamos aqui dentro, analisamos a quantidade, a personalização e a disponibilidade
            de produção para informar um prazo possível <strong>antes</strong> de confirmar seu pedido.
            Cada projeto recebe uma previsão alinhada à sua necessidade.
          </p>
        </div>
      </section>

      {/* ── Por que escolher (pilares de fabricante) ── */}
      <section className="benefits">
        <div className="section-header">
          <div className="section-label">Fabricação própria</div>
          <h2 className="section-title">Por que escolher a Blendibox?</h2>
        </div>
        <div className="benefits-grid">
          {[
            { icon: "🏭", title: "Fabricação própria", text: "Produzimos aqui dentro — mais controle sobre o produto, o acabamento e o processo." },
            { icon: "🧵", title: "Bordado personalizado", text: "Sua marca aplicada diretamente à peça, com acabamento premium." },
            { icon: "👜", title: "Modelos versáteis", text: "Bolsas que acompanham diferentes momentos e ocasiões, não só o dia do evento." },
            { icon: "🤝", title: "Atendimento próximo", text: "Suporte para escolher, personalizar e planejar seu pedido do início ao fim." },
            { icon: "✨", title: "Projetos sob medida", text: "Soluções para press kits, eventos, presentes corporativos e ações de marca." },
          ].map((b, index) => (
            <div key={index} className="benefit-card reveal">
              <div className="benefit-icon">{b.icon}</div>
              <h3 className="benefit-title">{b.title}</h3>
              <p className="benefit-text">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Puffer Studio ── */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">Puffer Studio</span>
          <h1>Sua marca. Sua bolsa. Sua criação.</h1>
          <p className="hero-subtitle">
            Não precisa imaginar como vai ficar. Experimente combinações e visualize sua ideia antes de solicitar o orçamento.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">01</div>
              <div className="stat-label">Envie sua arte</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">02</div>
              <div className="stat-label">Posicione a personalização</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">03</div>
              <div className="stat-label">Escolha modelo e cor</div>
            </div>
          </div>

          <button className="hero-cta">
            <a href='/studio'>ACESSAR PUFFER STUDIO <span>→</span></a>
          </button>
          <small style={{ display: 'block', marginTop: '1em', color: '#6b5e52' }}>
            Uma ferramenta para explorar sua ideia. A personalização final é validada pela nossa equipe antes da produção.
          </small>
        </div>

        <div className="hero-image">
          <div className="hero-image-main">
            <VideoAutoPlay src="/video/pufferstudio.mp4" />
          </div>
          <div className="hero-badge">
            <div className="badge-text">Visualize antes de fechar</div>
            <div className="badge-subtext">Experimente modelos, cores e a posição do bordado</div>
          </div>
        </div>
      </section>

      {/* ── Ideias que viraram projetos ── */}
      <section className="benefits">
        <div className="section-header">
          <div className="section-label">Ideias que viraram projetos</div>
          <h2 className="section-title">Veja o que é possível criar com a Blendibox</h2>
          <p style={{ maxWidth: '640px', margin: '1em auto 0', color: '#6b5e52', textAlign: 'center' }}>
            Explore exemplos de bolsas personalizadas, combinações de cores e aplicações de bordado.
            Sua marca também pode ter um projeto exclusivo.
          </p>
        </div>
        <div className="benefits-grid">
          {[
            { title: "Costuras horizontais (puffer clássico)", img: "/images/maxitote_vermelha.png" },
            { title: "Corações bordados", img: "/images/maxitote_lilas.png" },
            { title: "Costura puffer de corações", img: "/images/maxitote_verde.jpg" },
            { title: "Puffer com o tema flores", img: "/images/maxipuffer_lilas.jpg" },
            { title: "Puffer coração grande", img: "/images/coracao.png" },
            { title: "Costura puffer fitness", img: "/images/verdefit.png" },
            { title: "Puffer com o tema beleza", img: "/images/rosaspa.png" },
            { title: "Costura puffer fitness", img: "/images/amarelofit.png" },
          ].map((ex, index) => (
            <div key={index} className="benefit-card reveal">
              <h3 className="benefit-title">{ex.title}</h3>
              <div className="card-image"><img alt={ex.title} src={ex.img} /></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Modal: Solicitar orçamento ── */}
      {showForm && (
        <div className="qf-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="qf-modal" role="dialog" aria-modal="true" aria-label="Solicitar orçamento">
            <div className="qf-header">
              <div>
                <div className="qf-title">Solicitar orçamento</div>
                <div className="qf-sub">Projetos premium · pedidos de 10 a 300 unidades</div>
              </div>
              <button className="qf-close" onClick={() => setShowForm(false)} aria-label="Fechar">✕</button>
            </div>

            <div className="qf-body">
              <label className="qf-field">
                <span>WhatsApp *</span>
                <input type="tel" inputMode="tel" value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(11) 90000-0000" />
                <small style={{ fontSize: '.74rem', color: '#766654', marginTop: '.1rem' }}>
                  Pra te enviarmos a simulação e dar sequência — com DDD.
                </small>
              </label>

              <label className="qf-field">
                <span>Empresa / marca *</span>
                <input type="text" value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Nome da sua empresa ou marca" />
              </label>

              <div className="qf-row">
                <label className="qf-field">
                  <span>Modelo *</span>
                  <select value={modeloId} onChange={(e) => setModeloId(e.target.value)}>
                    <option value="">Selecione…</option>
                    {MODELOS.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
                    <option value="nao-sei">Ainda não sei</option>
                  </select>
                </label>

                <label className="qf-field">
                  <span>Quantidade *</span>
                  <select value={qtd} onChange={(e) => setQtd(e.target.value ? Number(e.target.value) : "")}>
                    <option value="">Selecione…</option>
                    {QUANTIDADES.map((q) => <option key={q} value={q}>{q} unidades</option>)}
                  </select>
                </label>
              </div>

              {/* Preview do modelo selecionado */}
              {modeloSel && (
                <div className="qf-preview">
                  <img src={modeloSel.img} alt={modeloSel.nome} />
                  <div className="qf-preview-info">
                    <strong>{modeloSel.nome}</strong>
                    <span>{modeloSel.dim}</span>
                    <span className="qf-preview-use">{modeloSel.use}</span>
                  </div>
                </div>
              )}

              <label className="qf-field">
                <span>Com personalização (bordado)?</span>
                <select value={comBordado ? "sim" : "nao"} onChange={(e) => setComBordado(e.target.value === "sim")}>
                  <option value="sim">Sim — com bordado da logo (+ R$ 12/un)</option>
                  <option value="nao">Não — bolsa lisa, sem bordado</option>
                </select>
              </label>

              <div className="qf-row">
                <label className="qf-field">
                  <span>Cor</span>
                  <select value={cor} onChange={(e) => setCor(e.target.value)}>
                    <option value="">A definir</option>
                    {CORES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>

                <label className="qf-field">
                  <span>Data necessária</span>
                  <input type="date" value={data}
                    onChange={(e) => { setData(e.target.value); setDataTouched(true); }} />
                  {typeof qtd === "number" && (
                    <small style={{ fontSize: '.74rem', color: '#766654', marginTop: '.1rem' }}>
                      Previsão para {qtd} un: <strong>{dataBR(dataPrevistaISO(prazoSemanas))}</strong> (~{prazoLabel}). Ajuste se precisar.
                    </small>
                  )}
                </label>
              </div>

              {comBordado && (
                <label className="qf-field">
                  <span>Já tem a logo vetorizada? (.ai, .pdf ou .svg)</span>
                  <select value={logo} onChange={(e) => setLogo(e.target.value)}>
                    <option value="">Selecione…</option>
                    <option value="Sim">Sim, tenho o arquivo vetor</option>
                    <option value="Não / preciso de ajuda">Não / preciso de ajuda</option>
                  </select>
                  <small style={{ fontSize: '.75rem', color: '#766654', marginTop: '.1rem' }}>
                    📎 Depois de enviar, é só anexar o arquivo da logo aqui mesmo na conversa do WhatsApp.
                  </small>
                </label>
              )}

              {/* Estimativa ao vivo */}
              <div className="qf-estimate">
                {typeof qtd === "number" ? (
                  <>
                    {temEstimativa && (
                      <>
                        <div className="qf-est-label">Estimativa</div>
                        <div className="qf-est-value">~{brl(unit)} <span>/ unidade</span></div>
                        <div className="qf-est-total">Total aproximado: <strong>~{brl(total)}</strong></div>
                      </>
                    )}
                    <div className="qf-est-prazo">⏱ Prazo estimado: <strong>~{prazoLabel}</strong></div>
                    <div className="qf-est-note">
                      {temEstimativa && comBordado ? "Bordado 1 cor incluso (consulte-nos para até 3 cores). " : ""}
                      Prazo a partir do início da produção, que ocorre depois da aprovação da arte (e protótipo, se houver) e do pagamento (à vista ou sinal 50%). Valores e prazo finais confirmados no orçamento. Consulte-nos para fazer um protótipo.
                    </div>
                  </>
                ) : (
                  <div className="qf-est-note" style={{ textAlign: 'center' }}>
                    Selecione <strong>modelo</strong> e <strong>quantidade</strong> para ver a estimativa e o prazo.
                  </div>
                )}
              </div>

              <label className="qf-consent">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>Autorizo a Blendibox a usar meu WhatsApp para enviar esta simulação e dar continuidade ao orçamento.</span>
              </label>

              {erro && <div className="qf-erro">{erro}</div>}
            </div>

            <div className="qf-footer">
              <button className="qf-btn-sec" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="qf-btn-wa" onClick={enviarWhatsapp}>
                Enviar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .qf-overlay {
          position: fixed; inset: 0; z-index: 9000;
          background: rgba(26,20,14,.55); backdrop-filter: blur(5px);
          display: flex; align-items: center; justify-content: center;
          padding: 1.2rem; animation: qfIn .2s ease;
        }
        @keyframes qfIn { from { opacity: 0 } to { opacity: 1 } }
        .qf-modal {
          background: #fff; border-radius: 14px; width: 100%; max-width: 520px;
          max-height: 92vh; overflow-y: auto;
          box-shadow: 0 24px 70px rgba(0,0,0,.28);
          animation: qfUp .28s cubic-bezier(.16,1,.3,1);
        }
        @keyframes qfUp { from { transform: translateY(24px); opacity: 0 } to { transform: none; opacity: 1 } }
        .qf-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 1.2rem 1.4rem .9rem; border-bottom: 1px solid #efe7dc;
        }
        .qf-title { font-size: 1.3rem; font-weight: 800; color: #2a211a; letter-spacing: -.01em; }
        .qf-sub { font-size: .82rem; color: #766654; margin-top: .2rem; }
        .qf-close {
          background: none; border: none; font-size: 1.2rem; cursor: pointer;
          color: #766654; padding: .2rem .4rem; border-radius: 6px; line-height: 1;
        }
        .qf-close:hover { background: #f2ece4; color: #2a211a; }
        .qf-body { padding: 1.1rem 1.4rem; display: flex; flex-direction: column; gap: .9rem; }
        .qf-row { display: grid; grid-template-columns: 1fr 1fr; gap: .9rem; }
        .qf-field { display: flex; flex-direction: column; gap: .35rem; }
        .qf-field > span { font-size: .8rem; font-weight: 600; color: #6b5e52; }
        .qf-field input, .qf-field select {
          width: 100%; padding: .6rem .7rem; border: 1.5px solid #e3d8ca;
          border-radius: 8px; font-size: .92rem; color: #2a211a; background: #fff;
          font-family: inherit; outline: none; transition: border-color .15s;
        }
        .qf-field input:focus, .qf-field select:focus { border-color: #c9a36b; }
        .qf-consent {
          display: flex; align-items: flex-start; gap: .5rem;
          font-size: .8rem; color: #6b5e52; line-height: 1.4; cursor: pointer;
        }
        .qf-consent input { width: auto; margin-top: .15rem; flex-shrink: 0; }
        .qf-preview {
          display: flex; align-items: center; gap: .9rem;
          background: #faf6f0; border: 1px solid #ece0d0; border-radius: 10px;
          padding: .7rem .8rem;
        }
        .qf-preview img {
          width: 84px; height: 84px; object-fit: contain; flex-shrink: 0;
          background: #fff; border-radius: 8px; border: 1px solid #efe7dc;
        }
        .qf-preview-info { display: flex; flex-direction: column; gap: .15rem; }
        .qf-preview-info strong { font-size: 1rem; color: #2a211a; }
        .qf-preview-info span { font-size: .8rem; color: #766654; }
        .qf-preview-use { font-size: .78rem !important; color: #766654 !important; }
        .qf-estimate {
          background: linear-gradient(135deg,#faf4ea,#f3e9da);
          border: 1px solid #e8d9c2; border-radius: 10px;
          padding: .9rem 1rem; margin-top: .2rem; text-align: center;
        }
        .qf-est-label { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #8a6a30; }
        .qf-est-value { font-size: 1.7rem; font-weight: 800; color: #2a211a; margin-top: .15rem; }
        .qf-est-value span { font-size: .85rem; font-weight: 500; color: #766654; }
        .qf-est-total { font-size: .95rem; color: #4a3f34; margin-top: .25rem; }
        .qf-est-prazo { font-size: .95rem; color: #4a3f34; margin-top: .5rem; padding-top: .5rem; border-top: 1px dashed #e0cfb4; }
        .qf-est-note { font-size: .76rem; color: #766654; margin-top: .4rem; line-height: 1.5; }
        .qf-erro { background: #fdecec; color: #c0392b; font-size: .84rem; padding: .6rem .8rem; border-radius: 8px; }
        .qf-footer {
          display: flex; gap: .7rem; justify-content: flex-end;
          padding: .9rem 1.4rem 1.2rem; border-top: 1px solid #efe7dc;
        }
        .qf-btn-sec {
          padding: .7rem 1.1rem; background: #f2ece4; border: 1px solid #e3d8ca;
          color: #6b5e52; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: .9rem;
        }
        .qf-btn-sec:hover { background: #e9e0d4; }
        .qf-btn-wa {
          padding: .7rem 1.3rem; background: #128C7E; border: none;
          color: #fff; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: .92rem;
          box-shadow: 0 4px 14px rgba(18,140,126,.4); transition: all .2s;
        }
        .qf-btn-wa:hover { background: #0f7568; transform: translateY(-1px); }
        @media (max-width: 480px) {
          .qf-row { grid-template-columns: 1fr; }
          .qf-est-value { font-size: 1.45rem; }
        }
      `}</style>

      <Footer/>
    </main>
  );
}
