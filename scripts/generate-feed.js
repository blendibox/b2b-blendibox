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

  // Iguala g:sale_price = g:price
  const processedItems = blendiboxItems.map((item) => {
    const price = getTag(item, 'g:price');
    if (price) {
      return setTag(item, 'g:sale_price', price);
    }
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
