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

### 🛠 6. Middleware Düzenlemesi (Geliştirme Amaçlı)
- **Dosya:** `uniblock/src/middleware.ts`
  - `/profile` sayfasının tasarımsal olarak test edilebilmesi için JWT/Token doğrulama mekanizmasındaki erişim kısıtlamasına geçici bir istisna (exception) kuralı eklendi. Sayfa artık Auth olmadan doğrudan incelenebiliyor.
