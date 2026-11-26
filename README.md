# Psikolog Beyza Nur Ömültay

Bordo tonlarında çok sayfalı psikoloji blogu. Statik HTML/CSS/JavaScript ön yüzü makaleleri, hakkımda ve özgeçmiş bilgilerini Supabase'de saklar.

## Yayındaki site ve yönetim paneli

- Site: https://pskbeyzaomultay.com/
- İçerik masası: https://pskbeyzaomultay.com/icerik-masasi
- Supabase projesi: https://supabase.com/dashboard/project/vcpktnjgvmhxucwwhame

## Sayfalar

- `/`: Ana sayfa, makale kartları, hakkımda ve özgeçmiş
- `makale/...`: Tam yazı için ayrı sayfa
- `icerik-masasi`: Yönetici girişi, makale/CV düzenleme paneli
- `supabase/setup.sql`: Veritabanı tabloları, örnek yazılar ve erişim kuralları
- `supabase-config.js`: Projenin URL'si ve herkese açık publishable key

## Yönetici hesabını etkinleştirme

Veritabanı ve örnek içerik hazır. Paneli kullanacak hesap için Supabase Dashboard'da bir defa:

1. Authentication > Users > Add user yoluyla kendi e-posta adresin ve belirleyeceğin şifreyle kullanıcı oluştur.
2. Oluşturulan kullanıcının UUID değerini kopyala.
3. SQL Editor'da aşağıdaki sorgudaki `KULLANICI_UUID` bölümünü kendi UUID değerinle değiştirip çalıştır:

   ```sql
   insert into public.site_admins (user_id) values ('KULLANICI_UUID');
   ```

4. Yönetim panelini açıp aynı e-posta ve şifreyle giriş yap.

Bu hesabı oluşturmadan panelde oturum açılamaz. Parolanı GitHub'a veya bu projeye ekleme. Panelde makale ekleyebilir/düzenleyebilir, kapak görseli yükleyebilir, hakkımda ve eğitim bilgilerini güncelleyebilirsin.

## Teknik notlar

Ön yüz, tarayıcıda kullanılmak üzere tasarlanmış Supabase publishable key ile çalışır. `service_role` veya secret key tarayıcıya eklenmemiştir. Veritabanı ve görsel yükleme izinleri RLS politikalarıyla yönetilir. Bu sitede danışan/seans bilgileri tutulmaz.

Vercel, GitHub'daki `main` dalına bağlıdır; her commit otomatik dağıtım başlatır.


Makale düzenleme formunda isteğe bağlı kaynak başlığı, yazar, yayın, tarih ve kaynak URL alanları bulunur. Kaynak bağlantısı makale metninin hem başında hem sonunda “Kaynak sayfasına gidin” etiketiyle görünür.


Ana sayfa portre fotoğrafı, İçerik Masası > Hakkımda ve özgeçmiş bölümünden JPG, PNG, WebP veya AVIF biçiminde (en fazla 5 MB) yüklenip değiştirilebilir. Görsel Supabase Storage içindeki public blog-covers kovasında saklanır.


İletişim profilinde e-posta, Instagram ve LinkedIn profil bağlantısı yönetilebilir. LinkedIn bağlantısı ana sayfanın İletişim alanında görünür.


Yönetim panelindeki makale formunda “Bu içeriği kısa not olarak yayınla” kutusu işaretlendiğinde içerik Kısa Notlar sayfasında listelenir. Kısa notlar normal makale ana sayfasında görünmez; seçilerek tam metin sayfasında açılabilir.


Ana sayfada en yeni üç uzun makale görünür. Menüdeki “Makaleler” bağlantısı ve ana sayfadaki “Tüm makalelerimi gör” düğmesi tüm uzun makalelerin listelendiği `makaleler` sayfasını açar. Kısa notlar bu listeden ayrı tutulur.


## Google Search Console

- Canonical site: `https://pskbeyzaomultay.com/`
- Sitemap: `https://pskbeyzaomultay.com/sitemap.xml` (also listed in `robots.txt`)
- In Search Console, add the site as a URL-prefix property, verify ownership with Google’s HTML tag, then submit `sitemap.xml`.
- Use **Performance → Search results** to review queries, impressions, clicks, average position, and page-level visibility after Google begins collecting data.
- The verification tag is account-specific and is not committed here; add it only after the verified owner supplies the tag from Search Console.
