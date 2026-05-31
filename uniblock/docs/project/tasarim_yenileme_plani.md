# Tasarım Yenileme Planı — "Academic Pulse / UniVerse" Konsepti

Bu belge, `tasarım_detayları/` klasöründeki mockup'larda (DESIGN.md + `code.html` dosyaları)
tanımlanan **Academic Pulse / UniVerse** tasarım dilinin UniBlock uygulamasına nasıl
uyarlanacağını adım adım açıklar.

> Not: `tasarım_detayları/` klasörü `.gitignore` ile repodan hariç tutulmuştur; yalnızca
> yerel referans materyalidir. Bu plan ise repoda kalır.

---

## 1. Mevcut Durum vs. Hedef — Özet

| Konu | Mevcut UniBlock (neo-brutalist) | Hedef (Academic Pulse) |
|------|--------------------------------|------------------------|
| Karakter | Sert, minimalist, "brutalist" | Kurumsal / modern, "Structured Vitality" |
| Köşe yarıçapı | `--radius: 0rem` (keskin) | `rounded-xl` = 12px (kartlar), `rounded-full` (buton/input) |
| Kenarlık | `border-black border-2` | İnce `1px` `outline-variant` (`#c1c6d6`) veya kenarlıksız |
| Gölge | Sert ofset `shadow-[8px_8px_0px_0px_#000]` | Yumuşak "ambient" gölge + hover'da `translateY(-2px)` |
| Birincil renk | Siyah (`#000`) | Eğitim Mavisi `#005bbf` |
| Vurgu rengi | Yeşil (`#059669`) | Topluluk Turuncusu `#fd6c00` / `#1a73e8` |
| Arka plan | Beyaz | Soğuk açık mavi `#f8f9ff` + tonal katmanlar |
| Tipografi başlık | Space Grotesk, `uppercase tracking-widest` | Inter 600/700, hafif sıkı letter-spacing |
| İkonlar | `lucide-react` | Material Symbols Outlined (lucide ile de karşılanabilir) |
| Düzen | Tek kolon / kart ızgarası | 12 kolon akışkan grid, sabit yan paneller (280–320px) |

**Kısacası:** keskin/siyah-beyaz brutalizmden, yumuşak gölgeli, mavi-turuncu, kart merkezli
kurumsal bir dile geçiş. Bu görsel bir yenilemedir; veri modeli, server action'lar ve sayfa
mimarisi (`page.tsx` → `*Client.tsx` ayrımı) **değişmez**.

---

## 2. Tasarım Token'ları (Academic Pulse)

Kaynak: `tasarım_detayları/academic_pulse/DESIGN.md`.

### 2.1 Renk Paleti
```
primary            #005bbf   on-primary            #ffffff
primary-container  #1a73e8   primary-fixed         #d8e2ff
secondary          #9f4200   secondary-container   #fd6c00   (turuncu vurgu)
tertiary           #9e4300   tertiary-container    #c55500
error              #ba1a1a   error-container       #ffdad6

surface                  #f8f9ff   (ana arka plan)
surface-container-low    #eff4ff
surface-container        #e5eeff
surface-container-high   #dce9ff
surface-container-highest #d3e4fe
on-surface               #0b1c30   (ana metin)
on-surface-variant       #414754   (ikincil metin)
outline                  #727785   outline-variant   #c1c6d6  (kenarlık)
```
> Material Design 3 token isimleri kullanılmış. UniBlock'ta shadcn değişkenlerine eşleyeceğiz
> (bkz. §3.1), ancak `surface-container-*` tonal katmanları için ek yardımcı renkler de eklenecek.

### 2.2 Tipografi (tek aile: **Inter**)
| Token | Boyut / satır / ağırlık |
|-------|--------------------------|
| display-lg | 48/56, 700, -0.02em (mobil 36/44) |
| headline-lg | 32/40, 600, -0.01em |
| headline-md | 24/32, 600 |
| body-lg | 18/28, 400 |
| body-md | 16/24, 400 (gövde standardı) |
| label-md | 14/20, 500, +0.01em |
| label-sm | 12/16, 600 |

### 2.3 Yarıçap / Gölge / Aralık
- **Yarıçap:** sm 4px · DEFAULT/lg 8px · **xl 12px (kart)** · full 9999px (buton, input, avatar).
- **Gölge (ambient):**
  - Seviye 1 (kart): `box-shadow: 0 4px 6px -1px rgba(0,0,0,.02), 0 2px 4px -1px rgba(0,0,0,.02)`
  - Seviye 2 (hover): `0 10px 15px -3px rgba(0,0,0,.06)` + `transform: translateY(-2px)`
  - Seviye 3 (modal): 24px blur, daha derin.
- **Aralık (8px baz grid):** stack-sm 8 · stack-md 16 · stack-lg 32 · gutter 24 · container-max 1280px.

---

## 3. Uygulama Stratejisi

Yaklaşım: **token-önce, sonra bileşen, en son sayfa.** Önce merkezi tasarım değişkenlerini ve
ortak shadcn bileşenlerini değiştiririz; bu sayede sayfaların büyük bölümü otomatik olarak yeni
görünüme kavuşur. Ardından elle yazılmış brutalist sınıfları (`border-black border-2`,
`shadow-[8px_8px...]`, `rounded-none`) sayfa sayfa temizleriz.

### 3.1 `globals.css` — Token katmanı (ilk ve en kritik adım)
Dosya: `src/app/globals.css`.

1. `--radius: 0rem` → `--radius: 0.75rem` (12px). shadcn'in `--radius-sm/md/lg` türevleri buna bağlı.
2. Renk değişkenlerini Academic Pulse'a göre yeniden eşle:
   - `--primary: #005bbf` / `--primary-foreground: #ffffff`
   - `--accent: #fd6c00` / `--accent-foreground: #ffffff` (yeşil yerine turuncu vurgu)
   - `--background: #f8f9ff`, `--foreground: #0b1c30`
   - `--card: #ffffff`, `--muted: #eff4ff`, `--muted-foreground: #414754`
   - `--border / --input: #c1c6d6`, `--ring: #005bbf`
   - `--secondary: #eff4ff` (açık yüzey), `--secondary-foreground: #0b1c30`
3. Tonal yüzey katmanları için ek değişken/utility ekle (`@theme inline`):
   `--color-surface-container-low/-/-high/-highest`. Yan panel ve "popüler topluluklar"
   bölümlerinde kullanılacak.
4. Ambient gölge yardımcı sınıflarını ekle (mockup'taki `.ambient-shadow-1/2` karşılığı):
   ```css
   @utility shadow-ambient   { box-shadow: 0 4px 6px -1px rgb(0 0 0 / .02), 0 2px 4px -1px rgb(0 0 0 / .02); }
   @utility shadow-ambient-lg{ box-shadow: 0 10px 15px -3px rgb(0 0 0 / .06), 0 4px 6px -2px rgb(0 0 0 / .06); }
   /* hover lift: hover:shadow-ambient-lg hover:-translate-y-0.5 transition */
   ```
5. Scrollbar / `::selection` / focus rengini siyah-yeşilden mavi-(`#005bbf`) tonlarına çevir.

### 3.2 Tipografi / Font
Dosya: `src/app/layout.tsx`.
- Gövde zaten **Inter** (`--font-sans`). Başlık fontunu Space Grotesk'ten **Inter**'e çevir
  (`--font-heading` → Inter) çünkü hedef tek aile Inter. Space_Grotesk import'unu kaldır.
- `globals.css` içindeki `h1..h6 { @apply font-heading tracking-tight }` korunur (Inter ile uyumlu).
- Body metin rengi `text-[#525252]` → `text-foreground` (`#0b1c30`) olarak güncellenmeli (layout body sınıfı).

### 3.3 İkonlar
- Mockup **Material Symbols Outlined** kullanıyor. İki seçenek:
  - **(Önerilen)** `lucide-react` ile devam et — zaten kurulu, React-dostu, tree-shake edilir.
    Material Symbols'taki ikonların lucide karşılıkları mevcut (search, bell→Bell, groups→Users,
    event→Calendar, poll→BarChart3, bookmark→Bookmark, school→GraduationCap vb.).
  - (Alternatif) Material Symbols web font'unu ekleyip ikonografiyi birebir eşlemek. Daha ağır,
    iki ikon sistemi karışır; önerilmez.

### 3.4 Ortak shadcn bileşenleri (`src/components/ui/`)
Brutalist varyantları yumuşak Academic Pulse stiline çevir:

- **button.tsx** — keskin/siyah → `rounded-full` (veya kompakt için `rounded-lg`), `bg-primary`
  (mavi) + `hover:bg-primary-container`; ikincil aksiyon ("Katıl/Oluştur") `bg-accent` (turuncu);
  hard shadow yok. Outline varyantı: `border-primary text-primary hover:bg-primary-fixed`.
- **card.tsx** — `rounded-xl border border-outline-variant shadow-ambient`,
  hover gerektiren kartlarda `hover:shadow-ambient-lg hover:-translate-y-0.5 transition`.
- **input.tsx** — `rounded-full` (form alanları) / `rounded-lg`, `border-outline-variant`,
  `focus:border-primary focus:ring-2 focus:ring-primary-fixed`.
- **badge.tsx** — pill (`rounded-full`), kategori için `bg-primary-fixed text-primary`,
  "aktif/hot" için turuncu (`bg-secondary-container/15 text-secondary`).
- **tabs.tsx / select.tsx / checkbox.tsx / dropdown-menu.tsx / popover.tsx / sheet.tsx** —
  radius ve renkleri token'lara hizala; sert kenarlıkları kaldır.
- **avatar.tsx** — zaten dairesel; kenarlığı `border-outline-variant` yap.

### 3.5 Layout bileşenleri (`src/components/layout/`)
- **Navbar.tsx** — beyaz/`surface` sabit üst bar, alt `border-outline-variant`, aktif sekme
  `border-b-2 border-primary text-primary`; bildirim noktası turuncu (`bg-secondary-container`);
  arama input'u `rounded-full`. (Mockup: `universe_ana_sayfa/code.html` nav bölümü.)
- **AdminNavbar.tsx** — admin/yönetim panelleri için aynı dil; `basePath` mantığı korunur.
- **LandingClient.tsx** — hero bölümü: `surface-container-low` arka plan, ince radyal nokta deseni,
  `display-lg` başlık, `rounded-full` arama + "Keşfet" butonu. (Mockup: `universe_ana_sayfa`.)

### 3.6 Sayfa bazlı temizlik (brutalist sınıfların kaldırılması)
Tarama sonuçları: `shadow-[8px_8px...]` → **16 dosya**, `rounded-none` → **19 dosya**,
`border-black border-2` → **17 dosya**. Bunlar büyük ölçüde `*Client.tsx` dosyalarında.

Her dosyada şu dönüşümü uygula:
- `rounded-none` → kaldır (varsayılan `rounded-xl` devreye girer) veya bağlama göre `rounded-lg`.
- `border-black border-2` → `border border-outline-variant` (çoğu yerde kaldırılabilir).
- `shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]` ve `hover:translate-x-1 hover:translate-y-1 hover:shadow-none`
  → `shadow-ambient hover:shadow-ambient-lg hover:-translate-y-0.5 transition-all`.
- `uppercase tracking-widest` etiketleri → `label-sm` (12/16, 600); aşırı uppercase azaltılır.
- Siyah/`bg-black` butonları → `bg-primary`; yeşil aksanlar (`accent`/`#059669`) → turuncu vurgu.

Öncelik sırası (kullanıcıya en görünür ekranlar önce):
1. `(public)/login`, `(public)/register` — bkz. `universe_giri_yap` mockup'u (ortalanmış kart,
   bulanık kampüs arka planı, `rounded-xl` kart, mavi birincil buton).
2. `(protected)/feed` — bkz. `universe_ana_sayfa` (3+6+3 kolon: sol kısayollar, orta akış, sağ anket/topluluk).
3. `(protected)/clubs` ve `(protected)/teams` (liste + `ClubsClient`/`TeamsClient` kartları).
4. Kulüp/Takım **detay**/yönetim ekranları — bkz. `bili_im_teknolojileri_kul_b_detay` (kapak görseli,
   üst üste binen profil, "Hakkında/Hakkımızda", "Yönetim Kurulu", "Yaklaşan/Geçmiş Etkinlikler").
5. `(protected)/events` — bkz. `etkinlik_takvimi` (Aylık/Haftalık/Liste sekmeleri, kategori pill
   filtreleri, takvim ızgarası, sağda "Yaklaşan Etkinlikler" + turuncu "Etkinlik Oluştur").
6. `(protected)/news`, `(protected)/profile`.
7. `admin/*` paneli — bkz. `admin_y_netim_paneli` (sol sidebar, üstte KPI/"bento" istatistik
   kartları, "Kulüpler Listesi" tablo, sağda "Bekleyen Şikayetler"). `StatsClient` (Recharts)
   renkleri mavi/turuncu paletine alınır.

### 3.7 Grafikler (Recharts)
`clubs/manage/stats/StatsClient.tsx` ve admin istatistikleri: seri renklerini `#005bbf` (mavi)
ve `#fd6c00` (turuncu) + tonal mavilerle değiştir; grid/eksen renkleri `outline-variant`.

---

## 4. Faz Planı (önerilen sıra)

| Faz | Kapsam | Çıktı / kabul kriteri |
|-----|--------|------------------------|
| **0. Hazırlık** | `tasarım_detayları/` gitignore (✅ yapıldı), bu plan dosyası | Referans hazır |
| **1. Token & font** | §3.1 `globals.css`, §3.2 layout/font, §3.4 shadcn ui bileşenleri | Uygulama derleniyor; ortak bileşenler yeni renk/radius/gölge ile geliyor |
| **2. Çatı (shell)** | §3.5 Navbar, AdminNavbar, Landing | Tüm sayfalarda yeni üst bar/hero |
| **3. Auth** | login + register (§3.6/1) | Mockup'a uygun giriş/kayıt |
| **4. Ana akış & listeler** | feed, clubs, teams (§3.6/2-3) | Kart ızgaraları yenilendi |
| **5. Detay & yönetim** | kulüp/takım detay + manage, events takvim (§3.6/4-5) | Mockup düzenleri uygulandı |
| **6. Admin paneli** | admin/* + Recharts (§3.6/7, §3.7) | KPI kartları, tablo, şikayet paneli |
| **7. Cila** | kalan `rounded-none`/`border-black`/hard-shadow taraması, erişilebilirlik (AA kontrast), responsive (mobil 4 kolon) kontrolü | Brutalist sınıf kalmadı; lint temiz |

Her faz sonunda: `npm run lint` ve `npm run dev` ile görsel doğrulama (mockup PNG'leri ile yan yana).

---

## 5. Kapsam Dışı / Dikkat

- **Veri ve davranış değişmez:** Prisma şeması, `src/app/actions/*`, auth (cookie şeması),
  `middleware.ts` ve `page.tsx → *Client.tsx` akışı aynen korunur. Bu sadece sunum katmanı.
- Mockup'lardaki **örnek içerik/Google görselleri** kullanılmaz; gerçek veriler bağlanır.
- Mockup'lar Tailwind v3 CDN + MD3 token isimleri kullanıyor; UniBlock **Tailwind v4 +
  shadcn değişkenleri** kullanıyor. Token isimlerini birebir kopyalamak yerine §3.1'deki eşleme
  izlenir (aksi halde shadcn bileşenleriyle çakışır).
- İki ikon sistemi karıştırılmaz (lucide'de kalınması önerilir, §3.3).
- Turuncu vurgu **sınırlı** kullanılmalı (DESIGN.md: "used sparingly") — aktif durum, bildirim,
  yüksek-aksiyon butonları ("Katıl", "Oluştur"), anket ilerleme çubukları.

---

## 5.5 REVİZYON — Sayfa Layout İskeletleri (kritik)

> İlk turda yalnızca **renk/stil** değiştirildi; ancak mockup'lar **layout yapısını** da
> değiştiriyor. Bu yüzden sayfa "değişmemiş" görünüyordu. Aşağıdaki iskeletler `code.html`
> kaynaklarından birebir çıkarılmıştır ve **uygulanması zorunludur**.

### Ana sayfa / Feed (`universe_ana_sayfa/code.html`)
Üç kolonlu uygulama iskeleti (12-kolon grid):
1. **Hero bandı** (`bg-surface-container-low`, üstte): ortalanmış başlık "Kampüsünde Neler
   Oluyor?" + alt metin + `rounded-full` arama input'u + "Keşfet" butonu. Arka planda
   `radial-gradient` mavi nokta deseni (`opacity-10`).
2. **Sol kenar (col-span-3)** — "Sana Özel" kartı → **Kısayollar**: Takip Ettiğim Topluluklar
   (`/clubs`), Yaklaşan Etkinliklerim (`/events`), Kaydettiklerim (`/profile`).
3. **Orta (col-span-6)** — "Akış": dikey yığılı içerik kartları (avatar + kaynak + tarih,
   başlık, özet, beğeni/yorum). Tıklanınca detay `Sheet` açılır.
4. **Sağ kenar (col-span-3)** — "Aktif Anketler" widget'ı (radio seçenek + ghost "Oy Ver",
   turuncu vurgu) + "Popüler Topluluklar" listesi (dairesel baş harf rozeti + üye/puan + Katıl).

### Etkinlik Takvimi (`etkinlik_takvimi/code.html`)
Sol geniş kart (col-span-8/9): başlık + Aylık/Haftalık/Liste segment + kategori pill filtreleri
(`rounded-full`) + **ay grid takvimi** (renkli etkinlik etiketleri). Sağ (col-span-3/4): mini
takvim + "Yaklaşan Etkinlikler" (tarih kutusu + başlık + yer) + "Etkinlik Oluştur" butonu.

### Kulüp/Takım Detay (`bili_im_teknolojileri_kul_b_detay/code.html`)
Üstte kapak görseli + üzerine taşan dairesel avatar + isim + "Katıl". Sekmeler (Hakkında /
Etkinlikler). İki kolon: sol "Yönetim Kurulu" + sosyal; sağ "Hakkımızda" + "Yaklaşan/Geçmiş
Etkinlikler" grid'leri.

### Admin Paneli (`admin_y_netim_paneli/code.html`)
Sol sabit koyu/beyaz sidebar (Dashboard, Kulüpler, Etkinlikler, Şikayetler, Ayarlar, Çıkış) +
üst istatistik kartları + "Kulüpler Listesi" tablosu + "Son Kayıt Olan Öğrenciler" + sağda
"Bekleyen Şikayetler".

### Boş/Arama-sonuç-yok durumları (`universe_bo_ak_durumu`, `..._arama_sonucu_yok_durumu`)
Ortalanmış dairesel ikon (`bg-primary-fixed`) + başlık + açıklama + birincil buton.

---

## 6. Hızlı Başlangıç Checklist

- [x] `tasarım_detayları/` `.gitignore`'a eklendi
- [ ] `globals.css` token'ları (renk, radius, ambient gölge utility)
- [ ] `layout.tsx` font'u tek-Inter'e indirildi
- [ ] shadcn `button/card/input/badge` yeni stile alındı
- [ ] `Navbar` + `LandingClient` yenilendi
- [ ] login/register
- [ ] feed / clubs / teams
- [ ] detay + manage + events
- [ ] admin paneli + Recharts renkleri
- [ ] son tarama: `rounded-none` / `border-black border-2` / `shadow-[8px` kalmadı
