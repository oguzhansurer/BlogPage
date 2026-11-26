(()=>{'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function safeExternalUrl(value){try{const u=new URL(String(value||''));return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}}
function sourceBlock(a){const url=safeExternalUrl(a.source_url),details=[a.source_title,a.source_author,a.source_publisher,a.source_date].filter(Boolean).map(esc);if(!url&&!details.length)return '';return '<aside class="source-citation">'+(url?'<a class="source-link" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Kaynak sayfasına gidin ↗</a>':'')+(details.length?'<p>'+details.join(' · ')+'</p>':'')+'</aside>'}
const stock=['https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'];
const demoArticles=[
 {id:'demo-1',slug:'duygularimiz-bize-ne-anlatir',category:'DUYGULAR',title:'Duygularımız bize ne anlatır?',description:'Hislerimizi bastırmadan, onlara biraz merakla yaklaşmak mümkün mü? Duyguların işlevine dair küçük bir giriş.',body:'Duygular, yaşadıklarımızı anlamlandırmamıza yardımcı olan içsel işaretlerdir. Bazen bizi korur, bazen bir ihtiyacımızı fark etmemizi sağlar.\n\nBir duyguyu hemen değiştirmeye çalışmadan önce ona isim vermek ve bedende nasıl hissedildiğini fark etmek küçük ama anlamlı bir başlangıç olabilir. Kendinize şu soruyu sorabilirsiniz: Bu duygu bana ne anlatmaya çalışıyor?\n\nHer duyguya alan açmak, her davranışı onaylamak demek değildir. Duyguyu merakla fark edip nasıl karşılık vereceğimizi seçebiliriz.',image_url:stock[0],date:'5 dk okuma'},
 {id:'demo-2',slug:'kendine-karsi-daha-yumusak-olmak',category:'ÖZ ŞEFKAT',title:'Kendine karşı daha yumuşak olmak',description:'İç sesimizi fark etmek ve kendimize yakın bir dostumuza davrandığımız gibi davranmayı denemek üzerine.',body:'Zorlandığımız anlarda kendimizle konuşma biçimimiz, deneyimimizi derinden etkileyebilir. İçimizden geçen cümleleri fark etmek, değişimin ilk adımıdır.\n\nYakın bir arkadaşımız aynı durumda olsaydı ona ne söylerdik? Bu yaklaşımı kendimize de sunmak, sorumluluktan kaçmak değil; güç toplamak için kendimize anlayış göstermektir.\n\nKendinize bugün küçük bir nezaket sunmayı deneyin. Bazen dinlenmek, bazen yardım istemek, bazen de yalnızca hissettiğimizi kabul etmek yeterlidir.',image_url:stock[1],date:'4 dk okuma'},
 {id:'demo-3',slug:'her-seyi-ayni-anda-cozmek-zorunda-degilsin',category:'FARKINDALIK',title:'Her şeyi aynı anda çözmek zorunda değilsin',description:'Belirsizlikle kalabilmek ve küçük adımlarla bugüne geri dönmek için birkaç düşünce.',body:'Bazen zihnimiz bütün cevapları hemen bulmamız gerektiğini söyler. Oysa belirsizlik içinde atılabilecek en doğru adım, yalnızca bir sonraki küçük adımdır.\n\nBugün kontrol edebildiğiniz tek bir şeyi seçin. Bir nefes, kısa bir mola ya da güvendiğiniz biriyle konuşmak, dikkatinizi şu ana geri getirebilir.\n\nKüçük adımlar önemsiz değildir; çoğu zaman kendimize yeniden güvenmeyi böyle öğreniriz.',image_url:stock[2],date:'6 dk okuma'}
];
const demoProfile={about:'Psikoloji, insanın kendisiyle ve çevresiyle kurduğu bağı anlamanın bitmeyen bir yolu. Bu sayfada psikoloji üzerine düşündüklerimi ve gündelik yaşama dokunan notları paylaşıyorum. Hakkımda yazısını içerik panelinden kendi bilgilerinle güncelleyebilirsin.',education:[{year:'Eğitim bilgisi',institution:'Üniversite ve bölüm bilgisini yönetim panelinden ekle.'}],expertise:['Duyguları tanımak ve anlamlandırmak','Öz şefkat ve kişisel farkındalık','İlişkiler ve iletişim'],contact_email:'',instagram_url:'',portrait_url:'https://vcpktnjgvmhxucwwhame.supabase.co/storage/v1/object/public/blog-covers/profile/portrait-1795555169802.jpg?v=1795555171153'};
const config=window.SUPABASE_CONFIG||{};
const configured=!!(window.supabase?.createClient&&config.url&&config.publishableKey&&!config.url.includes('PASTE_')&&!config.publishableKey.includes('PASTE_'));
const db=configured?window.supabase.createClient(config.url,config.publishableKey):null;
let articles=demoArticles,profile=demoProfile;const storyItems=new Map();

async function readProfile(){if(!db){console.warn('Supabase bağlantısı kurulamadı.');return demoProfile}const {data,error}=await db.from('site_profile').select('*').eq('id',1).maybeSingle();if(error||!data){console.warn('Site profili alınamadı.',error?.message||'Profil satırı yok.');return demoProfile}return data}
async function readArticles(limit){let list;if(!db)list=demoArticles;else{let query=db.from('articles').select('*').eq('published',true).eq('is_short',false).order('created_at',{ascending:false});if(Number.isInteger(limit))query=query.limit(limit);const {data,error}=await query;list=error||!data?demoArticles:data}return Number.isInteger(limit)?list.slice(0,limit):list}
async function readShortPosts(){if(!db)return [];const {data,error}=await db.from('articles').select('*').eq('published',true).eq('is_short',true).order('created_at',{ascending:false});return error||!data?[]:data}
function storyCardTools(article){
 storyItems.set(String(article.slug),article);const id=esc(article.slug),title=esc(article.title);
 return '<div class="story-card-actions"><button type="button" class="story-icon-button" data-story-download="'+id+'" aria-label="'+title+' hikâye görselini indir" titlfunction renderShortPosts(posts){
 const target=$('#shortPostCards');if(!target)return;
 posts.forEach(a=>storyItems.set(String(a.slug),a));
 target.innerHTML=posts.length?posts.map(a=>'<div class="story-card-shell"><article class="card story-card short-card"><a class="card-link" href="makale.html?id='+encodeURIComponent(a.slug)+'">'+(a.image_url?'<img class="card-cover" src="'+esc(a.image_url)+'" alt="Kapak görseli: '+esc(a.title)+'" loading="lazy">':'<div class="card-cover-placeholder">✳</div>')+'<div class="card-content"><div class="card-tag">'+esc(a.category)+' · '+esc(a.created_at?new Date(a.created_at).toLocaleDateString("tr-TR"):"Kısa not")+'</div><h2>'+esc(a.title)+'</h2><p>'+esc(a.description||a.body)+'</p><span class="readmore">NOTU OKU ↗</span></div></a></article>'+storyCardTools(a)+'</div>').join(''):'<div class="short-empty"><span class="eyebrow">Kısa notlar</span><p>Henüz kısa not yayınlanmadı. Yeni bir kısa not eklendiğinde burada görünecek.</p></div>'
}
async function initShortPage(){const target=$('#shortPostCards');if(!target)return;renderShortPosts(await readShortPosts());const year=$('#year');if(year)year.textContent=new Date().getFullYear()}
function renderCards(targetId='articleCards'){
 const target=$('#'+targetId);if(!target)return;
 target.innerHTML=articles.length?articles.map(a=>'<div class="story-card-shell"><article class="card story-card"><a class="card-link" href="makale.html?id='+encodeURIComponent(a.slug)+'">'+(a.image_url?'<img class="card-cover" src="'+esc(a.image_url)+'" alt="Kapak görseli: '+esc(a.title)+'" loading="lazy">':'<div class="card-cover-placeholder">✳</div>')+'<div class="card-content"><div class="card-tag">'+esc(a.category)+' · '+esc(a.date||'Yeni yazı')+'</div><h3>'+esc(a.title)+'</h3><p>'+esc(a.description)+'</p><span class="readmore">YAZININ TAMAMINI OKU ↗</span></div></a></article>'+storyCardTools(a)+'</div>').join(''):'<div class="article-empty">Henüz makale yayınlanmadı.</div>'
}
function renderProfile(){const about=$('#aboutText');if(about)about.innerHTML=String(profile.about||'').split('\n').filter(Boolean).map(p=>'<p>'+esc(p)+'</p>').join('');const education=$('#education');if(education)education.innerHTML=(profile.education||[]).map(x=>'<div class="cv-item"><b>'+esc(x.year||x[0]||'')+'</b><small>'+esc(x.institution||x[1]||'')+'</small></div>').join('');const expertise=$('#expertise');if(expertise)expertise.innerHTML=(profile.expertise||[]).map(x=>'<div class="cv-item"><b>'+esc(x)+'</b></div>').join('');renderContact();renderPortrait()}
function renderPortrait(){const portrait=$('.portrait'),image=$('#portraitPhoto');if(!portrait||!image)return;const url=String(profile.portrait_url||image.dataset.initialSrc||'').trim();if(!url){portrait.classList.remove('has-photo');image.hidden=true;image.removeAttribute('src');return}image.fetchPriority='high';image.loading='eager';image.decoding='async';image.onload=()=>{image.hidden=false;portrait.classList.add('has-photo')};image.onerror=()=>{image.hidden=true;portrait.classList.remove('has-photo')};if(image.src!==url)image.src=url;if(image.complete&&image.naturalWidth){image.hidden=false;portrait.classList.add('has-photo')}}
function validLinkedInUrl(value){try{const u=new URL(String(value||''));return ['https:','http:'].includes(u.protocol)&&['linkedin.com','www.linkedin.com'].includes(u.hostname.toLowerCase())&&/^\/(in|company|school)\/[^/]+\/?$/i.test(u.pathname)?u.href:''}catch{return ''}}
function renderContact(){const target=$('#contactLinks');if(!target)return;const links=[];const email=String(profile.contact_email||'').trim();if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))links.push('<a class="contact-link" href="mailto:'+esc(email)+'">E-posta: '+esc(email)+'</a>');let raw=String(profile.instagram_url||'').trim(),handle=raw;if(/^https?:\/\//i.test(raw)){try{const url=new URL(raw);if(!['instagram.com','www.instagram.com'].includes(url.hostname))raw='';else handle=url.pathname.split('/').filter(Boolean)[0]||''}catch{raw=''}}handle=handle.replace(/^@/,'');if(raw&&/^[a-zA-Z0-9._]{1,30}$/.test(handle))links.push('<a class="contact-link" href="https://www.instagram.com/'+encodeURIComponent(handle)+'/" target="_blank" rel="noopener noreferrer">Instagram: @'+esc(handle)+'</a>');const linkedIn=validLinkedInUrl(profile.linkedin_url);if(linkedIn)links.push('<a class="contact-link" href="'+esc(linkedIn)+'" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>');target.innerHTML=links.join('')||'<p class="contact-empty">İletişim bilgileri henüz görüntülenemiyor.</p>'}
async function initHome(){if(!$('#articleCards'))return;[articles,profile]=await Promise.all([readArticles(3),readProfile()]);renderCards();renderProfile();const year=$('#year');if(year)year.textContent=new Date().getFullYear()}
async function initArticlesPage(){const target=$('#allArticleCards');if(!target)return;articles=await readArticles();renderCards('allArticleCards');const year=$('#year');if(year)year.textContent=new Date().getFullYear()}
async function initCvPage(){const target=$('#cvPage');if(!target)return;profile=await readProfile();const url=profile.cv_pdf_url;target.innerHTML='<a class="article-back" href="index.html">← Ana sayfaya dön</a><div class="eyebrow">Eğitim ve mesleki yolculuk</div><h1>Özgeçmiş</h1><section class="cv-grid"><div class="cv-column"><h2>Eğitim</h2>'+renderCvItems(profile.education||[],'education')+'</div><div class="cv-column"><h2>Çalışma alanları</h2>'+renderCvItems(profile.expertise||[],'expertise')+'</div></section>'+(url?'<section class="cv-pdf"><div class="section-head"><h2>PDF özgeçmiş</h2><a class="btn" href="'+esc(url)+'" target="_blank" rel="noopener">PDF dosyasını aç ↗</a></div><iframe title="PDF özgeçmiş" src="'+esc(url)+'#view=FitH" loading="lazy"></iframe></section>':'<p class="muted">PDF özgeçmiş henüz eklenmedi.</p>')}
function renderCvItems(items,type){return items.length?'<ul class="cv-items">'+items.map(x=>'<li>'+esc(type==='education'?((x.year||'')+' · '+(x.institution||'')):x)+'</li>').join('')+'</ul>':'<p class="muted">Henüz bilgi eklenmedi.</p>'}
function setSeoMeta(selector,value){const element=$(selector);if(element&&value)element.setAttribute('content',value)}
function updateArticleSeo(article){
 const title=article.title+' | Psikolog Beyza Nur Ömültay';
 const description=String(article.description||article.body||'').replace(/\s+/g,' ').trim().slice(0,160);
 const canonical='https://beyza-nur-blog.vercel.app/makale.html?id='+encodeURIComponent(article.slug);
 const image=safeExternalUrl(article.image_url);
 document.title=title;
 setSeoMeta('meta[name="description"]',description);
 setSeoMeta('meta[property="og:title"]',title);
 setSeoMeta('meta[property="og:description"]',description);
 setSeoMeta('meta[property="og:url"]',canonical);
 setSeoMeta('meta[property="og:type"]','article');
 setSeoMeta('meta[property="og:image"]',image);
 setSeoMeta('meta[name="twitter:title"]',title);
 setSeoMeta('meta[name="twitter:description"]',description);
 setSeoMeta('meta[name="twitter:image"]',image);
 const canonicalLink=$('link[rel="canonical"]');if(canonicalLink)canonicalLink.href=canonical;
 const schema={'@context':'https://schema.org','@type':article.is_short?'Article':'BlogPosting',headline:article.title,description,url:canonical,mainEntityOfPage:canonical,author:{'@type':'Person',name:'Psikolog Beyza Nur Ömültay',url:'https://beyza-nur-blog.vercel.app/'}};
 if(image)schema.image=image;
 if(article.created_at&&!Number.isNaN(Date.parse(article.created_at)))schema.datePublished=new Date(article.created_at).toISOString();
 if(article.updated_at&&!Number.isNaN(Date.parse(article.updated_at)))schema.dateModified=new Date(article.updated_at).toISOString();
 let jsonLd=$('#articleStructuredData');if(!jsonLd){jsonLd=document.createElement('script');jsonLd.id='articleStructuredData';jsonLd.type='application/ld+json';document.head.appendChild(jsonLd)}
 jsonLd.textContent=JSON.stringify(schema).replace(/</g,'\\u003c');
}
async function initArticle(){
 const target=$('#articleView');if(!target)return;
 const slug=new URLSearchParams(location.search).get('id');
 let article=articles.find(x=>x.slug===slug);
 if(db){const {data}=await db.from('articles').select('*').eq('slug',slug).eq('published',true).maybeSingle();if(data)article=data}
 if(article){updateArticleSeo(article);storyItems.set(String(article.slug),article)}
 else{document.title='Yazı bulunamadı | Psikolog Beyza Nur Ömültay';setSeoMeta('meta[name="robots"]','noindex,nofollow')}
 target.innerHTML=article?'<a class="article-back" href="index.html#yazilar">← Tüm yazılara dön</a><div class="card-tag">'+esc(article.category)+' · '+esc(article.date||'Yeni yazı')+'</div><h1>'+esc(article.title)+'</h1><p class="muted article-description">'+esc(article.description)+'</p>'+storyInlineTools(article)+sourceBlock(article)+(article.image_url?'<img class="article-hero" src="'+esc(article.image_url)+'" alt="'+esc(article.title)+'" fetchpriority="high">':'')+'<div class="article-body">'+esc(article.body||article.description)+'</div>'+sourceBlock(article)+'<a class="article-back" href="index.html#yazilar">← Tüm yazılara dön</a>':'<a class="article-back" href="index.html#yazilar">← Tüm yazılara dön</a><h1>Bu yazı bulunamadı</h1>';
 document.querySelectorAll('.year').forEach(x=>x.textContent=new Date().getFullYear())
}

function slugify(text){return text.toLocaleLowerCase('tr').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
async function ensureAdminStorageAccess(){const {data:current,error:sessionError}=await db.auth.getSession();let session=current?.session;if(sessionError)return{ok:false,message:'Oturum doğrulanamadı. İçerik Masası’ndan çıkış yapıp yeniden giriş yap.'};if(!session||!session.expires_at||session.expires_at*1000<Date.now()+60000){const {data:refreshed,error:refreshError}=await db.auth.refreshSession();session=refreshed?.session;if(refreshError||!session)return{ok:false,message:'Yönetici oturumun yenilenemedi. İçerik Masası’ndan çıkış yapıp yeniden giriş yap.'}}const {data:admin,error:adminError}=await db.from('site_admins').select('user_id').eq('user_id',session.user.id).maybeSingle();if(adminError||!admin)return{ok:false,message:'Bu oturum yönetici hesabına bağlı değil. İçerik Masası’ndan çıkış yapıp yönetici hesabınla yeniden giriş yap.'};return{ok:true}}
function initAdmin(){const login=$('#loginForm');if(!login)return;const loginMsg=$('#loginMsg'),loginBox=$('#loginBox'),dashboard=$('#dashboard');
 if(!db){loginMsg.textContent='Supabase bağlantısı henüz eklenmemiş. README ve supabase/setup.sql dosyalarındaki kurulum adımlarını tamamla.';login.querySelector('button[type=submit],button:not([type])').disabled=true;return}
 login.onsubmit=async e=>{e.preventDefault();loginMsg.textContent='Giriş yapılıyor…';const {data,error}=await db.auth.signInWithPassword({email:$('#email').value.trim(),password:$('#password').value});if(error){loginMsg.textContent='Giriş başarısız. E-posta ve şifreyi kontrol et.';return}const {data:admin,error:adminError}=await db.from('site_admins').select('user_id').eq('user_id',data.user.id).maybeSingle();if(adminError||!admin){await db.auth.signOut();loginMsg.textContent='Bu hesap yönetici olarak eklenmemiş. README’deki son kurulum adımını tamamla.';return}loginBox.hidden=true;dashboard.hidden=false;await loadAdmin()};
 async function loadAdmin(){const form=$('#profileForm');const [{data:rows,error:articlesError},{data:p,error:profileError}]=await Promise.all([db.from('articles').select('*').order('created_at',{ascending:false}),db.from('site_profile').select('*').eq('id',1).maybeSingle()]);if(articlesError||profileError){$('#profileMsg').textContent='İçerik alınamadı. Supabase SQL kurulumunu ve yönetici kaydını kontrol et.';return}articles=rows||[];profile=p||demoProfile;form.elements.about.value=profile.about||'';form.elements.education.value=(profile.education||[]).map(x=>(x.year||'')+' | '+(x.institution||'')).join('\n');form.elements.expertise.value=(profile.expertise||[]).join('\n');form.elements.contactEmail.value=profile.contact_email||'';form.elements.instagramUrl.value=profile.instagram_url||'';form.elements.linkedinUrl.value=profile.linkedin_url||'';const cvStatus=$('#cvPdfStatus');if(cvStatus)cvStatus.textContent=profile.cv_pdf_url?'Yüklü PDF: '+profile.cv_pdf_url:'Henüz PDF yüklenmedi.';const portraitStatus=$('#portraitPhotoStatus');if(portraitStatus)portraitStatus.textContent=profile.portrait_url?'Mevcut fotoğraf yayında. Yeni fotoğraf seçerek değiştirebilirsiniz.':'Henüz portre fotoğrafı eklenmedi.';drawAdminList()}
 function drawAdminList(){const list=$('#articleList');list.innerHTML=articles.map(a=>'<li><span>'+esc(a.title)+(a.is_short?' <small class="short-type">Kısa not</small>':'')+'</span><span class="admin-actions"><button type="button" data-edit="'+esc(a.id)+'">Düzenle</button><button type="button" data-delete="'+esc(a.id)+'">Sil</button></span></li>').join('')||'<li>Henüz makale yok.</li>';list.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editArticle(b.dataset.edit));list.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{if(!confirm('Bu makale silinsin mi?'))return;const {error}=await db.from('articles').delete().eq('id',b.dataset.delete);if(error){$('#profileMsg').textContent='Makale silinemedi.';return}await loadAdmin()})}
 function editArticle(id){const a=articles.find(x=>x.id===id),f=$('#articleForm');f.elements.id.value=a.id;f.elements.title.value=a.title;f.elements.category.value=a.category;f.elements.description.value=a.description;f.elements.body.value=a.body;f.elements.image.value=(a.image_url||'').startsWith('data:')?'':(a.image_url||'');f.elements.imageFile.value='';f.elements.sourceTitle.value=a.source_title||'';f.elements.sourceAuthor.value=a.source_author||'';f.elements.sourcePublisher.value=a.source_publisher||'';f.elements.sourceDate.value=a.source_date||'';f.elements.sourceUrl.value=a.source_url||'';f.elements.isShort.checked=Boolean(a.is_short);$('#formTitle').textContent='Makaleyi düzenle';$('#saveArticle').textContent='Değişiklikleri kaydet';$('#cancelEdit').hidden=false;f.scrollIntoView({behavior:'smooth',block:'start'})}
 function resetArticle(){const f=$('#articleForm');f.reset();f.elements.id.value='';$('#formTitle').textContent='Yeni makale';$('#saveArticle').textContent='Makaleyi yayınla';$('#cancelEdit').hidden=true}
 $('#cancelEdit').onclick=resetArticle;
 $('#articleForm').onsubmit=async e=>{e.preventDefault();const f=e.currentTarget,id=f.elements.id.value,old=articles.find(a=>a.id===id),file=f.elements.imageFile.files[0];$('#profileMsg').textContent='Makale kaydediliyor…';let imageUrl=f.elements.image.value.trim()||(old?.image_url||'');if(file){const safeName=file.name.toLowerCase().replace(/[^a-z0-9._-]+/g,'-'),path=Date.now()+'-'+safeName;const {error:uploadError}=await db.storage.from('blog-covers').upload(path,file,{contentType:file.type,upsert:false});if(uploadError){$('#profileMsg').textContent='Görsel yüklenemedi: '+uploadError.message;return}imageUrl=db.storage.from('blog-covers').getPublicUrl(path).data.publicUrl}
 const values={slug:old?.slug||slugify(f.elements.title.value)||('makale-'+Date.now()),title:f.elements.title.value.trim(),category:f.elements.category.value.trim(),description:f.elements.description.value.trim(),body:f.elements.body.value.trim(),image_url:imageUrl,source_title:f.elements.sourceTitle.value.trim(),source_author:f.elements.sourceAuthor.value.trim(),source_publisher:f.elements.sourcePublisher.value.trim(),source_date:f.elements.sourceDate.value.trim(),source_url:safeExternalUrl(f.elements.sourceUrl.value.trim()),is_short:f.elements.isShort.checked,published:true,updated_at:new Date().toISOString()};let result=id?await db.from('articles').update(values).eq('id',id):await db.from('articles').insert(values);if(result.error){$('#profileMsg').textContent='Makale kaydedilemedi: '+result.error.message;return}$('#profileMsg').textContent='Makale kaydedildi.';resetArticle();await loadAdmin()};
 $('#profileForm').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget);const status=$('#profileMsg');status.textContent='Bilgiler kaydediliyor…';let cvUrl=profile.cv_pdf_url||null,cvPath=profile.cv_pdf_path||null,portraitUrl=profile.portrait_url||'',portraitPath=profile.portrait_path||'',newPortraitPath='';const portraitFile=f.get('portraitPhoto');if(portraitFile&&portraitFile.size){const allowed={'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/avif':'.avif'};if(!allowed[portraitFile.type]){status.textContent='JPG, PNG, WebP veya AVIF biçiminde bir fotoğraf seç.';return}if(portraitFile.size>5*1024*1024){status.textContent='Fotoğraf dosyası 5 MB sınırını aşamaz.';return}const access=await ensureAdminStorageAccess();if(!access.ok){status.textContent=access.message;return}newPortraitPath='profile/portrait-'+Date.now()+allowed[portraitFile.type];const {error:portraitError}=await db.storage.from('blog-covers').upload(newPortraitPath,portraitFile,{contentType:portraitFile.type,upsert:false});if(portraitError){status.textContent='Fotoğraf yüklenemedi: '+portraitError.message;return}portraitUrl=db.storage.from('blog-covers').getPublicUrl(newPortraitPath).data.publicUrl+'?v='+Date.now();portraitPath=newPortraitPath}const pdf=f.get('cvPdf');if(pdf&&pdf.size){if(pdf.type!=='application/pdf'){status.textContent='Lütfen PDF dosyası seç.';if(newPortraitPath)await db.storage.from('blog-covers').remove([newPortraitPath]);return}if(pdf.size>15*1024*1024){status.textContent='PDF dosyası 15 MB sınırını aşamaz.';if(newPortraitPath)await db.storage.from('blog-covers').remove([newPortraitPath]);return}const access=await ensureAdminStorageAccess();if(!access.ok){status.textContent=access.message;if(newPortraitPath)await db.storage.from('blog-covers').remove([newPortraitPath]);return}const nextPath='cv/ozgecmis-'+Date.now()+'.pdf';const {error:uploadError}=await db.storage.from('professional-cv').upload(nextPath,pdf,{contentType:'application/pdf',upsert:false});if(uploadError){status.textContent='PDF yüklenemedi: '+uploadError.message;if(newPortraitPath)await db.storage.from('blog-covers').remove([newPortraitPath]);return}cvUrl=db.storage.from('professional-cv').getPublicUrl(nextPath).data.publicUrl;cvPath=nextPath}const values={id:1,about:f.get('about'),education:f.get('education').split('\n').filter(Boolean).map(line=>{const [year,...rest]=line.split('|').map(x=>x.trim());return{year:year||'',institution:rest.join(' | ')}}),expertise:f.get('expertise').split('\n').map(x=>x.trim()).filter(Boolean),contact_email:f.get('contactEmail').trim(),instagram_url:f.get('instagramUrl').trim(),linkedin_url:validLinkedInUrl(f.get('linkedinUrl').trim()),cv_pdf_url:cvUrl,cv_pdf_path:cvPath,portrait_url:portraitUrl,portrait_path:portraitPath,updated_at:new Date().toISOString()};const {error}=await db.from('site_profile').upsert(values,{onConflict:'id'});if(error&&newPortraitPath)await db.storage.from('blog-covers').remove([newPortraitPath]);status.textContent=error?'Bilgiler kaydedilemedi: '+error.message:'Bilgiler ve özgeçmiş PDF kaydedildi.';if(!error){if(profile.portrait_path&&portraitPath!==profile.portrait_path)await db.storage.from('blog-covers').remove([profile.portrait_path]);if(profile.cv_pdf_path&&cvPath!==profile.cv_pdf_path)await db.storage.from('professional-cv').remove([profile.cv_pdf_path]);await loadAdmin()}};
 $('#logout').onclick=async()=>{await db.auth.signOut();location.reload()};
}
initHome();initArticlesPage();initArticle();initCvPage();initShortPage();initAdmin();initParallax();initAdminBar();initStoryMode();
function storyFormatDate(article){
 const value=article.created_at||article.updated_at;
 if(!value)return 'Yayındaki bir yazı';
 const date=new Date(value);return Number.isNaN(date.getTime())?'Yayındaki bir yazı':date.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})
}
function storyLoadImage(url){
 return new Promise(resolve=>{
  if(!url){resolve(null);return}
  const image=new Image();image.crossOrigin='anonymous';let settled=false;
  const finish=value=>{if(settled)return;settled=true;resolve(value)};
  const timeout=setTimeout(()=>finish(null),8000);
  image.onload=()=>{clearTimeout(timeout);finish(image)};
  image.onerror=()=>{clearTimeout(timeout);finish(null)};
  image.src=url;if(image.complete&&image.naturalWidth){clearTimeout(timeout);finish(image)}
 })
}
function storyCover(ctx,image,x,y,w,h,radius){
 ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,radius);ctx.clip();
 if(image){const scale=Math.max(w/image.width,h/image.height),sw=w/scale,sh=h/scale,sx=(image.width-sw)/2,sy=(image.height-sh)/2;ctx.drawImage(image,sx,sy,sw,sh,x,y,w,h)}
 else{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#603044');g.addColorStop(1,'#21151e');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(255,236,227,.42)';ctx.font='64px Georgia';ctx.fillText('✦',x+w/2-20,y+h/2+20)}
 ctx.restore()
}
function storyWrap(ctx,text,x,y,maxWidth,lineHeight,maxLines){
 const words=String(text||'').replace(/\s+/g,' ').trim().split(' ').filter(Boolean);let lines=[],line='';
 words.forEach(word=>{const next=line?line+' '+word:word;if(ctx.measureText(next).width>maxWidth&&line){lines.push(line);line=word}else line=next});
 if(line)lines.push(line);
 const clipped=lines.length>maxLines;if(clipped)lines=lines.slice(0,maxLines);
 if(clipped&&lines.length){let last=lines[lines.length-1];while(last&&ctx.measureText(last+'…').width>maxWidth)last=last.slice(0,-1);lines[lines.length-1]=last.trimEnd()+'…'}
 lines.forEach((value,index)=>ctx.fillText(value,x,y+index*lineHeight));
 return y+lines.length*lineHeight
}
function drawStoryLogo(ctx,x,y,size){
 const r=size/2,g=ctx.createRadialGradient(x-size*.18,y-size*.22,2,x,y,r);
 g.addColorStop(0,'#8b2945');g.addColorStop(.52,'#650d2b');g.addColorStop(1,'#350614');
 ctx.save();ctx.shadowColor='rgba(219,105,138,.66)';ctx.shadowBlur=18;
 ctx.fillStyle=g;ctx.strokeStyle='rgba(245,211,218,.78)';ctx.lineWidth=2;
 ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
 ctx.strokeStyle='#fff0d8';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';
 ctx.beginPath();ctx.arc(x,y-size*.11,size*.16,0,Math.PI*2);ctx.stroke();
 ctx.beginPath();ctx.moveTo(x-size*.29,y+size*.27);ctx.bezierCurveTo(x-size*.22,y+size*.03,x+size*.22,y+size*.03,x+size*.29,y+size*.27);ctx.stroke();
 ctx.fillStyle='#fff0d8';ctx.beginPath();ctx.moveTo(x+size*.32,y-size*.34);ctx.lineTo(x+size*.35,y-size*.23);ctx.lineTo(x+size*.46,y-size*.20);ctx.lineTo(x+size*.35,y-size*.16);ctx.lineTo(x+size*.32,y-size*.05);ctx.lineTo(x+size*.29,y-size*.16);ctx.lineTo(x+size*.18,y-size*.20);ctx.lineTo(x+size*.29,y-size*.23);ctx.closePath();ctx.fill()
}
async function createStoryBlob(article){
 await document.fonts.ready;
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;
 const ctx=canvas.getContext('2d'),imageUrl=safeExternalUrl(article.image_url),image=await storyLoadImage(imageUrl);
 const base=ctx.createLinearGradient(0,0,1080,1920);base.addColorStop(0,'#321b28');base.addColorStop(.48,'#171017');base.addColorStop(1,'#431b30');ctx.fillStyle=base;ctx.fillRect(0,0,1080,1920);
 if(image){ctx.save();ctx.filter='blur(42px) brightness(.42) saturate(1.08)';storyCover(ctx,image,-75,-75,1230,2070,0);ctx.restore()}
 const tint=ctx.createLinearGradient(0,0,1080,1920);tint.addColorStop(0,'rgba(78,18,48,.35)');tint.addColorStop(.45,'rgba(23,12,20,.43)');tint.addColorStop(1,'rgba(18,9,17,.68)');ctx.fillStyle=tint;ctx.fillRect(0,0,1080,1920);
 const vignette=ctx.createRadialGradient(540,890,280,540,890,1080);vignette.addColorStop(0,'rgba(8,4,9,.02)');vignette.addColorStop(1,'rgba(7,3,8,.56)');ctx.fillStyle=vignette;ctx.fillRect(0,0,1080,1920);
 ctx.save();ctx.shadowColor='rgba(244,153,182,.84)';ctx.shadowBlur=66;ctx.fillStyle='rgba(32,17,27,.66)';ctx.beginPath();ctx.roundRect(78,108,924,1704,36);ctx.fill();ctx.restore();
 ctx.strokeStyle='rgba(250,210,220,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(78,108,924,1704,36);ctx.stroke();
 ctx.strokeStyle='rgba(247,185,201,.3)';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(92,122,896,1676,28);ctx.stroke();
 drawStoryLogo(ctx,162,210,82);
 ctx.textAlign='left';ctx.fillStyle='#e8c4cd';ctx.font='600 17px "DM Sans",Arial,sans-serif';ctx.fillText('PSİKOLOG',220,195);
 ctx.fillStyle='#fff5f1';ctx.font='500 29px "Playfair Display",Georgia,serif';ctx.fillText('Beyza Nur Ömültay',220,235);
 storyCover(ctx,image,148,286,784,716,24);
 if(image){const imgShade=ctx.createLinearGradient(0,780,0,1002);imgShade.addColorStop(0,'rgba(14,7,13,0)');imgShade.addColorStop(1,'rgba(14,7,13,.34)');ctx.fillStyle=imgShade;ctx.fillRect(148,780,784,222)}
 ctx.textAlign='center';ctx.fillStyle='#efb4c0';ctx.font='700 21px "DM Sans",Arial,sans-serif';ctx.fillText(String(article.category||(article.is_short?'KISA NOT':'PSİKOLOJİ')).toLocaleUpperCase('tr-TR'),540,1082,820);
 ctx.fillStyle='#fff8f6';ctx.shadowColor='rgba(6,3,8,.76)';ctx.shadowBlur=18;
 const title=String(article.title||'');let titleSize=75;ctx.font='500 '+titleSize+'px "Playfair Display",Georgia,serif';
 while(ctx.measureText(title).width>830&&titleSize>25){titleSize-=2;ctx.font='500 '+titleSize+'px "Playfair Display",Georgia,serif'}
 ctx.fillText(title,540,1190,830);ctx.shadowBlur=0;
 ctx.fillStyle='#f0e3e6';ctx.font='400 32px "DM Sans",Arial,sans-serif';storyWrap(ctx,article.description||article.body||'',540,1265,800,46,5);
 ctx.strokeStyle='rgba(245,202,213,.44)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(146,1602);ctx.lineTo(934,1602);ctx.stroke();
 ctx.textAlign='left';ctx.fillStyle='#edc0cb';ctx.font='500 22px "DM Sans",Arial,sans-serif';ctx.fillText(storyFormatDate(article),150,1660);
 ctx.fillStyle='#fff6f2';ctx.font='500 29px "Playfair Display",Georgia,serif';ctx.fillText('Psikolog Beyza Nur Ömültay',150,1722,690);
 ctx.textAlign='right';ctx.fillStyle='#f5d8df';ctx.font='700 37px "Cormorant Garamond",Georgia,serif';ctx.shadowColor='rgba(236,149,173,.8)';ctx.shadowBlur=17;ctx.fillText('H.P.R',930,1775);ctx.shadowBlur=0;ctx.textAlign='left';
 return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve({blob,imageIncluded:!!image}):reject(new Error('Story görseli oluşturulamadı.')),'image/png'))
}
function initStoryMode(){
 let current=null,opener=null,currentBlob=null,currentName='hikaye',previewUrl=null,renderId=0;
 const modal=document.createElement('div');modal.className='story-modal';modal.id='storyModal';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','storyPreviewTitle');
 modal.innerHTML='<div class="story-modal-backdrop" data-story-close></div><div class="story-modal-panel"><button class="story-close" type="button" aria-label="Hikâye önizlemesini kapat">×</button><div class="story-modal-stage"><img class="story-poster-preview" id="storyCanvasPreview" alt="" aria-describedby="storyStatus"></div><div class="story-modal-actions"><button class="btn fill" id="storyDownload" type="button" disabled>Görseli indir ↧</button><button class="btn" id="storyShare" type="button" disabled>Telefonda paylaş ↗</button><p id="storyStatus" role="status" aria-live="polite"></p></div></div>';
 document.body.appendChild(modal);
 const downloadBlob=(blob,name)=>{const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name+'.png';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)};
 const close=()=>{modal.hidden=true;document.body.classList.remove('story-open');currentBlob=null;renderId++;if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null}const preview=modal.querySelector('#storyCanvasPreview');preview.removeAttribute('src');if(opener&&opener.isConnected)opener.focus()};
 modal.querySelector('.story-close').addEventListener('click',close);
 modal.querySelector('[data-story-close]').addEventListener('click',close);
 modal.addEventListener('keydown',event=>{
  if(event.key==='Escape'){close();return}
  if(event.key==='Tab'){const items=[...modal.querySelectorAll('button:not(:disabled)')];if(!items.length)return;const first=items[0],last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}
 });
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-story-open]');if(!button)return;
  event.preventDefault();event.stopPropagation();const article=storyItems.get(button.dataset.storyOpen);if(!article)return;
  opener=button;current=article;currentBlob=null;const task=++renderId;currentName=String(article.slug||'hikaye').replace(/[^a-z0-9-]/gi,'-');
  const status=modal.querySelector('#storyStatus'),downloadButton=modal.querySelector('#storyDownload'),shareButton=modal.querySelector('#storyShare'),preview=modal.querySelector('#storyCanvasPreview');
  status.textContent='9:16 hikâye görseli hazırlanıyor…';downloadButton.disabled=true;shareButton.disabled=true;
  modal.hidden=false;document.body.classList.add('story-open');modal.querySelector('.story-close').focus();
  createStoryBlob(article).then(result=>{
   if(task!==renderId||modal.hidden)return;
   currentBlob=result.blob;previewUrl=URL.createObjectURL(result.blob);preview.src=previewUrl;preview.alt=article.title+' başlıklı 1080 × 1920 Instagram hikâye görseli';
   downloadButton.disabled=false;shareButton.disabled=false;
   status.textContent=result.imageIncluded?'Görsel hazır. Önizleme indirilecek PNG ile aynıdır.':'Kapak görseli alınamadı; tasarım bulanık bordo arka planla hazırlandı.'
  }).catch(()=>{if(task===renderId&&!modal.hidden)status.textContent='Hikâye görseli hazırlanamadı. Tekrar deneyebilirsin.'})
 });
 modal.querySelector('#storyDownload').addEventListener('click',()=>{
  if(!currentBlob)return;
  downloadBlob(currentBlob,currentName);
  modal.querySelector('#storyStatus').textContent='1080 × 1920 PNG görseli indirildi.'
 });
 modal.querySelector('#storyShare').addEventListener('click',()=>{
  if(!currentBlob)return;
  const file=new File([currentBlob],currentName+'.png',{type:'image/png'}),status=modal.querySelector('#storyStatus');
  try{
   if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
    navigator.share({files:[file],title:current.title,text:'Psikolog Beyza Nur Ömültay’dan: '+current.title}).catch(error=>{if(error.name!=='AbortError')status.textContent='Paylaşım açılamadı. Görseli indirip Instagram’dan ekleyebilirsin.'});
    return
   }
  }catch(error){}
  downloadBlob(currentBlob,currentName);status.textContent='Görsel indirildi. Instagram’da Hikâye oluşturup galerinden seçebilirsin.'
 });
}
function initAdminBar(){const bar=$('.adminbar');if(!bar)return;let last=window.scrollY,frame=0;const onScroll=()=>{if(frame)return;frame=requestAnimationFrame(()=>{const y=window.scrollY,down=y>last;bar.classList.toggle('adminbar-hidden',down&&y>80);bar.classList.toggle('adminbar-visible',!down||y<=80);last=y;frame=0})};bar.classList.add('adminbar-visible');window.addEventListener('scroll',onScroll,{passive:true})}
function initParallax(){const scene=$('.parallax-scene');if(!scene||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const objects=scene.querySelectorAll('[data-depth]');let frame=0;const update=()=>{frame=0;const main=$('main'),scroll=Math.max(0,window.scrollY-main.offsetTop);objects.forEach(item=>{const depth=Number(item.dataset.depth)||.5;item.style.setProperty('--parallax-y',(scroll*(1-depth)).toFixed(1)+'px')})};window.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update)},{passive:true});update()}
})();

