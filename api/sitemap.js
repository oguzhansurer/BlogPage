const { published, cache, origin, escapeText } = require('../lib/published');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control','no-store');
  if (!['GET','HEAD'].includes(req.method)) return res.status(405).end();
  try {
    const posts = await published({select:'slug,source_url,updated_at'}, true);
    const entries = ['/','/makaleler','/kisa-notlar','/ozgecmis','/calisma-alanlari']
      .map(path => '<url><loc>' + origin + path + '</loc></url>');
    for (const post of posts) {
      const location = origin + '/makale/' + encodeURIComponent(post.slug);
      let canonical;
      try { canonical = new URL(post.source_url); } catch { /* No external source */ }
      if (canonical && ['https:','http:'].includes(canonical.protocol) && canonical.href !== location) continue;
      const date = post.updated_at && new Date(post.updated_at);
      const modified = date && Number.isFinite(date.getTime()) ? '<lastmod>'+date.toISOString()+'</lastmod>' : '';
      entries.push('<url><loc>'+escapeText(location)+'</loc>'+modified+'</url>');
    }
    cache(res,'article-lists');
    res.setHeader('Content-Type','application/xml; charset=utf-8');
    return res.send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+entries.join('')+'</urlset>');
  } catch { return res.status(503).end(); }
};
