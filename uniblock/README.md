# UniBlock

Üniversite kulüpleri, etkinlikler ve öğrenci topluluğu için geliştirilmiş platform.

## Gereksinimler

- **Node.js** v20+
- **npm** v10+
- **PostgreSQL** v14+

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Ortam değişkenlerini ayarla
cp .env.example .env.local
# .env.local dosyasını düzenle: DATABASE_URL, vb.

# Veritabanı şemasını uygula
npx prisma db push

# Prisma istemcisini oluştur
npx prisma generate

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışır.

## Ortam Değişkenleri

`.env.local` dosyasında aşağıdaki değişkenler tanımlanmalıdır:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/uniblock"
```

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript |
| ORM | Prisma 6 |
| Veritabanı | PostgreSQL |
| UI | Tailwind CSS + shadcn/ui |
| Bildirimler | Sonner |

## Roller

| Rol | Açıklama |
|---|---|
| `STUDENT` | Standart öğrenci |
| `CLUB_ADMIN` | Kulüp yöneticisi |
| `ADMIN` | Sistem yöneticisi |
| `PROJECT_ADMIN` | Proje ekibi yöneticisi |
| `SUPER_ADMIN` | Tam yetkili süper admin |

## Geliştirme Komutları

```bash
npm run dev        # Geliştirme sunucusu
npm run build      # Prodüksiyon build
npm run lint       # ESLint kontrolü
npx prisma studio  # Veritabanı arayüzü
npx prisma db push # Şema değişikliklerini uygula
```
