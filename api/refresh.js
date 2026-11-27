const { request } = require('../lib/published');
const { dangerouslyDeleteByTag } = require('@vercel/functions');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control','no-store');
  if (req.method !== 'POST') return res.status(405).end();
  const token = (req.headers.authorization || '').match(/^Bearer (\S+)$/)?.[1];
  if (!token) return res.status(401).end();
  try {
    const user = await request('/auth/v1/user', {}, token);
    if (!user.ok) return res.status(401).end();
    const { id } = await user.json();
    const admin = await request('/rest/v1/site_admins',{select:'user_id',user_id:'eq.'+id},token);
    if (!admin.ok || !(await admin.json()).length) return res.status(403).end();
    const { kind, slug } = req.body || {};
    let tags;
    if (kind === 'profile') tags = ['profile'];
    else if (kind === 'post' && typeof slug === 'string' && slug.length > 0 && slug.length <= 500)
      tags = ['article-lists','post-'+encodeURIComponent(slug).slice(0,220)];
    else return res.status(400).end();
    await dangerouslyDeleteByTag(tags,{revalidationDeadlineSeconds:0});
    return res.status(204).end();
  } catch { return res.status(503).end(); }
};
