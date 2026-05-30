# 🎓 UniBlock — Üniversite Kulüp, Etkinlik ve Topluluk Yönetim Platformu

UniBlock, üniversite kulüpleri, yarışma/proje **takımları**, öğrenci toplulukları, etkinlikler, anketler ve öğrenci etkileşimlerini tek bir çatı altında toplayan modern, esnek ve yüksek performanslı bir kampüs sosyal ağ platformudur.

---

## 🚀 Özellikler

* **Hızlı Kayıt ve Otomatik Giriş (Instant Activation & Auto-Login):** Kayıt olan tüm öğrenci ve kulüpler doğrudan `ACTIVE` durumuna alınır. Yönetici onay kuyruğunda bekleme zorunluluğu yoktur; kayıt işlemi tamamlandığı an çerezler yazılarak otomatik olarak sisteme giriş yapılır ve kullanıcı kendi rolünün paneline yönlendirilir.
* **Etkinlik ve Duyuru Yönetimi:** Kulüp yöneticileri duyuru (gönderi) yayınlayabilir, etkinlikler oluşturabilir ve etkinlikler iptal edildiğinde kulüp üyelerine otomatik bildirim yollayabilir.
* **Takım Yönetimi (Teams):** Kulüplere paralel, tam özellikli takım yapısı. Takımların kendi üyelikleri (katılım/onay akışıyla), gönderileri, etkinlikleri, anketleri, yönetim kadrosu, ayarları ve şikâyet moderasyonu bulunur. Kayıt formundaki **Takım** sekmesinden `TEAM_ADMIN` (kaptan) olarak kayıt olunur. _Not: Takımlar performans skoru/liderlik tablosuna dâhil değildir._
* **İnteraktif Anketler (Surveys):** Kulüpler anket oluşturabilir, öğrenciler oylamaya katılarak anket sonuçlarını anlık yüzdelerle görebilirler.
* **Gelişmiş Yönetici Paneli (Admin Dashboard):**
  * **Kullanıcı Yönetimi:** Kayıtlı öğrencilerin ve kulüp başkanlarının listelenmesi, rollerinin güncellenmesi veya engellenmesi.
  * **Şikâyet (Moderatör) Yönetimi:** Şikâyet edilen gönderilerin ve yorumların incelenmesi, onaylanması veya tek tıkla platformdan kaldırılması.
  * **Fakülte & Bölüm Yönetimi:** Dinamik kayıt formu için fakülte ve bölümlerin tanımlanması.
  * **Etkinlik Moderasyonu:** Tüm etkinliklerin listelenmesi ve gerektiğinde iptal edilmesi.
* **Liderlik Tablosu (Leaderboard):** Kulüplerin performans skorlarına göre anlık sıralamalarının listelendiği liderlik tablosu.

---

## 🛠️ Teknoloji Yığını

| Katman | Kullanılan Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) | Modern React framework'ü ve hızlı derleme altyapısı. |
| **Dil** | TypeScript | Güvenli tip kontrolü. |
| **ORM** | Prisma ORM 6 | PostgreSQL ile esnek ve güvenli veritabanı etkileşimi. |
| **Veritabanı** | PostgreSQL | İlişkisel veritabanı sistemi. |
| **Arayüz (UI)** | Tailwind CSS + shadcn/ui | Modern, minimalist ve özelleştirilebilir tasarım. |
| **İkonlar** | Lucide React | Modern vektörel ikon kütüphanesi. |
| **Bildirimler** | Sonner | Kullanıcı dostu toast bildirimler. |
| **Durum Yönetimi** | Zustand | Hafif ve performanslı istemci tarafı durum yönetimi. |

---

## 💻 Kurulum ve Çalıştırma

### Gereksinimler
* **Node.js** v20 veya üzeri
* **npm** v10 veya üzeri
* **PostgreSQL** v14 veya üzeri

### 1. Bağımlılıkları Yükleme
```bash
# Proje ana dizinindeyken
cd uniblock
npm install
```

### 2. Çevre Değişkenleri (.env)
Proje ana dizinindeki `.env` dosyasını oluşturun veya güncelleyin:
```env
DATABASE_URL="postgresql://kullanici_adi:sifre@localhost:5432/uniblock?schema=public"
```

### 3. Veritabanını Yapılandırma ve Çalıştırma
```bash
# Prisma şemasını veritabanına uygulayın
npx prisma db push

# Prisma Client istemcisini oluşturun
npx prisma generate
```

### 4. Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```
Uygulama varsayılan olarak **[http://localhost:3000](http://localhost:3000)** adresinde çalışacaktır.

---

## 🔑 Kullanıcı Rolleri ve Yetkiler

| Rol | Yetki Seviyesi | Açıklama |
| :--- | :--- | :--- |
| `SUPER_ADMIN` | En Üst Yetki | Sistemdeki tüm şikayetleri, kullanıcıları, kulüpleri ve ayarları yönetebilir. |
| `ADMIN` | Orta Yetki | Kullanıcı, şikayet ve içerik moderasyonu yapabilir. |
| `CLUB_ADMIN` | Kulüp Yetkisi | Yönettiği kulüp adına gönderi, anket, etkinlik oluşturabilir ve kulüp ayarlarını düzenleyebilir. |
| `TEAM_ADMIN` | Takım Yetkisi | Yönettiği takım (kaptan) adına gönderi, anket, etkinlik oluşturabilir, üye ve yönetim kadrosunu yönetebilir, takım ayarlarını düzenleyebilir. |
| `STUDENT` | Öğrenci Yetkisi | Topluluk akışını takip edebilir, gönderileri beğenebilir, yorum yapabilir ve anketlerde oy kullanabilir. |

### Varsayılan Admin Hesapları (Giriş Bilgileri):
* **Süper Yönetici:** `admin@admin.com` / Şifre: `admin`
* **Geliştirici Yönetici:** `cihan@uniblock.com` / Şifre: `000000`

---

## 📂 Proje Yapısı

```text
uniblock/
├── prisma/                  # Veritabanı şeması ve konfigürasyonu
│   └── schema.prisma        # Prisma veri modelleri
├── public/                  # Statik dosyalar ve görseller
├── src/
│   ├── app/                 # Next.js App Router sayfaları
│   │   ├── (protected)/     # Giriş yapmış kullanıcıların eriştiği rotalar (feed, profile, clubs/manage, teams/manage)
│   │   ├── (public)/        # Genel erişime açık sayfalar (login, register)
│   │   ├── actions/         # Server Actions (Sunucu eylemleri: auth, admin, club, team, vb.)
│   │   ├── admin/           # Yönetici paneli alt sayfaları
│   │   └── page.tsx         # Giriş yönlendirmeleri yapan ana sayfa
│   ├── components/          # Ortak ve yeniden kullanılabilir arayüz bileşenleri (Navbar, Sidebar, ui/)
│   └── lib/                 # Veritabanı istemcisi (prisma) ve oturum yardımcıları
```

---

## 🛡️ Kimlik Doğrulama & Çerez Yapılandırması

* **Yerel HTTP Test Desteği:** `production` modunda dahi tarayıcıların yerel HTTP (`localhost` veya yerel ağ IP'si) isteklerinde çerezleri reddetmemesi için `secure` parametresi `false` olarak ayarlanmıştır.
* **Middleware Koruması:** Rotalar `middleware.ts` üzerinden kontrol edilerek yetkisiz veya oturum açmamış kullanıcıların korumalı sayfalara erişimi engellenir.
