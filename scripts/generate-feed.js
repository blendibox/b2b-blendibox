#!/usr/bin/env node
/**
 * generate-feed.js
 * Busca o feed XML de origem, filtra itens com g:brand = Blendibox,
 * iguala g:sale_price ao g:price e salva em public/feed.xml
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const SOURCE_URL = process.env.SOURCE_FEED_URL;

if (!SOURCE_URL) {
  console.error('❌ SOURCE_FEED_URL não definida. Configure o secret no repositório.');
  process.exit(1);
}

// ─── Fetch com suporte a redirect ────────────────────────────────────────────
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'BlendiboxFeedBot/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} ao buscar ${url}`));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ─── Helpers XML ─────────────────────────────────────────────────────────────
function getTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = xml.match(re);
  return m ? m[1].trim() : null;
}

function setTag(xml, tag, value) {
  const re = new RegExp(`(<${tag}[^>]*>)[\\s\\S]*?(<\\/${tag}>)`, 'i');
  if (re.test(xml)) {
    return xml.replace(re, `$1${value}$2`);
  }
  // Se a tag não existir, insere antes de </item>
  return xml.replace(/<\/item>/i, `  <${tag}>${value}</${tag}>\n</item>`);
}

// ─── Extrai cor do g:mpn (após o último _) ───────────────────────────────────
function extractColor(item) {
  const mpn = getTag(item, 'g:mpn');
  if (mpn) {
    const parts = mpn.split('_');
    if (parts.length > 1) {
      return parts[parts.length - 1].trim();
    }
  }
  return 'preto';
}

// ─── Extrai item_group_id do g:mpn (remove a cor do final) ───────────────────
function extractGroupId(item) {
  const mpn = getTag(item, 'g:mpn');
  if (mpn) {
    const parts = mpn.split('_');
    return parts.length > 1 ? parts.slice(0, -1).join('_') : mpn;
  }
  return null;
}


// ─── Monta título otimizado para Google Shopping ─────────────────────────────
// Formato: Marca + Tipo + Feminina + Material + Cor
// Ex: "Blendibox Bolsa Puffer Feminina Nylon Preta"
const COLOR_MAP = {
  // cores simples
  preto: 'Preta', preta: 'Preta',
  branco: 'Branca', branca: 'Branca',
  rosa: 'Rosa',
  bege: 'Bege',
  azul: 'Azul',
  verde: 'Verde',
  vermelho: 'Vermelha', vermelha: 'Vermelha',
  amarelo: 'Amarela', amarela: 'Amarela',
  cinza: 'Cinza',
  marrom: 'Marrom',
  lilas: 'Lilás', lilás: 'Lilás',
  caramelo: 'Caramelo',
  nude: 'Nude',
  laranja: 'Laranja',
  // cores compostas (códigos do MPN → nome legível)
  amarinho:  'Azul Marinho',
  anoite:    'Azul Noite',
  vmenta:    'Verde Menta',
  agema:     'Amarelo Gema',
  vvinho:    'Vermelho Vinho',
  aserenity: 'Azul Serenity',
  rbebê:     'Rosa Bebê',   rbebe: 'Rosa Bebê',
  abebê:     'Azul Bebê',   abebe: 'Azul Bebê',
  vcherry:   'Vermelho Cherry',
  mmarrom:   'Marrom',
  acobalto:  'Azul Cobalto',
  vbandeira: 'Verde Bandeira',
  rpessego:  'Rosa Pêssego', 'rpêssego': 'Rosa Pêssego',
  voliva:    'Verde Oliva',
  vgarrafa:  'Verde Garrafa',
};

function buildTitle(item) {
  const brand       = getTag(item, 'g:brand') || 'Blendibox';
  const productType = getTag(item, 'g:product_type') || 'Bolsa';
  const color       = extractColor(item);
  const colorPt     = COLOR_MAP[color.toLowerCase()] || color.charAt(0).toUpperCase() + color.slice(1);

  // Tenta extrair o modelo do título original (ex: "Maxi Bolsa Puffer")
  const originalTitle = getTag(item, 'title') || '';
  // Pega só as primeiras palavras significativas antes do " - " ou do nome da marca
  // Remove a marca do título (início, fim ou após " - ") para isolar só o modelo
  let model = originalTitle
    .replace(/\s*[-–]\s*.+$/i, '')        // remove tudo após " - " (cor, marca etc)
    .replace(/\bBlendibox\b/gi, '')        // remove "Blendibox" onde ainda restar
    .replace(/\s{2,}/g, ' ')               // normaliza espaços duplos
    .trim();
  if (!model) model = productType;

  // Formato: Marca + Modelo + Feminina + Nylon + Cor
  return `${brand} ${model} Feminina Nylon ${colorPt}`;
}

// ─── Limpa e otimiza a descrição ─────────────────────────────────────────────
function cleanDescription(desc, item) {
  if (!desc) return '';

  let d = desc
    // Remove links (vídeos Shopee, URLs genéricas)
    .replace(/https?:\/\/\S+/g, '')
    // Normaliza espaços múltiplos
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  // Extrai dimensões antes de removê-las do meio do texto
  const dims = [];
  const altMatch   = d.match(/altura[:\s]+(\d+\s*cm)/i);
  const largMatch  = d.match(/largura(?!\s*da)[:\s]+(\d+\s*cm)/i);
  const baseMatch  = d.match(/largura\s*da\s*base[:\s]+(\d+\s*cm)/i);
  if (altMatch)  dims.push(`Altura: ${altMatch[1]}`);
  if (largMatch) dims.push(`Largura: ${largMatch[1]}`);
  if (baseMatch) dims.push(`Base: ${baseMatch[1]}`);

  // Remove o bloco de medidas do meio (será reposicionado no prefixo)
  d = d.replace(/medidas[^:]*:[\s\S]*?(?=feita|material|nylon|fechamento|o efeito)/i, '');

  // Remove frases genéricas sem valor informativo real
  d = d
    .replace(/descubra [^!]+!/gi, '')
    .replace(/transforme seu look[^!]+!/gi, '')
    .replace(/garanta a sua[^!]+!/gi, '')
    .replace(/seja a mulher[^!]+!/gi, '')
    .replace(/disponível em diversas cores[^!]+!/gi, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  // Monta prefixo rico com atributos-chave nos primeiros 160 chars
  const color   = extractColor(item);
  const colorPt = COLOR_MAP[color.toLowerCase()] || color.charAt(0).toUpperCase() + color.slice(1);
  const dimStr  = dims.length ? ` | Medidas: ${dims.join(', ')}` : '';
  const prefix  = `Bolsa Puffer feminina em nylon, cor ${colorPt}${dimStr}. `;

  const finalDesc = (prefix + d).replace(/[ \t]{2,}/g, ' ').trim();

  // Máximo 5000 chars (limite do Google)
  return finalDesc.substring(0, 5000);
}

// ─── Processamento ───────────────────────────────────────────────────────────
function processFeed(sourceXml) {
  // Captura o cabeçalho do <channel> (antes do primeiro <item>)
  const channelHeaderMatch = sourceXml.match(/<channel>([\s\S]*?)<item>/i);
  const channelHeader = channelHeaderMatch ? channelHeaderMatch[1] : '';

  // Extrai todos os <item>...</item>
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  const allItems = [];
  let match;
  while ((match = itemRegex.exec(sourceXml)) !== null) {
    allItems.push(match[0]);
  }

  console.log(`📦 Total de itens no feed: ${allItems.length}`);

  // Filtra somente itens da Blendibox
  const blendiboxItems = allItems.filter((item) => {
    const brand = getTag(item, 'g:brand');
    return brand && brand.toLowerCase() === 'blendibox';
  });

  console.log(`✅ Itens Blendibox filtrados: ${blendiboxItems.length}`);

  // Enriquece cada item
  const processedItems = blendiboxItems.map((item) => {
    // g:sale_price = g:price
    const price = getTag(item, 'g:price');
    if (price) item = setTag(item, 'g:sale_price', price);

    // g:description → limpa URLs, reposiciona medidas, otimiza primeiros 160 chars
    const rawDesc = getTag(item, 'description');
    if (rawDesc) item = setTag(item, 'description', cleanDescription(rawDesc, item));

    // g:color → extrai do g:mpn, fallback "preto"
    item = setTag(item, 'g:color', extractColor(item));

    // g:gender → fixo Female
    item = setTag(item, 'g:gender', 'Female');

    // g:age_group → fixo adult
    item = setTag(item, 'g:age_group', 'adult');

    // g:size → bolsas não têm tamanho, mas o Google exige o campo para acessórios
    item = setTag(item, 'g:size', 'One Size');

    // g:google_product_category → 166 = Apparel & Accessories > Handbags, Wallets & Cases > Handbags
    item = setTag(item, 'g:google_product_category', '166');

    // g:item_group_id → MPN sem a cor (ex: BBXMAXIPUFF_preto → BBXMAXIPUFF)
    // agrupa variantes do mesmo produto para o Google Shopping
    const groupId = extractGroupId(item);
    if (groupId) item = setTag(item, 'g:item_group_id', groupId);

    // g:material → nylon (material das bolsas Blendibox)
    item = setTag(item, 'g:material', 'nylon');

    // g:additional_image_link → gera 2 imagens extras trocando "large" por "medium" e "small"
    const imageLink = getTag(item, 'g:image_link');
    if (imageLink && imageLink.includes('large')) {
      const mediumLink = imageLink.replace('-large.', '-medium.');
      const smallLink  = imageLink.replace('-large.', '-small.');
      item = item.replace(/<\/item>/i,
        `  <g:additional_image_link>${mediumLink}<\/g:additional_image_link>\n  <g:additional_image_link>${smallLink}<\/g:additional_image_link>\n<\/item>`
      );
    }

    // g:title → reescreve no formato otimizado para Google Shopping
    // Formato: Marca + Modelo + Feminina + Nylon + Cor
    // Ex: "Blendibox Maxi Bolsa Puffer Feminina Nylon Preta"
    item = setTag(item, 'title', buildTitle(item));

    // ── Custom Labels para segmentação de campanhas no Google Ads ─────────────

    // custom_label_0 → marca (já existe no feed original, garante o valor)
    item = setTag(item, 'g:custom_label_0', 'Bolsas Blendibox');

    // custom_label_1 → faixa de preço (para lances diferenciados por valor)
    const priceRaw = getTag(item, 'g:price');
    if (priceRaw) {
      const priceNum = parseFloat(priceRaw.replace(/[^0-9.,]/g, '').replace(',', '.'));
      let priceRange = 'acima de 200';
      if      (priceNum <= 100) priceRange = 'ate 100';
      else if (priceNum <= 150) priceRange = '100 a 150';
      else if (priceNum <= 200) priceRange = '150 a 200';
      item = setTag(item, 'g:custom_label_1', priceRange);
    }

    // custom_label_2 → tipo de produto (Bolsa, Mochila, Necessaire etc)
    const productType = getTag(item, 'g:product_type') || '';
    let productLabel = 'Bolsa';
    if (/mochila/i.test(productType))    productLabel = 'Mochila';
    else if (/necessaire/i.test(productType)) productLabel = 'Necessaire';
    else if (/carteira/i.test(productType))   productLabel = 'Carteira';
    else if (/pochete/i.test(productType))    productLabel = 'Pochete';
    item = setTag(item, 'g:custom_label_2', productLabel);

    // custom_label_3 → cor legível (para campanhas segmentadas por cor)
    const colorVal = getTag(item, 'g:color') || 'Preta';
    item = setTag(item, 'g:custom_label_3', colorVal);

    return item;
  });

  const now = new Date().toISOString();

  const outputXml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Gerado automaticamente por Blendibox Feed Generator -->
<!-- Última atualização: ${now} -->
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
${channelHeader.trim()}

${processedItems.join('\n\n')}

</channel>
</rss>`;

  return { xml: outputXml, count: processedItems.length, updatedAt: now };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  try {
    console.log(`🔄 Buscando feed: ${SOURCE_URL}`);
    const sourceXml = await fetchUrl(SOURCE_URL);
    console.log(`📥 Recebido (${(sourceXml.length / 1024).toFixed(1)} KB)`);

    const { xml, count, updatedAt } = processFeed(sourceXml);

    // Salva em public/feed.xml (pasta padrão do Next.js para arquivos estáticos)
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

    fs.writeFileSync(path.join(publicDir, 'feed.xml'), xml, 'utf8');
    console.log(`💾 public/feed.xml salvo — ${count} itens | ${updatedAt}`);
    console.log('🎉 Concluído!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
})();
