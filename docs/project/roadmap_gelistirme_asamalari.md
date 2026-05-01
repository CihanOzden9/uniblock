# UniBlock Geliştirme Aşaması Yol Haritası (Roadmap)

**Tarih:** 2026-05-01  
**Amaç:** Projeyi adım adım ayağa kaldırmak için geliştirme sürecini fazlara bölmek, her fazı modüler alt yapılara ayırmak ve uygulanabilir bir teslim planı oluşturmak.

---

## 1) Yol Haritası Yaklaşımı

Bu roadmap, UniBlock’u tek parçada geliştirmek yerine aşağıdaki prensiplerle ilerletir:

- **Faz bazlı ilerleme:** Her faz sonunda çalışan bir çıktı
- **Modüler mimari:** Her büyük parça içinde bağımsız modüller
- **Ölçülebilir teslimat:** Her modül için net “bitti” kriteri (DoD)
- **Risk azaltma:** Erken fazlarda temel riskleri (auth, RBAC, veri modeli) çözme

---

## 2) Büyük Parçalar (Fazlar)

1. **Faz 0 — Temel Hazırlık ve Mimari Omurga**
2. **Faz 1 — Kimlik, Yetki ve Kullanıcı Çekirdeği**
3. **Faz 2 — Ana Akış + Haberler + Etkileşim**
4. **Faz 3 — Etkinlik, Katılım ve Ölçümleme**
5. **Faz 4 — Mesajlaşma ve Bildirimler**
6. **Faz 5 — Dashboard, Performans ve Sponsorluk**
7. **Faz 6 — Operasyon, Güvenlik Sertleştirme ve Ölçekleme**

---

## 3) Fazların Modüler Kırılımı

## Faz 0 — Temel Hazırlık ve Mimari Omurga

### 0.1 Ürün/Domain Netleştirme Modülü
- Rol matrisi (Öğrenci, Kulüp, Proje Takımı, İşletme, Admin)
- Yetki matrisi (RBAC action listesi)
- Kritik kullanıcı senaryoları (happy path + edge case)

**Çıktı:** Onaylı rol/yetki dokümanı + akış listesi

### 0.2 Teknik Mimari Modülü
- Frontend: Next.js App Router + TS + Tailwind + shadcn/ui
- API sözleşme yaklaşımı (OpenAPI taslağı)
- Veri modeli taslağı (ERD + temel varlıklar)

**Çıktı:** Mimari karar kayıtları (ADR), ERD v1, API iskeleti

### 0.3 Proje Altyapı Modülü
- Monorepo/klasör standardı
- ESLint/Prettier/Husky/lint-staged
- Ortam değişkenleri ve config standardı

**Çıktı:** Çalışan proje iskeleti + kalite kuralları

### 0.4 CI/CD ve Branch Stratejisi Modülü
- Branch naming ve PR template
- GitHub Actions (lint + test + build)
- Preview deployment (staging)

**Çıktı:** İlk otomasyon pipeline’ı

---

## Faz 1 — Kimlik, Yetki ve Kullanıcı Çekirdeği

### 1.1 Auth Modülü
- Register / Login / Logout
- Password reset + token expiry
- 2FA (OTP) hazır altyapı

**Çıktı:** Uçtan uca auth akışı

### 1.2 RBAC Modülü
- Route guard
- Component permission layer
- Rol bazlı menü görünürlüğü

**Çıktı:** Yetkisiz erişim engellenmiş UI/route yapısı

### 1.3 Profil ve Hesap Modülü
- Profil görüntüleme/güncelleme
- İlgi alanı ve bölüm/fakülte bilgileri
- Hesap güvenlik ayarları

**Çıktı:** Kullanıcı çekirdek profil sistemi

---

## Faz 2 — Ana Akış + Haberler + Etkileşim

### 2.1 Feed Omurgası Modülü
- Ayrı bloklar: Haberler / Duyuru-Etkinlik / Topluluk-Proje
- Kart yapısı ve filtreleme altyapısı
- Pagination/sonsuz kaydırma

**Çıktı:** Rol bazlı çalışan feed v1

### 2.2 Haberler Modülü
- Kampüs + dünya gündemi kaynak modeli
- Kategori, kaynak, tarih, özet yapısı
- `/news` detay rotası

**Çıktı:** Haberler v1 (normalize içerik)

### 2.3 Kişiselleştirme Modülü
- Bölüm/fakülte + ilgi alanı eşleşme
- Davranış sinyali (okuma, tıklama, süre)
- “Senin için / Trend” sekmeleri

**Çıktı:** Kişiselleştirilmiş haber akışı v1

### 2.4 Etkileşim ve Moderasyon Modülü
- Beğeni / Yorum / Şikayet
- İçerik ihlal kategorileri
- Moderasyon kuyruğu (admin tarafı)

**Çıktı:** Etkileşim + moderasyon temel hattı

---

## Faz 3 — Etkinlik, Katılım ve Ölçümleme

### 3.1 Etkinlik Yönetimi Modülü
- Etkinlik oluşturma/düzenleme/yayınlama
- Etkinlik detay ve katılım ekranı
- Rol bazlı etkinlik izinleri

**Çıktı:** Etkinlik yaşam döngüsü v1

### 3.2 QR Katılım Doğrulama Modülü
- Check-in / check-out
- QR doğrulama kural setleri
- Katılım log kayıtları

**Çıktı:** Doğrulanabilir katılım verisi

### 3.3 Memnuniyet Anketi Modülü
- Etkinlik sonrası anket formu
- Puanlama modeli
- Raporlama çıktıları

**Çıktı:** Ölçülebilir memnuniyet metriği

### 3.4 Veri Kalitesi ve Anti-manipülasyon Modülü
- Sahte etkileşim kontrolleri
- Anomali kuralları
- Güven skoru katkısı

**Çıktı:** Temizlenmiş metrik hattı

---

## Faz 4 — Mesajlaşma ve Bildirimler

### 4.1 Mesajlaşma Çekirdeği Modülü
- 1-1 ve grup konuşmaları
- Kanal/oda modeli
- Temel mesaj geçmişi

**Çıktı:** Mesajlaşma v1

### 4.2 Gerçek Zamanlı Bildirim Modülü
- Yeni mesaj bildirimi
- Etkinlik hatırlatmaları
- Sponsorluk/süreç bildirimleri

**Çıktı:** Bildirim altyapısı v1

### 4.3 Mesaj Yetki ve Güvenlik Modülü
- Rol bazlı mesajlaşma kısıtları
- Spam/abuse önlemleri
- İçerik güvenlik kontrolleri

**Çıktı:** Güvenli iletişim katmanı

---

## Faz 5 — Dashboard, Performans ve Sponsorluk

### 5.1 Rol Bazlı Dashboard Modülü
- Öğrenci, Kulüp, İşletme panelleri
- KPI kartları + temel grafikler
- Zaman filtreleri

**Çıktı:** Dashboard v1

### 5.2 Performans Endeksi Modülü
- Formül:
  - Katılım (0.4)
  - Memnuniyet (0.3)
  - Etkileşim (0.2)
  - Süreklilik (0.1)
- Endeks hesaplama + sıralama

**Çıktı:** Endeks servisleri + rapor görünümü

### 5.3 Sponsorluk Eşleştirme Modülü
- Eşleşme skoru (kitle uyumu + etkileşim + lokasyon)
- Pipeline: teklif > değerlendirme > onay > raporlama
- İşletme geri bildirim ekranları

**Çıktı:** Sponsorluk yönetimi v1

---

## Faz 6 — Operasyon, Güvenlik Sertleştirme ve Ölçekleme

### 6.1 Güvenlik Sertleştirme Modülü
- CSRF/XSS güvenlik kontrolleri
- Rate limit ve kritik aksiyon doğrulamaları
- Güvenlik checklist release gate

**Çıktı:** Güvenlik denetiminden geçmiş sürüm

### 6.2 Test ve Kalite Genişletme Modülü
- Unit + Integration + E2E kapsam artırımı
- Kritik akış smoke test seti
- Hata izleme (Sentry) ve alarm kuralları

**Çıktı:** Kalite güvencesi seviyesi yükseltilmiş sürüm

### 6.3 Ölçekleme ve Çoklu Kampüs Modülü
- Tenant/campus ayrımı
- Performans optimizasyonu
- Raporlama ölçekleme

**Çıktı:** Multi-campus hazır mimari

---

## 4) Sıralı Uygulama Planı (Adım Adım Ayağa Kaldırma)

1. **Önce Faz 0 + Faz 1** tamamlanır (temel omurga + güvenli giriş/yetki)
2. Sonra **Faz 2** ile kullanıcıya değer üreten ana deneyim açılır
3. Ardından **Faz 3** ile etkinlik ve ölçümleme güvenilir hale getirilir
4. Sonraki adımda **Faz 4** ile platform etkileşimi güçlendirilir
5. **Faz 5** ile ticari/analitik değer artırılır
6. **Faz 6** ile kurumsal kalite ve ölçekleme tamamlanır

---

## 5) Her Faz İçin “Bitti” Kriterleri (DoD)

Her faz aşağıdaki minimum koşullarla tamamlanmış sayılır:

- İlgili modüller canlıya alınabilir seviyede çalışıyor
- Kritik akışlar test senaryolarından geçiyor
- Teknik dokümantasyon güncel
- Güvenlik ve loglama kontrolleri uygulanmış
- Faz çıktısı bir sonraki faz için bağımlılık üretmiyor (modüler geçiş)

---

## 6) Önceliklendirme ve Bağımlılık Haritası

- **Kritik bağımlılıklar:**
  - RBAC tamamlanmadan dashboard ve sponsorluk modülleri açılmamalı
  - Veri modeli netleşmeden kişiselleştirme skoru finalize edilmemeli
  - QR/anket verisi olmadan performans endeksi üretimi eksik kalır

- **Hızlı kazanım alanları (quick wins):**
  - Public anasayfa + Auth + Feed v1
  - Haberler sekmesi + temel kişiselleştirme
  - Dashboard v1 (KPI kartları)

---

## 7) Önerilen Sprint Dağılımı (Özet)

- **Sprint 1-2:** Faz 0
- **Sprint 3-4:** Faz 1
- **Sprint 5-7:** Faz 2
- **Sprint 8-9:** Faz 3
- **Sprint 10:** Faz 4
- **Sprint 11-12:** Faz 5
- **Sprint 13+:** Faz 6 (sertleştirme/ölçekleme)

> Not: Ekip büyüklüğüne göre sprint sayıları revize edilebilir; modül sınırları korunmalıdır.

---

## 8) Sonuç

Bu yol haritası ile UniBlock geliştirme süreci:
- Büyük parçalara ayrılmış,
- Her büyük parça modüler alt yapılara bölünmüş,
- Adım adım ayağa kaldırılabilecek net bir plana dönüştürülmüştür.

Bu yaklaşım, MVP’den kurumsal ölçeğe geçişte yeniden iş yapma maliyetini düşürür ve her aşamada ölçülebilir ilerleme sağlar.
