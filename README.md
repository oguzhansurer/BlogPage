# Psikolog Beyza Nur Ömültay

Bordo tonlarında çok sayfalı psikoloji blogu. Statik HTML/CSS/JavaScript ön yüzü makaleleri, hakkımda ve özgeçmiş bilgilerini Supabase'de saklar.

## Yayındaki site ve yönetim paneli

- Site: https://beyza-nur-blog.vercel.app
- İçerik masası: https://beyza-nur-blog.vercel.app/icerik-masasi.html
- Supabase projesi: https://supabase.com/dashboard/project/vcpktnjgvmhxucwwhame

## Sayfalar

- `index.html`: Ana sayfa, makale kartları, hakkımda ve özgeçmiş
- `makale.html?id=...`: Tam yazı için ayrı sayfa
- `icerik-masasi.html`: Yönetici girişi, makale/CV düzenleme paneli
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
