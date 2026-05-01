# PORTFOLIO — FRONTEND TASARIM DETAYLARI

> Kaynak: `c:\Users\Cihan\Desktop\web\deneme 1\portfolio`  
> Oluşturulma: 2026-04-28  
> Framework: Next.js 14+ (App Router) + TypeScript + Framer Motion

---

## 1. GENEL TEMA & FELSEFE

- **Tema:** Minimalist, siyah-beyaz odaklı, tek vurgu renkli (yeşil)
- **Mod:** Sadece Light Mode (Dark mode yok)
- **Dil:** Türkçe arayüz
- **Tasarım dili:** Editorial / Typographic — büyük tipografi, ince çizgiler, grid sistemi
- **Hizalama:** Sol hizalı içerik, merkezi hero

---

## 2. RENK PALETİ

| Değişken         | Hex Kodu    | Kullanım Alanı                              |
|------------------|-------------|---------------------------------------------|
| `--accent`       | `#059669`   | Vurgu rengi (logo nokta, aktif nav, hover)  |
| `--black`        | `#000000`   | Ana metin, border, footer arka plan         |
| `--white`        | `#ffffff`   | Sayfa arka planı, kartlar                   |
| `--gray-100`     | `#f5f5f5`   | News section arka planı, skeleton           |
| `--gray-200`     | `#e5e5e5`   | İnce ayırıcı çizgiler (divider)             |
| `--gray-400`     | `#a3a3a3`   | İkincil meta metin, tarih, kaynak adı       |
| `--gray-600`     | `#525252`   | Paragraf metni, alt başlıklar               |

### Kategori Renkleri (News)
```
Teknoloji  → #059669  (yeşil)
Yazılım    → #000000  (siyah)
Sistem     → #525252  (gri)
Yapay_Zeka → #059669  (yeşil)
default    → #000000  (siyah)
```

---

## 3. TİPOGRAFİ

### Font Ailesi
| Font          | Weights               | Kullanım                              |
|---------------|-----------------------|---------------------------------------|
| **Inter**     | 300, 400, 500, 600, 700, 800, 900 | Body, nav, meta, buton, paragraf |
| **Montserrat**| 300, 400, 600, 700, 800, 900 | Tüm başlıklar (h1-h6), logo      |

**Import:** Google Fonts CDN  
`https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@300;400;600;700;800;900&display=swap`

### Body Varsayılanı
```css
font-family: 'Inter', sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### Başlık Varsayılanı
```css
font-family: 'Montserrat', sans-serif;
```

---

## 4. TIPOGRAFI ÖLÇEKLERİ (Component Bazlı)

### Hero Başlığı (H1)
```
font-family: Montserrat
font-size: clamp(72px, 14vw, 160px)
font-weight: 300 (ad) / 800 (soyad)
letter-spacing: -0.03em
line-height: 1.05
```

### Eyebrow / Section Label
```
font-family: Inter
font-size: 11px
font-weight: 600
letter-spacing: 0.25em
text-transform: uppercase
color: #059669
```

### Section H2 (About, Contact)
```
font-family: Montserrat
font-size: clamp(32px, 4vw, 56px)   -- About
font-size: clamp(40px, 6vw, 80px)   -- Contact, News Page
font-weight: 800
letter-spacing: -0.02em / -0.03em
line-height: 1.05 - 1.1
```

### News Section H2
```
font-size: clamp(28px, 4vw, 48px)
font-weight: 800
letter-spacing: -0.02em
```

### Paragraf / Body
```
font-family: Inter
font-size: 16px
font-weight: 400
line-height: 1.8 - 1.9
color: #525252
```

### Küçük Meta Metin
```
font-size: 10px - 11px
letter-spacing: 0.1em - 0.2em
text-transform: uppercase
color: #a3a3a3
```

### Buton Metni
```
font-size: 12px
font-weight: 600
letter-spacing: 0.15em
text-transform: uppercase
```

### Nav Linkleri
```
font-size: 13px
font-weight: 500
letter-spacing: 0.05em
text-transform: uppercase
```

### Logo
```
font-family: Montserrat
font-weight: 800
font-size: 18px
letter-spacing: -0.5px
format: c[yeşil nokta]özden
```

---

## 5. BUTON STİLLERİ

### Primary Button (Filled / Siyah)
```css
padding: 14px 36px
background-color: #000000
color: #ffffff
border: 1px solid #000000
font-size: 12px
font-weight: 600
letter-spacing: 0.15em
text-transform: uppercase
transition: background-color 0.2s, color 0.2s

hover:
  background-color: #059669
  border-color: #059669
```

### Secondary Button (Outline)
```css
padding: 14px 36px
background-color: transparent
color: #000000
border: 1px solid #000000
(aynı tipografi)

hover:
  border-color: #059669
  color: #059669
```

### Accent Outline Button (Yeşil border)
```css
border: 1px solid #059669
color: #059669
padding: 10px 20px

hover:
  background-color: #059669
  color: #ffffff
```

### Mobile Hamburger Button
```css
border: 1px solid #000000
padding: 6px 10px
font-weight: 700
font-size: 11px
letter-spacing: 0.1em
text-transform: uppercase
label: "MENÜ" / "KAPAT"
```

---

## 6. KART STİLLERİ

### News Card (Ana Sayfa)
```css
background-color: #ffffff
padding: 32px
min-height: 240px
display: flex / flex-direction: column / justify-content: space-between
transition: background-color 0.2s

hover: background-color → #f5f5f5

İçerik:
  - Üst meta: kategori dot (6x6px kare) + kategori adı + tarih
  - Divider: 1px solid #e5e5e5
  - H3: Montserrat 700, 15px, #000000, letter-spacing: -0.01em
  - Paragraf: Inter 13px, #525252, line-height: 1.7
  - Alt meta: kaynak adı (sol) + "Oku →" yeşil (sağ)
```

### News Card (News Page — Tam Sayfa)
```css
background-color: #ffffff
padding: 32px
height: 380px  ← sabit yükseklik
display: flex / flex-direction: column
transition: background-color 0.2s

hover: background-color → #f9f9f9

İçerik:
  - H2: Montserrat 700, 16px, WebkitLineClamp: 3
  - Paragraf: Inter 13px, WebkitLineClamp: 5
```

### Contact Card
```css
padding: 48px 40px
background-color: #ffffff
display: flex / flex-direction: column

hover → tüm içerik #059669'a geçer (icon, label, title, description, arrow)
transition: 0.25s ease

İçerik:
  - SVG icon: 28x28px
  - Label: Inter 10px, 600, uppercase, letter-spacing: 0.2em
  - Value (H3): Montserrat 700, 18px, letter-spacing: -0.01em
  - Description: Inter 13px, line-height: 1.6
  - Alt: 1px çizgi + → ok
```

### Skill Card (About)
```css
padding: 20px 16px
background-color: #ffffff
border-right: 1px solid #e5e5e5
border-bottom: 1px solid #e5e5e5
transition: border-color 0.2s

hover: border-color → #059669

İçerik:
  - Emoji icon: 20px, display: block, margin-bottom: 8px
  - Label: Inter 600, 12px → hover: #059669
  - Category: Inter 10px, uppercase, letter-spacing: 0.1em, #a3a3a3
```

---

## 7. GRİD SİSTEMİ

### Genel Container
```css
max-width: 1200px
margin: 0 auto
padding: 0 32px
```

### Section Padding
```css
padding: 160px 32px  ← About, Projects, Contact
padding: 160px 0     ← News (full-width bg, içi 32px)
padding: 80px 32px   ← News Page içeriği
```

### News Grid (3 Kolon)
```css
display: grid
grid-template-columns: repeat(3, 1fr)
gap: 1px                     ← çizgi etkisi
background-color: #000000    ← gap rengi = siyah çizgi görünümü
border: 1px solid #000000

Responsive:
  @1024px → 2 kolon
  @640px  → 1 kolon
```

### Contact Grid (3 Kolon)
```css
display: grid
grid-template-columns: repeat(3, 1fr)
gap: 1px
background-color: #000000
border: 1px solid #000000

Responsive:
  @768px → 1 kolon
```

### About Grid (Asimetrik)
```css
display: grid
grid-template-columns: 5fr 7fr
gap: 80px
align-items: start

Responsive:
  @768px → 1 kolon, gap: 40px
```

### Skill Grid (3 Kolon)
```css
display: grid
grid-template-columns: repeat(3, 1fr)
gap: 1px
border: 1px solid #000000
```

### Projects List (Tek Kolon)
```css
display: grid
grid-template-columns: 80px 1fr auto
gap: 40px
align-items: center
padding: 32px 0
border-bottom: 1px solid

hover: border-color → #059669
```

### Source Filter (News Page)
```css
display: grid
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))
gap: 1px
background-color: #000000
border: 1px solid #000000

Active tab: background: #000000, color: #ffffff
Inactive tab: background: #ffffff, color: #000000
```

---

## 8. ANİMASYON & GEÇİŞLER

### Kütüphane
**Framer Motion** (`framer-motion`)

### Hero Giriş Animasyonu (Staggered)
```js
eyebrow:    { opacity: 0→1, y: 20→0 }, delay: 0.1, duration: 0.6
ad:         { opacity: 0→1, y: 20→0 }, delay: 0.2, duration: 0.8
soyad:      { opacity: 0→1, y: 20→0 }, delay: 0.4, duration: 0.8
alt metin:  { opacity: 0→1, y: 20→0 }, delay: 0.6, duration: 0.8
butonlar:   { opacity: 0→1, y: 20→0 }, delay: 0.8, duration: 0.8
scroll ind: { opacity: 0→1 },          delay: 1.4, duration: 0.8
```

### Scroll Indicator (Hero)
```js
animate: { y: [0, 8, 0] }
duration: 1.5, repeat: Infinity, ease: 'easeInOut'
Görünüm: 1px genişlik, 40px yükseklik, siyah çizgi
```

### whileInView Animasyonları (Section)
```js
initial: { opacity: 0, y: 40 }  -- section level
initial: { opacity: 0, x: -20 } -- project items
initial: { opacity: 0 }          -- news cards

viewport: { once: false, margin: '-100px' }
```

### Nav Underline Animasyonu
```js
layoutId="nav-underline"
type: 'spring', stiffness: 400, damping: 30
Görünüm: 2px yükseklik, #059669 renk
```

### Mobile Menu Animasyonu
```js
initial: { height: 0, opacity: 0 }
animate: { height: 'auto', opacity: 1 }
exit:    { height: 0, opacity: 0 }
duration: 0.3
```

### Availability Pulse (Contact)
```js
animate: { scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }
duration: 2, repeat: Infinity
Görünüm: 8px daire, #059669
```

### Hover Geçişleri (Genel)
```css
transition: color 0.2s ease
transition: background-color 0.2s
transition: border-color 0.2s
transition: all 0.25s ease  -- Contact card
transition: filter 500ms ease -- Profil fotoğrafı
```

### Project Arrow Animasyonu
```js
animate: { x: hovered ? 4 : 0 }
duration: 0.2
```

---

## 9. NAVBAR

```
Position: fixed (Ana sayfa) / sticky (News page)
Height: 64px
Background: #ffffff
Border-bottom: 1px solid transparent → 1px solid #000000 (scroll sonrası)
z-index: 100
max-width: 1200px içinde
```

**Aktif nav item:**
- color: #059669
- Alt underline: 2px yükseklik, #059669, spring animasyon

**Scroll davranışı:**
- `window.scrollY > 20` → border aktif
- Her section'ın `offsetTop - 120` ile aktif sekme belirlenir

---

## 10. HERO SECTİON

```
min-height: 100vh
padding-top: 64px (navbar yüksekliği)
text-align: center
max-width: 900px içerik

Arka plan: Grid çizgiler
  linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)
  linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
  background-size: 60px 60px

Alt scroll indicator:
  position: absolute, bottom: 40px
  "SCROLL" yazısı (10px, uppercase, #a3a3a3)
  + animasyonlu ince çizgi
```

---

## 11. ABOUT SECTİON

```
Fotoğraf kartı:
  - aspect-ratio: 3/4
  - border: 1px solid #000000
  - overflow: hidden
  - Hover → grayscale kaldırılır (500ms ease)
  - Hover → alt bar: #059669 arka plan, beyaz metin, translateY animasyonu
  - Varsayılan: grayscale(%100)

Section label formatı: "01 — Hakkımda"
Divider: flex: 1, height: 1px, #e5e5e5
```

---

## 12. PROJECTS SECTİON

```
Liste formatı (kart değil, satır)
Her satır: [numara] [içerik] [yıl + ok]

Numara: Montserrat 300, 13px, #a3a3a3 → hover: #059669
Title: Montserrat 700, clamp(18px, 2.5vw, 28px) → hover: #059669
Status badge:
  Canlı       → background: #059669
  Geliştiriliyor → background: #000000
  Tamamlandı  → background: #525252
  Tümü white text, 10px, 600, uppercase, padding: 3px 8px

Tech badge:
  border: 1px solid #000000
  color: #000000
  padding: 4px 10px
  Inter, 10px, 600, uppercase
```

---

## 13. NEWS SECTİON (Ana Sayfa)

```
Arka plan: #f5f5f5
Kategori dot: 6x6px kare (border-radius yok)
Grid separator rengi: siyah (gap: 1px, bg: #000000)
"Daha Fazla →" linki: yeşil border, hover fill yeşil
```

---

## 14. FOOTER

```
Background: #000000
border-top: 1px solid #000000
padding: 48px 32px

Logo: Montserrat 800, 16px, #ffffff
      nokta: #059669
Tagline: Inter 11px, #525252

Nav linkler: Inter 11px, 500, uppercase, #525252
             hover → #059669

Copyright: Inter 11px, #525252
```

---

## 15. SCROLLBAR

```css
::-webkit-scrollbar         { width: 4px }
::-webkit-scrollbar-track   { background: #ffffff }
::-webkit-scrollbar-thumb   { background: #000000 }
::-webkit-scrollbar-thumb:hover { background: #059669 }
```

---

## 16. TEXT SEÇİMİ

```css
::selection {
  background-color: #059669;
  color: #ffffff;
}
```

---

## 17. SAYFA YAPISI (Bileşen Sırası)

```
/  (Ana Sayfa)
├── Navbar
├── HeroSection     (id="hero")
├── AboutSection    (id="about",    01 — Hakkımda)
├── ProjectsSection (id="projects", 02 — Projeler)
├── NewsSection     (id="news",     03 — Gündem)
├── ContactSection  (id="contact",  04 — İletişim)
└── Footer

/news  (Haberler Sayfası)
├── Navbar (inline, sticky)
├── Header (H1 + Arama)
├── Source Filter Grid
├── News Grid (tüm haberler, 380px yükseklik)
└── (Footer yok)
```

---

## 18. RESPONSIVE BREAKPOINTS

| Breakpoint | Değişiklik                                      |
|------------|-------------------------------------------------|
| `≤1024px`  | News grid: 3→2 kolon, nav mobile'a geçer       |
| `≤768px`   | About grid: 2→1 kolon, Contact grid: 3→1 kolon |
| `≤640px`   | News grid: 2→1 kolon                           |

---

## 19. ÖZEL TASARIM DETAYLARI

- **Bölüm ayırıcısı:** `flex: 1, height: 1px, background: #e5e5e5` — section label'dan sonra tam genişliğe uzanır
- **Grid çizgi efekti:** Kartlar arası `gap: 1px`, container `background: #000000` ile siyah ince çizgi görünümü
- **Eyebrow numaralandırma:** `01 —`, `02 —`, `03 —`, `04 —` formatı
- **Accent kullanımı:** Logo'da yalnızca nokta (`.`), soyad, aktif nav item, hover state, vurgu metni
- **Görsel filtre:** Profil fotoğrafı varsayılan `grayscale(100%)`, hover'da `grayscale(0%)`
- **Smooth scroll:** `html { scroll-behavior: smooth }` + JS `scrollIntoView({ behavior: 'smooth' })`
- **overflow-x: hidden** — yatay kaymayı engeller

---

## 20. KULLANILAN PAKETLER (Tasarım İlgili)

```json
"framer-motion": animasyon kütüphanesi
"next/image": optimize edilmiş görsel bileşeni
"next/link": client-side navigasyon
```

---

## 21. SEO META

```
title: "Cihan Özden — Yazılım Mühendisi & Dijital Journal"
description: "Yazılım geliştirici Cihan Özden'in kişisel portföyü..."
keywords: Cihan Özden, yazılım mühendisi, Django, React, portföy, dijital journal
lang: tr
OG title/description: mevcut
```
