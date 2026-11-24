# Psikolog Beyza Nur Ömültay

Bordo tonlarında çok sayfalı blog. Statik HTML/CSS/JavaScript ön yüzü Supabase ile makale, profil ve kapak görsellerini saklar.

## Sayfalar

- `index.html`: Ana sayfa, makale kartları, hakkımda ve özgeçmiş
- `makale.html?id=...`: Tam yazı için ayrı sayfa
- `icerik-masasi.html`: Yönetici girişi, makale/CV düzenleme paneli
- `supabase/setup.sql`: Veritabanı tabloları, örnek yazılar ve erişim kuralları
- `supabase-config.js`: Supabase proje URL'si ve public publishable key

## Supabase'i bağlama

1. Supabase'de bir proje oluştur.
2. Project URL ve publishable key değerlerini `supabase-config.js` içine koy. Bu dosyaya **secret** veya `service_role` key koyma.
3. Supabase Dashboard > SQL Editor'da `supabase/setup.sql` içeriğini bir kez çalıştır. Bu, 3 örnek yazıyı, profil kaydını, tabloları ve yetkileri ekler.
4. Authentication > Users bölümünde yönetici e-posta/şifresiyle bir kullanıcı oluştur.
5. Oluşan kullanıcının UUID'sini kopyalayıp SQL Editor'da şu komutu o UUID ile çalıştır:

   ```sql
   insert into public.site_admins (user_id) values ('KULLANICI_UUID');
   ```

6. `supabase-config.js` değişikliğini GitHub'a gönder. Vercel GitHub deposundan yeni sürümü otomatik dağıtır.
7. Yönetim paneli: `/icerik-masasi.html`.

Ön yüz, public publishable key ile çalışır. Tablo ve Storage erişimleri `setup.sql` içindeki RLS kurallarıyla sınırlanır; `service_role` anahtarı tarayıcıda kullanılmaz.

## Vercel'e yayınlama

GitHub deposunu Vercel'e import et. Framework Preset `Other`, Build Command boş, Output Directory `.` olabilir. Bu düz HTML sitesi ayrıca derleme istemez; kökteki `index.html` ana sayfadır.

## İçerik

Bu sitede yalnızca herkese açık makaleler, özgeçmiş ve profil bilgileri bulunur. Danışan/seans kayıtları bu projeye eklenmemelidir.

