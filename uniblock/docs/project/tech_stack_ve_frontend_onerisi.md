# UniBlock Web Projesi - Tech Stack ve Frontend Detay Önerisi

**Tarih:** 2026-04-28  
**Kapsam:** UniBlock platformunun web yayını için önerilen teknoloji seti ve frontend mimarisi

---

## 1) Hedef ve Kısıtlar

UniBlock’un iş hedefleri (öğrenci, kulüp, proje takımı, işletme rolleri; akış, etkinlik, mesajlaşma, sponsorluk, dashboard) dikkate alındığında web katmanında ihtiyaçlar:

- Rol bazlı ve ölçeklenebilir arayüz mimarisi
- Gerçek zamanlıya yakın etkileşim (bildirim, mesajlaşma)
- Yönetilebilir form/validasyon yapısı
- Analitik ve dashboard odaklı UI
- Güvenli kimlik doğrulama (RBAC, token yönetimi, 2FA akışına hazır yapı)
- SEO ve performans açısından güçlü temel

---

## 2) Önerilen Tech Stack (Web)

## 2.1 Frontend Çekirdek

- **Framework:** Next.js (App Router) + React + TypeScript  
- **Neden:**  
  - SSR/SSG/CSR hibrit model ile performans ve SEO avantajı  
  - Büyük ölçekli routing ve modüler yapı  
  - TypeScript ile bakım ve hata azaltma

## 2.2 UI ve Stil

- **UI Kit:** shadcn/ui (Radix tabanlı erişilebilir bileşenler)  
- **CSS:** Tailwind CSS  
- **İkon:** Lucide Icons  
- **Neden:** Hızlı geliştirme, tutarlı tasarım sistemi, erişilebilirlik ve özelleştirilebilirlik

## 2.3 Veri Erişimi ve State Yönetimi

- **Server State:** TanStack Query (React Query)  
- **Client State:** Zustand (hafif global state)  
- **Form:** React Hook Form + Zod  
- **Neden:**  
  - API cache, retry, stale-while-revalidate desteği  
  - Form doğrulama ve tip güvenliği  
  - Gereksiz karmaşayı azaltan yalın state mimarisi

## 2.4 Kimlik Doğrulama ve Yetkilendirme

- **Auth Entegrasyon:** NextAuth.js (veya backend mevcut auth servisi ile JWT tabanlı custom çözüm)  
- **RBAC:** Route guard + UI permission layer  
- **Token Yönetimi:** HttpOnly cookie öncelikli  
- **Neden:** Güvenlik, oturum yönetimi ve rol bazlı erişim kontrolü

## 2.5 Grafik ve Dashboard

- **Chart Kütüphanesi:** Recharts (alternatif: ECharts)  
- **Neden:** Dashboard KPI’larını (katılım, etkileşim, memnuniyet, süreklilik) okunabilir ve hızlı sunma

## 2.6 Gözlemlenebilirlik ve Kalite

- **Hata İzleme:** Sentry  
- **Analytics:** PostHog / GA4  
- **Kod Kalitesi:** ESLint + Prettier + Husky + lint-staged  
- **Test:** Vitest + React Testing Library + Playwright

## 2.7 Dağıtım

- **Hosting:** Vercel (frontend)  
- **CI/CD:** GitHub Actions  
- **Neden:** Next.js ile doğal uyum, hızlı preview/deploy ve düşük operasyon maliyeti

---

## 3) Önerilen Frontend Mimarisi

## 3.1 Dizin Yapısı

```text
src/
  app/
    (public)/
      login/
      register/
    (protected)/
      feed/
      events/
      messages/
      dashboard/
      profile/
      sponsorships/
    layout.tsx
    page.tsx
  modules/
    auth/
    feed/
    events/
    messaging/
    dashboard/
    profile/
    sponsorship/
  shared/
    components/
    hooks/
    lib/
    types/
    constants/
  styles/
```

- `app/`: route seviyesi sayfalar
- `modules/`: domain bazlı iş mantığı ve feature bileşenleri
- `shared/`: tekrar kullanılabilir ortak yapı

## 3.2 BFF (Backend for Frontend) Yaklaşımı

Next.js route handlers ile backend servisleri arasında ince bir BFF katmanı önerilir:

- Frontend’e sade ve tutarlı API yüzeyi
- Token/cookie yönetiminde güvenlik avantajı
- Gerektiğinde response birleştirme/normalize etme

## 3.3 Role-Based UI Katmanı

- Her rol için görünür menü, sayfa ve aksiyonlar permission matrisi ile kontrol edilir.
- Öneri:
  - `canViewDashboard`, `canCreateEvent`, `canManageMembers`, `canManageSponsorships` gibi permission anahtarları
- Hem route seviyesinde hem component seviyesinde kontrol

---

## 4) Frontend Özellik Tasarımı (UniBlock Kapsamına Uyumlu)

## 4.1 Auth Akışları

- Login/Register ekranları rol seçimi ile uyumlu
- Şifre sıfırlama ve hesap kurtarma ekranları
- 2FA için ikinci adım ekranı (OTP doğrulama)
- Oturum yenileme ve güvenli çıkış akışı

## 4.2 Ana Akış (Feed)

- Kart bazlı içerik mimarisi (duyuru/etkinlik/proje/sponsor içerikleri)
- Etkileşimler: beğeni, yorum, şikayet
- Kişiselleştirme için filtre bileşenleri:
  - ilgi alanı
  - bölüm/fakülte
  - kulüp üyeliği
  - geçmiş etkileşimler

## 4.3 Etkinlik Yönetimi

- Etkinlik oluşturma/düzenleme formu
- Katılım durumu (katılacağım, katıldım vb.)
- QR check-in/check-out adım ekranları (mobil uyumlu web)
- Etkinlik sonrası memnuniyet anketi modal/form

## 4.4 Mesajlaşma

- 1-1 ve grup konuşması için ayrı kanal yapısı
- Rol bazlı mesajlaşma kısıtları
- Okundu bilgisi, son görülme, bildirim rozeti

## 4.5 Dashboard ve Analitik

- Rol bazlı dashboard:
  - Öğrenci: katılım geçmişi, ilgi alanı önerileri
  - Kulüp: etkinlik performansı, üye etkileşimi
  - İşletme: kampanya dönüşümü, sponsorluk performansı
- Performans endeksi bileşeni:
  - Katılım, memnuniyet, etkileşim, süreklilik
  - Zaman aralığı filtreleri (haftalık/aylık/dönemlik)

---

## 5) Tasarım Sistemi ve UI Prensipleri

## 5.1 Design Tokens

- Renkler: primary, success, warning, danger, neutral palet
- Tipografi: başlık/gövde/yardımcı metin hiyerarşisi
- Boşluk sistemi: 4-8-12-16-24-32 grid yaklaşımı
- Radius, shadow, border token standardı

## 5.2 Bileşen Kataloğu (Minimum)

- Button, Input, Select, Checkbox, Radio
- Card, Modal, Drawer, Tabs, Table
- Toast/Alert, Empty State, Skeleton, Pagination
- Role Badge, KPI Card, Chart Container

## 5.3 Erişilebilirlik (A11y)

- Klavye navigasyonu
- Aria etiketleri
- Kontrast oranı kontrolü
- Form hata mesajlarında screen-reader uyumu

---

## 6) Güvenlik ve Performans Standartları

## 6.1 Güvenlik

- HttpOnly/Secure cookie
- CSRF koruması (özellikle form aksiyonları)
- XSS için output escaping ve güvenli render
- RBAC + action-level permission kontrolü
- Rate limit ve kritik aksiyonlarda doğrulama adımı

## 6.2 Performans

- Route-level code splitting
- Görsellerde next/image kullanımı
- Kritik sayfalarda server-side rendering
- Uzun listelerde sanallaştırma (virtualization)
- Query cache stratejileri ve optimistik güncelleme

---

## 7) Test Stratejisi (Frontend)

- **Unit Test:** yardımcı fonksiyonlar, validation şemaları
- **Component Test:** formlar, tablo, modal, permission wrapper
- **E2E Test:** login, rol bazlı dashboard, etkinlik katılımı, mesajlaşma kritik akışları
- **Smoke Test:** release öncesi temel gezinme ve auth kontrolü

---

## 8) MVP İçin Önerilen Frontend Backlog

1. Auth ekranları (login/register/forgot-password/otp)
2. Protected layout + role guard altyapısı
3. Feed sayfası + etkileşim aksiyonları
4. Event list/detail/create akışları
5. Mesajlaşma temel ekranı
6. Profil yönetimi
7. Dashboard v1 (KPI kart + temel grafikler)
8. Sponsorluk modülü v1 (listeleme/başvuru durumu)

---

## 9) Alternatif Stack (Daha Hafif)

Eğer ekip küçük ve ilk hedef yalnızca hızlı MVP ise:

- **Vite + React + TypeScript**
- **React Router**
- **Tailwind + headless UI**
- **TanStack Query + Zustand**
- **Netlify/Vercel deploy**

Bu alternatif daha hızlı başlangıç sağlar; ancak orta-uzun vadede Next.js yaklaşımı daha ölçeklenebilir olur.

---

## 10) Tema/Tasarım Notları (Referans Görsellere Göre)

Bu bölüm, paylaşılan referans ekran görüntülerindeki görsel dili UniBlock projesine uyarlamak için hazırlanmıştır.

## 10.1 Görsel Kimlik

- **Minimal + editorial tarz**: temiz arka plan, güçlü tipografi, az ama etkili renk.
- **Ana renk yaklaşımı**:
  - Zemin: beyaz
  - Metin: siyah / koyu gri
  - Vurgu: turkuaz-yeşil ton
- **Yüksek okunabilirlik** için kalın başlıklar + sade gövde metinleri.

## 10.2 Tipografi ve Hiyerarşi

- Ana sayfa hero başlıklarında güçlü, büyük punto kullanımına öncelik verilmeli.
- Bölüm başlıkları (ör. “01 — ANA AKIŞ”, “02 — HABERLER”) sabit formatta ve tutarlı.
- Kart başlıklarında maksimum 2 satır kuralı, açıklamalarda 2-3 satır özet yaklaşımı.

## 10.3 Layout ve Grid

- Geniş whitespace kullanımı korunmalı.
- Masaüstünde 12 kolon mantığı, içerik kartlarında düzenli satır/kolon akışı.
- İçerik blokları arasında ritmik spacing sistemi (ör. 24/32/48/64).

## 10.4 Bileşen Dili

- Butonlar: dolu (primary) ve çerçeveli (secondary) varyant.
- Kartlar: ince border + sade hover efekti.
- Etiketler (tag/chip): teknoloji, kategori, durum (örn. “geliştiriliyor”, “tamamlandı”) için kullanılmalı.
- Aktif menü vurgusu referans temadaki gibi alt çizgi/renk ile belirgin olmalı.

## 10.5 Etkileşim ve Mikro-Animasyon

- Hover durumları sade ve hızlı (150-200ms).
- Link ve kart geçişlerinde düşük yoğunluklu animasyon.
- Scroll ile bölüm geçişlerinde görsel bütünlüğü bozmayacak şekilde yumuşak davranış.

## 10.6 Uygulama Notu (UniBlock’a Özel)

- Referans temadaki “journal” yaklaşımı UniBlock’ta “Haberler” ve “Duyuru Akışı” için birebir kullanılabilir.
- Kulüp/proje/işletme içerikleri aynı kart sisteminde ama farklı badge/renk kodlarıyla ayrıştırılmalı.

---

## 11) Haberler Modülü (Kullanıcı Aktifliği İçin)

## 11.1 Amaç

Kullanıcının platformda kalma süresini ve günlük geri dönüş oranını artırmak için kişiselleştirilmiş haber akışı sunmak.

## 11.2 Haberler Sayfası Kapsamı

- “Haberler” ana menüde ayrı sekme olarak konumlanır.
- İçerikler kategori kartları halinde listelenir:
  - Teknoloji
  - Yazılım
  - Yapay Zeka
  - Girişimcilik
  - Kampüs / Üniversite duyuruları
- Her kartta: başlık, kısa özet, kaynak, tarih, kategori, “Oku” aksiyonu.

## 11.3 Kişiselleştirme Mekaniği

Haber akışı aşağıdaki sinyallerle şekillenir:

1. **Kayıt sırasında alınan bilgiler**
   - Bölüm/Fakülte
   - İlgi alanları (çoklu seçim)
2. **Kullanım içi davranışlar**
   - Okunan haber türleri
   - Beğeni/kaydetme/atlama
   - Sayfada kalma süresi
3. **Rol bazlı ağırlık**
   - Öğrenci, kulüp yöneticisi, proje takımı ve işletme için farklı öneri dağılımı

## 11.4 Akış Stratejisi (Öneri)

- Varsayılan akış: `%60 ilgi alanı`, `%25 bölüm ilişkili`, `%15 trend/popüler`.
- “Senin için” sekmesi: kişiselleştirilmiş içerik.
- “Trend” sekmesi: genel yüksek etkileşimli haberler.
- Soğuk başlangıç (new user): kayıtta seçilen bölüm + ilgi alanı bazlı başlangıç seti.

## 11.5 Özelleştirilebilir Başlıklar ve Tercih Yönetimi

- Kullanıcı “Haber Tercihleri” ekranında:
  - İlgi alanı seçimini güncelleyebilir
  - Görmek istemediği kategorileri kapatabilir
  - Başlık yoğunluğu modu seçebilir (kısa/standart/detaylı özet)
- Ana akışta dinamik başlık blokları:
  - “Bölümüne Özel”
  - “İlgi Alanına Göre”
  - “Gündemde Olanlar”

## 11.6 Moderasyon ve Güvenilirlik

- Kaynak güven skoru (onaylı kaynak listesi)
- Şikayet edilen içerik için moderasyon kuyruğu
- Yanıltıcı içerik tespiti için manuel + kural tabanlı kontrol

## 11.7 Ölçümleme (KPI)

- Haber tıklama oranı (CTR)
- Haber okuma tamamlama oranı
- Günlük/haftalık aktif kullanıcı artışı
- Kişiselleştirilmiş akışta geri dönüş oranı

---

## 12) Bilgi Mimarisi ve Sayfa Kurgusu (Netleştirilmiş)

Bu bölüm, ürün akışının teknik olarak nasıl modellenmesi gerektiğini netleştirir.

## 12.1 İlk Karşılama: Public Ana Sayfa

- Siteye ilk girişte kullanıcıyı **public bir ana sayfa (`/`)** karşılar.
- Bu sayfanın amacı:
  - UniBlock fikrini herkes için anlaşılır şekilde anlatmak
  - Temel modülleri (akış, haberler, etkinlik, topluluklar) özetlemek
  - Kullanıcıyı iki net aksiyona yönlendirmek:
    - **Giriş Yap (`/login`)**
    - **Üye Ol (`/register`)**
- Teknik not:
  - SEO için SSR/metadata optimize edilmeli
  - Hero + özellik kartları + CTA blokları bileşenleştirilmeli

## 12.2 Auth Sonrası Ana Akış Kurgusu

Auth sonrasında kullanıcı `/(protected)/feed` benzeri bir giriş sayfasına alınır.

Ana akışta içerik blokları birbirinden görsel ve yapısal olarak ayrılır:

1. **Haberler Bloğu**
   - Dünya gündemi + kampüs haberleri birlikte
   - Bölüme göre filtrelenmiş ve kişiselleştirilmiş içerik
2. **Duyuru/Etkinlik Bloğu**
   - Kulüp/proje/üniversite etkinlik duyuruları
   - Tarih, katılım, hatırlatma aksiyonları
3. **Topluluk ve Proje Bloğu**
   - Kulüp/proje ekibi içerikleri
   - Etkileşim aksiyonları (katıl, takip et, mesaj gönder)

## 12.3 Haberler Modülü: Teknik Ayrım ve Kaynak Modeli

- Haberler modülü, feed içinde “ayrı section” olarak değil, gerekirse ayrı rota ile de desteklenir:
  - Örn: `/news` (detaylı haber deneyimi)
- Kaynak katmanları:
  1. Dünya gündemi kaynakları
  2. Kampüs/üniversite kaynakları
  3. İç moderasyon ve güven skoru katmanı
- Önerilen response normalizasyonu:
  - `title`, `summary`, `source`, `publishedAt`, `category`, `relevanceScore`, `campusRelated`, `departmentTags`

## 12.4 Bölüm Bazlı Kişiselleştirme (Teknik)

Kişiselleştirme sinyalleri:

- Kullanıcının bölüm/fakülte bilgisi
- İlgi alanı etiketleri
- Geçmiş okuma/etkileşim davranışları
- Trend/popülerlik sinyali

Örnek skor yaklaşımı:

`news_score = dept_match * 0.35 + interest_match * 0.35 + behavior_match * 0.20 + trend_score * 0.10`

Varsayılan dağılım:

- `%60` ilgi alanı ve bölüm uyumlu
- `%25` bölümle ilişkili güncel içerik
- `%15` trend/genel gündem

## 12.5 Route ve Navigation Önerisi

```text
(public)
  /
  /login
  /register

(protected)
  /feed
  /news
  /events
  /messages
  /dashboard
  /profile
```

- İlk açılış her zaman `/`
- Auth kontrolü sonrası role göre protected rotalara erişim
- Navigation’da “Akış” ve “Haberler” ayrı menü öğeleri olarak gösterilir

## 13) Net Öneri

UniBlock’un çok rollü ve veri yoğun yapısı nedeniyle **önerilen ana yol**:

- **Next.js + TypeScript + Tailwind + shadcn/ui + TanStack Query + Zustand + React Hook Form + Zod**
- **Public anasayfa + auth yönlendirme + protected ana akış ayrımı**
- **Akış içinde haber/duyuru/topluluk bölümlerinin net bilgi mimarisi**
- **Bölüm ve ilgi alanı tabanlı kişiselleştirilmiş haber mimarisi**
- **RBAC odaklı route/component guard mimarisi**
- **Sentry + Playwright + GitHub Actions ile kalite hattı**

Bu kombinasyon, MVP’den kurumsal olgunluğa geçişte yeniden yazım maliyetini minimize eder ve ürünün webde sürdürülebilir şekilde büyümesini destekler.
