# Psikolog Beyza Nur Ömültay

Bordo tonlarında, statik HTML/CSS/JavaScript ile hazırlanmış çok sayfalı blog taslağı.

## Sayfalar

- `index.html`: Ana sayfa, yazı listesi, hakkımda ve özgeçmiş
- `makale.html?id=...`: Makaleyi ayrı sayfada gösterir
- `icerik-masasi.html`: Tarayıcıda çalışan örnek içerik paneli
- `site.css`, `site.js`: Ortak stiller ve sayfa işlevleri

## Vercel'e yayınlama

Bu sürüm derleme gerektirmeyen statik bir sitedir. Vercel'de GitHub deposunu içe aktarırken Framework Preset olarak `Other` seçip Build Command ve Output Directory alanlarını boş bırakabilirsin. Dosyalar deponun kökünde olduğundan `index.html` ana sayfa olarak servis edilir.

## İçerik saklama notu

Şimdiki içerik paneli makale ve profil verilerini yalnızca aynı tarayıcının `localStorage` alanında tutar. Bu kayıtlar Vercel'e, GitHub'a veya başka ziyaretçilerin tarayıcılarına gönderilmez. İnternette kalıcı ve ortak içerik için sunucu taraflı kimlik doğrulama ve veritabanı gerekir. Makale/CV kayıtları için PostgreSQL (ör. Vercel Marketplace üzerinden Supabase veya Neon), görsel dosyaları için Vercel Blob kullanılabilir. Yönetim işlemleri sunucu API'leri üzerinden, sırlar yalnızca Vercel ortam değişkenlerinde tutularak yapılmalıdır.

Bu blogda danışan kayıtları, seans notları veya başka hassas sağlık bilgileri saklanmamalıdır.

