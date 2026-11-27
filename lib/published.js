const { url, publishableKey } = require('../supabase-config.js');
const origin = 'https://pskbeyzaomultay.com';
const cardFields = 'slug,title,category,description,image_url,is_short,source_author,created_at,updated_at';
const profileFields = 'about,education,expertise,contact_email,instagram_url,linkedin_url,cv_pdf_url,portrait_url';

async function request(path, params, token) {
  const endpoint = new URL(path, url);
  endpoint.search = new URLSearchParams(params);
  const headers = { apikey: publishableKey };
  if (token) headers.Authorization = 'Bearer ' + token;
  return fetch(endpoint, { headers, signal: AbortSignal.timeout(8000) });
}

async function rows(table, params) {
  const response = await request('/rest/v1/' + table, params);
  if (!response.ok) throw new Error('Public content unavailable');
  return response.json();
}

async function published(params, all = false) {
  const result = [];
  do {
    const page = await rows('articles', { published: 'eq.true', order: 'created_at.desc,slug.asc', ...params,
      ...(all ? { limit: 250, offset: result.length } : {}) });
    result.push(...page);
    if (!all || page.length < 250) break;
  } while (true);
  return result;
}

function cache(res, tag) {
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('Vercel-CDN-Cache-Control', 'public, max-age=60');
  res.setHeader('Vercel-Cache-Tag', tag);
}

function escapeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
}

module.exports = { request, rows, published, cache, escapeText, origin, cardFields, profileFields };
