const { published, rows, cache, cardFields, profileFields } = require('../lib/published');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control','no-store');
  if (!['GET','HEAD'].includes(req.method)) return res.status(405).end();
  const kind = req.query.kind;
  let data;
  try {
    if (kind === 'profile') {
      [data] = await rows('site_profile', { select: profileFields, id:'eq.1' });
      if (!data) return res.status(503).end();
    } else if (['latest','articles','notes'].includes(kind)) {
      data = await published({ select:cardFields, is_short:kind === 'notes' ? 'eq.true':'eq.false',
        ...(kind === 'latest' ? {limit:3} : {}) }, kind !== 'latest');
    } else return res.status(404).end();
    cache(res, kind === 'profile' ? 'profile' : 'article-lists');
    return res.json(data);
  } catch {
    return res.status(503).json({error:'İçerik şu anda alınamadı.'});
  }
};
