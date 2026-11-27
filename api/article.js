const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { published, cache, escapeText, origin, cardFields } = require('../lib/published');
const template = readFileSync(join(process.cwd(),'makale.html'),'utf8');
const placeholder = '<article class="article-inner" id="articleView">';
const back = '<a class="article-back" href="/makaleler">Makalelere dön</a>';

module.exports = async (req, res) => {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Type','text/html; charset=utf-8');
  if (!['GET','HEAD'].includes(req.method)) return res.status(405).end();
  const slug = req.query.id;
  function message(status, title) {
    res.setHeader('X-Robots-Tag','noindex');
    return res.status(status).send(template.replace('id="articleView"></article>', 'id="articleMessage"><h1>'+title+'</h1>'+back+'</article>'));
  }
  if (typeof slug !== 'string' || !slug || slug.length > 500) return message(404,'Bu yazı bulunamadı');
  try {
    const [post] = await published({select:cardFields+',body,source_title,source_date,source_publisher,source_url',slug:'eq.'+slug,limit:1});
    if (!post) return message(404,'Bu yazı bulunamadı');
    const pageUrl = origin + '/makale/' + encodeURIComponent(post.slug);
    let canonical = pageUrl;
    try {
      const source = new URL(post.source_url);
      if (['https:','http:'].includes(source.protocol)) canonical = source.href;
    } catch { /* Original publication on this site */ }
    const title = escapeText(post.title+' | Psikolog Beyza Nur Ömültay');
    const description = escapeText((post.description || post.body || '').slice(0,160));
    const data = JSON.stringify(post).replace(/</g,'\\u003c');
    const content = '<h1>'+escapeText(post.title)+'</h1><p>'+escapeText(post.description)+'</p><div class="article-body">'+escapeText(post.body)+'</div>'+back;
    const html = template.replace(/<title>.*?<\/title>/,()=>'<title>'+title+'</title>')
      .replace(/(<meta name="description" content=")[^"]*/,(_,start)=>start+description)
      .replace(/(<link rel="canonical" href=")[^"]*/,(_,start)=>start+escapeText(canonical))
      .replace(/(<meta (?:property|name)="(?:og|twitter):title" content=")[^"]*/g,(_,start)=>start+title)
      .replace(/(<meta (?:property|name)="(?:og|twitter):description" content=")[^"]*/g,(_,start)=>start+description)
      .replace(/(<meta property="og:url" content=")[^"]*/,(_,start)=>start+escapeText(pageUrl))
      .replace(/(<meta (?:property|name)="(?:og|twitter):image" content=")[^"]*/g,(_,start)=>start+escapeText(post.image_url))
      .replace(placeholder,()=>'<script type="application/json" id="publishedArticle">'+data+'</script>'+placeholder+content);
    cache(res,'post-'+encodeURIComponent(slug).slice(0,220));
    return res.send(html);
  } catch { return message(503,'Yazı şu anda yüklenemedi'); }
};
