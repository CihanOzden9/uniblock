# UniBlock Faz 0 — Temel Hazırlık ve Mimari Omurga

## 0.1 Ürün/Domain Netleştirme

## 0.2 Teknik Mimari
- [ ] docs/arch/adr/001-frontend-stack.md oluştur
- [ ] docs/db/erd_v1.md oluştur (text-based ERD)
- [ ] docs/api/openapi_skeleton.yaml oluştur

## 0.3 Proje Altyapı
- [ ] Next.js projesi başlat: npx create-next-app
- [ ] shadcn/ui, TanStack Query, Zustand, React Hook Form, Zod yükle
- [ ] ESLint/Prettier/Husky/lint-staged kur
- [ ] .env.example, tsconfig tweaks
- [ ] src/app yapısı kur: (public), (protected), modules/, shared/

## 0.4 CI/CD
- [ ] .github/workflows/lint-test-build.yml oluştur
- [ ] docs/git_strategy.md oluştur (branch/PR templates)

# Önceki TODO (Demo - Tamamlandı)

- [x] Mevcut dokümanları gözden geçir (`docs/project/tech_stack_ve_frontend_onerisi.md`, `docs/project/proje_detaylari_guncel.md`)
- [x] Teknik detaylar dokümanını netleştir ve güncelle (`docs/project/tech_stack_ve_frontend_onerisi.md`)
- [x] Ürün/kapsam dokümanını netleştir ve güncelle (`docs/project/proje_detaylari_guncel.md`)
- [x] Son kontrol ve tutarlılık düzenlemeleri yap

## Demo Geliştirme (Landing + Auth + Öğrenci Akışı)

- [x] `demo/index.html` dosyasını landing (karşılama) sayfasına dönüştür
- [x] `demo/login.html` oluştur (demo login formu + girişte öğrenci sayfasına yönlendirme)
- [x] `demo/register.html` oluştur (demo kayıt formu + login’e yönlendirme)
- [x] `demo/ogrenci.html` oluştur (mevcut öğrenci ana sayfa/akış içeriğini taşı)
- [x] `demo/app.js` içinde login/register sayfa etkileşimlerini ekle
- [x] `demo/styles.css` içinde landing/auth stillerini ekle
- [x] Akışı doğrula: landing → giriş/üye ol → öğrenci ana sayfası

## Revizyonlar (Kullanıcı Geri Bildirimi)

- [ ] `demo/index.html` landing içeriğini tek ekrana sığacak şekilde sadeleştir
- [ ] `demo/ogrenci.html` içinde “Öneriler” bölümünü “Gelişmeler” olarak güncelle
- [ ] `demo/app.js` feed verisini kulüp/topluluk/etkinlik duyuruları odaklı yeniden düzenle
- [ ] `demo/styles.css` kart tasarımını yeni gelişmeler akışına göre güncelle
- [ ] Haberleri öğrenci feed’inden ayrıştır ve haber sayfasını bağımsız bırak
