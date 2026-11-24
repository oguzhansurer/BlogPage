-- Run once in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null default 'PSİKOLOJİ',
  title text not null,
  description text not null default '',
  body text not null default '',
  image_url text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.site_profile (
  id smallint primary key check (id = 1),
  about text not null default '',
  education jsonb not null default '[]'::jsonb,
  expertise jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_site_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.site_admins where user_id = (select auth.uid())); $$;
revoke all on function public.is_site_admin() from public, anon;
grant execute on function public.is_site_admin() to authenticated;

alter table public.articles enable row level security;
alter table public.site_profile enable row level security;
alter table public.site_admins enable row level security;
revoke all on public.articles, public.site_profile, public.site_admins from anon, authenticated;
grant select on public.articles, public.site_profile to anon, authenticated;
grant insert, update, delete on public.articles, public.site_profile to authenticated;
grant select on public.site_admins to authenticated;

drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles" on public.articles for select to anon, authenticated using (published = true);
drop policy if exists "Admins can read all articles" on public.articles;
create policy "Admins can read all articles" on public.articles for select to authenticated using ((select public.is_site_admin()));
drop policy if exists "Admins can add articles" on public.articles;
create policy "Admins can add articles" on public.articles for insert to authenticated with check ((select public.is_site_admin()));
drop policy if exists "Admins can edit articles" on public.articles;
create policy "Admins can edit articles" on public.articles for update to authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
drop policy if exists "Admins can delete articles" on public.articles;
create policy "Admins can delete articles" on public.articles for delete to authenticated using ((select public.is_site_admin()));

drop policy if exists "Public can read profile" on public.site_profile;
create policy "Public can read profile" on public.site_profile for select to anon, authenticated using (true);
drop policy if exists "Admins can add profile" on public.site_profile;
create policy "Admins can add profile" on public.site_profile for insert to authenticated with check ((select public.is_site_admin()));
drop policy if exists "Admins can edit profile" on public.site_profile;
create policy "Admins can edit profile" on public.site_profile for update to authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
drop policy if exists "Admins can read own admin row" on public.site_admins;
create policy "Admins can read own admin row" on public.site_admins for select to authenticated using (user_id = (select auth.uid()));

insert into public.site_profile (id, about, education, expertise)
values (1,
  'Psikoloji, insanın kendisiyle ve çevresiyle kurduğu bağı anlamanın bitmeyen bir yolu. Bu sayfada psikoloji üzerine düşündüklerimi ve gündelik yaşama dokunan notları paylaşıyorum. Hakkımda yazısını içerik panelinden kendi bilgilerinle güncelleyebilirsin.',
  '[{"year":"Eğitim bilgisi","institution":"Üniversite ve bölüm bilgisini yönetim panelinden ekle."}]'::jsonb,
  '["Duyguları tanımak ve anlamlandırmak","Öz şefkat ve kişisel farkındalık","İlişkiler ve iletişim"]'::jsonb)
on conflict (id) do nothing;

insert into public.articles (slug, category, title, description, body, image_url, published) values
('duygularimiz-bize-ne-anlatir','DUYGULAR','Duygularımız bize ne anlatır?','Hislerimizi bastırmadan, onlara biraz merakla yaklaşmak mümkün mü? Duyguların işlevine dair küçük bir giriş.',
$$Duygular, yaşadıklarımızı anlamlandırmamıza yardımcı olan içsel işaretlerdir. Bazen bizi korur, bazen bir ihtiyacımızı fark etmemizi sağlar.

Bir duyguyu hemen değiştirmeye çalışmadan önce ona isim vermek ve bedende nasıl hissedildiğini fark etmek küçük ama anlamlı bir başlangıç olabilir. Kendinize şu soruyu sorabilirsiniz: Bu duygu bana ne anlatmaya çalışıyor?

Her duyguya alan açmak, her davranışı onaylamak demek değildir. Duyguyu merakla fark edip nasıl karşılık vereceğimizi seçebiliriz.$$,
'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=80',true),
('kendine-karsi-daha-yumusak-olmak','ÖZ ŞEFKAT','Kendine karşı daha yumuşak olmak','İç sesimizi fark etmek ve kendimize yakın bir dostumuza davrandığımız gibi davranmayı denemek üzerine.',
$$Zorlandığımız anlarda kendimizle konuşma biçimimiz, deneyimimizi derinden etkileyebilir. İçimizden geçen cümleleri fark etmek, değişimin ilk adımıdır.

Yakın bir arkadaşımız aynı durumda olsaydı ona ne söylerdik? Bu yaklaşımı kendimize de sunmak, sorumluluktan kaçmak değil; güç toplamak için kendimize anlayış göstermektir.

Kendinize bugün küçük bir nezaket sunmayı deneyin. Bazen dinlenmek, bazen yardım istemek, bazen de yalnızca hissettiğimizi kabul etmek yeterlidir.$$,
'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',true),
('her-seyi-ayni-anda-cozmek-zorunda-degilsin','FARKINDALIK','Her şeyi aynı anda çözmek zorunda değilsin','Belirsizlikle kalabilmek ve küçük adımlarla bugüne geri dönmek için birkaç düşünce.',
$$Bazen zihnimiz bütün cevapları hemen bulmamız gerektiğini söyler. Oysa belirsizlik içinde atılabilecek en doğru adım, yalnızca bir sonraki küçük adımdır.

Bugün kontrol edebildiğiniz tek bir şeyi seçin. Bir nefes, kısa bir mola ya da güvendiğiniz biriyle konuşmak, dikkatinizi şu ana geri getirebilir.

Küçük adımlar önemsiz değildir; çoğu zaman kendimize yeniden güvenmeyi böyle öğreniriz.$$,
'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',true)
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-covers','blog-covers',true,5242880,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif'];
drop policy if exists "Site admins upload blog covers" on storage.objects;
create policy "Site admins upload blog covers" on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-covers' and (select public.is_site_admin()));
drop policy if exists "Site admins update blog covers" on storage.objects;
create policy "Site admins update blog covers" on storage.objects for update to authenticated
  using (bucket_id = 'blog-covers' and (select public.is_site_admin()))
  with check (bucket_id = 'blog-covers' and (select public.is_site_admin()));
drop policy if exists "Site admins delete blog covers" on storage.objects;
create policy "Site admins delete blog covers" on storage.objects for delete to authenticated
  using (bucket_id = 'blog-covers' and (select public.is_site_admin()));

