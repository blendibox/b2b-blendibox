/**
 * Blendibox — captura de lead do form de orçamento.
 * Recebe a simulação (POST JSON) e envia por e-mail via Resend.
 * Segredos (wrangler secret put): RESEND_API_KEY, TO_EMAIL
 * Vars (wrangler.jsonc): FROM_EMAIL, ALLOWED_ORIGIN
 */

export interface Env {
  RESEND_API_KEY: string;
  TO_EMAIL: string;
  FROM_EMAIL: string;
  ALLOWED_ORIGIN: string;
}

function cors(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

const esc = (v: unknown) =>
  String(v ?? "—").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.ALLOWED_ORIGIN || "*";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin) });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: cors(origin) });
    }

    let data: Record<string, unknown>;
    try {
      data = (await request.json()) as Record<string, unknown>;
    } catch {
      return json({ ok: false, error: "invalid json" }, 400, origin);
    }

    const abandono = data.motivo === "abandono";
    const quem = esc(data.empresa) !== "—" ? esc(data.empresa) : esc(data.whatsapp);
    const assunto = abandono
      ? `🟡 Lead abandonou simulação — ${quem}`
      : `🟢 Nova simulação — ${quem}`;
    const motivoTxt = abandono
      ? "ABANDONO (preencheu o form mas não abriu o WhatsApp)"
      : "Clicou em enviar no WhatsApp";

    const linha = (k: string, v: unknown) =>
      `<tr><td style="padding:4px 10px;color:#766654">${k}</td>` +
      `<td style="padding:4px 10px;font-weight:600">${esc(v)}</td></tr>`;

    const waDigits = String(data.whatsapp ?? "").replace(/\D/g, "");
    // Formato internacional p/ wa.me: inclui o 55 quando o número veio só com DDD
    const waIntl = waDigits && waDigits.length <= 11 && !waDigits.startsWith("55")
      ? "55" + waDigits
      : waDigits;

    // Em abandono, abre o WhatsApp já com uma mensagem de recuperação amigável
    // (pré-preenchida — você revisa e envia). Personaliza com modelo/quantidade.
    const modeloOk = data.modelo && data.modelo !== "não informado";
    const temQtd = data.quantidade != null && data.quantidade !== "";
    let detalhe = "";
    if (temQtd && modeloOk) detalhe = ` de ${data.quantidade} ${data.modelo}`;
    else if (modeloOk) detalhe = ` do modelo ${data.modelo}`;
    const empresaTxt = data.empresa ? ` para a ${data.empresa}` : "";
    const recado =
      `Oi! 💙 Aqui é da Blendibox. Vi que você começou a montar um orçamento` +
      `${detalhe}${empresaTxt} no nosso site e talvez tenha ficado alguma dúvida. ` +
      `Posso te ajudar a finalizar? Qualquer coisa, estou por aqui!`;

    const waHref = abandono
      ? `https://wa.me/${waIntl}?text=${encodeURIComponent(recado)}`
      : `https://wa.me/${waIntl}`;
    const waLabel = abandono
      ? "Chamar no WhatsApp com mensagem de recuperação →"
      : "Abrir conversa no WhatsApp →";

    const html = `
      <div style="font-family:system-ui,Arial,sans-serif;max-width:520px">
        <h2 style="margin:0 0 4px">${quem}</h2>
        <p style="margin:0 0 12px;color:#766654">${motivoTxt}</p>
        <table style="border-collapse:collapse;font-size:14px">
          ${linha("WhatsApp", data.whatsapp)}
          ${linha("Empresa/marca", data.empresa)}
          ${linha("Modelo", data.modelo)}
          ${linha("Quantidade", data.quantidade)}
          ${linha("Cor", data.cor)}
          ${linha("Personalização", data.personalizacao)}
          ${linha("Logo", data.logo)}
          ${linha("Data necessária", data.data)}
          ${linha("Estimativa/un", data.estimativaUnit != null ? "R$ " + esc(data.estimativaUnit) : "—")}
          ${linha("Total aprox.", data.estimativaTotal != null ? "R$ " + esc(data.estimativaTotal) : "—")}
          ${linha("Prazo", data.prazo)}
          ${linha("Quando", data.ts)}
        </table>
        ${waIntl ? `<p style="margin:12px 0 0"><a href="${waHref}">${waLabel}</a></p>` : ""}
      </div>`;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: [env.TO_EMAIL],
        subject: assunto,
        html,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return json({ ok: false, error: "resend", detail }, 502, origin);
    }
    return json({ ok: true }, 200, origin);
  },
};

function json(body: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(origin), "Content-Type": "application/json" },
  });
}
