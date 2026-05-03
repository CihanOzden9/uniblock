# UniBlock Changelog

Bu dosya, projede gerçekleştirilen tüm tasarım, geliştirme ve yapılandırma değişikliklerinin günlüğünü tutar. 

## [Tarih: 01.05.2026] - Faz 1 UI/UX ve Tasarım Sistemi Entegrasyonu

Bu güncelleme paketi, `demo/front_detay.md` dosyasında belirtilen "Minimalist, Editorial ve Tipografik" tasarım felsefesinin UniBlock projesine entegre edilmesini kapsar.

### 🎨 1. Global Tasarım ve Stil Değişiklikleri
- **Dosya:** `uniblock/src/app/globals.css`
  - Shadcn UI'ın varsayılan teması değiştirildi.
  - "Dark Mode" sistemi tamamen devredışı bırakıldı (Sadece Light Mode kullanılacak).
  - Tasarım sisteminde istenen ana renk paleti (`--black`, `--white`, gri tonları ve vurgu rengi `--accent: #059669`) kök dizin (root) değişkenlerine eklendi.
  - Shadcn bileşenlerinin yuvarlak köşeleri kaldırılarak keskin ve sert hatlar için `--radius: 0rem` atandı.
  - Özel scrollbar (kaydırma çubuğu) ve metin seçim (`::selection`) yeşil vurgusu eklendi.

### 🔤 2. Tipografi ve Font Ayarları
- **Dosya:** `uniblock/src/app/layout.tsx`
  - Varsayılan Next.js "Geist" fontları kaldırılarak tasarıma uygun Google Fonts eklendi.
  - Metinler için `Inter` (sans-serif), başlıklar için `Montserrat` (heading) import edildi.
  - `body` etiketine varsayılan arka plan ve metin renkleri eklendi.

### 🏠 3. Ana Sayfa (Landing Page) Revizyonu
- **Dosya:** `uniblock/src/app/page.tsx`
  - "Hero Section" tamamen tipografik bir yapıya dönüştürüldü (`Kampüsü Keşfet`).
  - Arka plana ince, hafif yeşil (`#059669` opacity ile) grid (ızgara) çizgileri eklendi.
  - Üst menü (Navbar) çok daha minimalist, sade çizgilere sahip hale getirildi.
  - "Hemen Başla" butonuna yeşil renk ve brutalist tasarım gölgesi (offset shadow) eklendi.
  - "Scroll" ibaresi "Aşağı Kaydır" olarak Türkçeleştirildi. Ekran boyutlarındaki butonlarla çakışma sorununu çözmek adına içerik alanına "padding-bottom" eklenip, küçük ekranlarda gizlenmesi (`hidden md:flex`) sağlandı.

### 🔐 4. Kimlik Doğrulama (Auth) Arayüzleri
- **Dosya:** `uniblock/src/app/(public)/register/page.tsx`
  - "Kayıt Ol" form yapısı tamamen yeni temaya göre kurgulandı.
  - Default kart gölgeleri iptal edilip, yeşil renkli flat shadow (offset shadow) eklendi.
  - Rol bazlı sekmeler (Öğrenci, Kulüp vb.) siyah/beyaz/yeşil renk geçişli, keskin kenarlı tasarlandı.
  - Input odaklanma (focus) durumları için yeşil çerçeve eklendi.

- **Dosya:** `uniblock/src/app/(public)/login/page.tsx`
  - "Giriş Yap" ve "2FA Doğrulama" modüllerinin görsel standartları Kayıt sayfası ile birebir aynı minimalist/editorial çizgiye getirildi.

### 👤 5. Profil Yönetimi Sayfası
- **Dosya:** `uniblock/src/app/(protected)/profile/page.tsx`
  - Sayfa arka plan rengi "Açık Gri (`#f5f5f5`)" yapılarak profil içerik kartlarının (beyaz) öne çıkması sağlandı.
  - Sol taraftaki "Kullanıcı Özeti" alanına görsel efektler (hover ile grayscale animasyonu) eklendi.
  - "Genel Bilgiler", "Akademik", "İlgi Alanları", "Güvenlik" tab'leri baştan aşağı yenilendi; altı yeşil çizgili sekmeli yapı kuruldu.
  - Tüm kaydetme butonları global tasarıma uygun yeşil ana renk ile donatıldı.

### 📰 6. Haber Akışı (Feed) ve RSS Altyapısı
- **Dosya:** `uniblock/src/app/(protected)/feed/page.tsx`
  - `demo/haberler.html` tasarımı baz alınarak tamamen yeni bir Haber Akışı sayfası oluşturuldu.
  - 3 kolonlu, siyah çerçeveli (grid gap) minimalist haber kartları tasarlandı.
  - Kategori bazlı filtreleme çubuğu (chips) eklendi.
  - Header alanına kullanıcı profil özeti (Ece Yılmaz - Demo) entegre edildi.
- **Dosya:** `uniblock/src/data/rss/sources.json`
  - Fakülte ve bölüm bazlı RSS kaynaklarını yöneten JSON veri yapısı kuruldu.
- **Dosya:** `uniblock/src/middleware.ts`
  - `/feed` sayfasına erişim geçici olarak serbest bırakıldı.

---

## 🚀 [01.05.2026] Sosyal Etkileşim ve Merkezi Tasarım Sistemi

### 🧭 1. Merkezi Navigasyon Sistemi (Navbar)
- **Dosya:** `uniblock/src/components/layout/Navbar.tsx`
  - Tüm sayfalarda kullanılan lokal Header'lar kaldırılarak merkezi bir Navbar bileşeni oluşturuldu.
  * **Akıllı Navigasyon:** URL parametrelerini (`?tab=news/community`) okuyarak aktif sekmeyi ve Navbar linklerini otomatik vurgulama özelliği eklendi.
  * **Liderlik Tablosu:** Navbara kampüsün en başarılı 5 kulübünü puanlarıyla gösteren "Liderlik" (Popover) alanı entegre edildi.

### 💬 2. Sosyal Haber Akışı ve Etkileşim
- **Dosya:** `uniblock/src/app/(protected)/feed/page.tsx`
  * **Sosyal Sayaçlar:** Haber kartlarına editorial dile uygun Beğeni ve Yorum sayaçları eklendi.
  * **Detay Paneli (Sheet):** Karta tıklandığında sağdan açılan, haber içeriğini ve yorumları gösteren etkileşimli yan panel entegre edildi.
  * **Boş Durum (Empty State):** İçerik bulunmayan kategoriler için şık bir "İçerik Bulunamadı" uyarısı ve yönlendirme butonu eklendi.
  * **Yerleşim Optimizasyonu:** Sekmeler arası geçişte dikey kaymaları önleyen "Space Holder" ve "Sticky Footer" yapısı kuruldu.

### 🏆 3. Profil ve Puanlama Sistemi
- **Dosya:** `uniblock/src/app/(protected)/profile/page.tsx`
  * **Etkinlik Takibi:** Profil sayfasına "Etkinliklerim" sekmesi eklendi.
  * **Puanlama:** Kullanıcının katıldığı etkinliklerden kazandığı puanları ve toplam puanını gösteren liste yapısı kuruldu.

### 🛠️ 4. UI Altyapı ve Bağımlılıklar
- **Dosyalar:** `src/components/ui/popover.tsx`, `src/components/ui/sheet.tsx`
  * Sistem kısıtlamaları nedeniyle eksik kalan Shadcn UI bileşenleri manuel olarak oluşturuldu ve Radix UI kütüphaneleriyle entegre edildi.

---

## 🛠️ [02.05.2026] Kritik Özellik Tamamlamaları ve Veri Modelleme

### 📊 1. Kapsamlı Veritabanı Modellemesi
- **Dosya:** `docs/project/notlar/db tablo verileri`
  - Projenin `amac.txt` dosyasındaki tüm gereksinimlerini kapsayan uçtan uca veritabanı şeması tasarlandı.
  - Öğrenci, Kulüp, Takım, Duyuru, Etkinlik, Anket, Mesaj, Bildirim ve Sponsorluk (Firma) tabloları tüm alanlarıyla (field) detaylandırıldı.
  - Kulüplerin aylık puan sıfırlama ve geçmişe dönük sıralama verisi tutma mantığı kurgulandı.

### 🔔 2. Öğrenci Akışı (Demo) Geliştirmeleri
- **Dosyalar:** `demo/ogrenci.html`, `demo/styles.css`, `demo/app.js`
  * **Bildirim Merkezi:** Header alanına bildirim ikonu ve dinamik bildirim rozeti (badge) eklendi.
  * **Haftalık Anketler:** Ana akışın yanına (sidebar) öğrencilerin katılarak puan kazanabileceği anket bileşeni entegre edildi.
  * **Kulüp Sıralaması (Ranking):** Yan menüde kampüsün en aktif 5 kulübünün puanlarını gösteren canlı sıralama listesi oluşturuldu.
  * **Sosyal Etkileşimler:** Duyuru ve haber kartlarına "Beğen" ve "Yorum Yap" butonları eklendi; beğeni butonu için aktif/pasif görsel geri bildirim mantığı kuruldu.

### 🗺️ 3. Navigasyon ve Sayfa Yapısı
- **Dosyalar:** `demo/ogrenci.html`
  * Navigasyon menüsüne "Sıralamalar" linki eklenerek platformun rekabetçi yönü vurgulandı.
  * Sayfa düzeni tek sütunlu yapıdan, ana içerik ve yan menü (sidebar) içeren ızgara (grid) yapısına dönüştürüldü.

### 📝 4. Durum Analizi ve Planlama
- **Dosya:** `docs/project/notlar/analiz_notlari.txt`
  - `amac.txt` (Hedef) ile mevcut kod (Gerçekleşen) arasındaki tüm uyumsuzluklar raporlandı.
  - Kulüp başkanı dashboard'u ve yönetim araçlarının eksikliği kritik olarak işaretlendi.

