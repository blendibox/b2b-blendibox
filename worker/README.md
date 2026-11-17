# blendibox-lead — Worker de captura de lead

Recebe a simulação do form de orçamento (POST JSON) e envia por e-mail via **Resend**.
Fica **separado** do site (o site é Cloudflare Pages / estático; este é um Worker).

## O que você precisa
- Conta Cloudflare (a mesma do site).
- Conta Resend (gratuita) → https://resend.com

## Passo a passo (uma vez)

1. **Instalar dependências** (dentro de `worker/`):
   ```bash
   cd worker
   npm install
   ```

2. **Criar a chave da Resend:** Resend → API Keys → *Create API Key* (copie o valor `re_...`).

3. **Logar na Cloudflare** (abre o navegador):
   ```bash
   npx wrangler login
   ```

4. **Definir os segredos** (não ficam no código):
   ```bash
   npx wrangler secret put RESEND_API_KEY
   # cole a chave re_... quando pedir

   npx wrangler secret put TO_EMAIL
   # digite o e-mail que vai RECEBER os leads
   ```

5. **Deploy:**
   ```bash
   npm run deploy
   ```
   O Wrangler imprime a URL pública do Worker, algo como
   `https://blendibox-lead.<sua-conta>.workers.dev`.

6. **Me mandar essa URL** — eu ligo ela no `CAPTURE_ENDPOINT` do site
   (`app/page.tsx`) e testamos a captura ponta a ponta.

## Remetente confiável (recomendado depois)
Por padrão o `FROM_EMAIL` usa `onboarding@resend.dev`, que só entrega para o
e-mail dono da conta Resend. Para enviar de forma confiável (e para qualquer
caixa), **verifique um domínio** na Resend (ela mostra os registros DNS para
adicionar no Cloudflare) e troque o `FROM_EMAIL` no `wrangler.jsonc` por algo
como `Blendibox <leads@blendibox.com.br>`. Depois rode `npm run deploy` de novo.

## Testar sem o site
```bash
curl -X POST https://blendibox-lead.<sua-conta>.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"motivo":"abandono","whatsapp":"11990000000","empresa":"Teste","modelo":"Maxi Tote","quantidade":100,"cor":"Preto","personalizacao":"com bordado","prazo":"5 semanas","ts":"2026-11-17T12:00:00Z"}'
```
Deve responder `{"ok":true}` e cair um e-mail no `TO_EMAIL`.
