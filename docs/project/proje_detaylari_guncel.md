# UniBlock Projesi  
## Üniversite Topluluk Ekosistemi Dijital Dönüşüm Dokümanı

**Sürüm:** 1.0  
**Tarih:** 2026-04-28  
**Hazırlayan:** UniBlock Proje Ekibi

---

## 1. Yönetici Özeti

UniBlock, üniversite içindeki kulüp/topluluk, öğrenci, proje takımı ve işletme etkileşimini tek bir dijital platformda birleştiren; veri odaklı, ölçülebilir ve sürdürülebilir bir kampüs ekosistemi çözümüdür.  
Bu doküman, mevcut proje kapsamını profesyonel bir yapıda tanımlar; eksikleri kapatmaya yönelik uygulanabilir geliştirme planını ve kurumsal olgunluk seviyesine geçiş adımlarını içerir.

---

## 2. Projenin Amacı ve Stratejik Hedefler

### 2.1 Amaç
- Öğrenci katılımını artırmak
- Etkinlik görünürlüğünü yükseltmek
- Topluluk yönetimini veriyle güçlendirmek
- Üniversite-öğrenci-işletme arasında sürdürülebilir değer ağı oluşturmak

### 2.2 Stratejik Değer Önerileri
1. **Merkezi Duyuru Yönetimi**  
   Etkinlik ve duyuruların tekil akışta toplanmasıyla bilgi kirliliğinin azaltılması.
2. **Veri Odaklı Performans Analizi**  
   Kulüp/topluluk etkisinin objektif metriklerle ölçülmesi.
3. **Sponsor ve İş Birliği Ekosistemi**  
   Başarılı toplulukların uygun işletmelerle eşleştirilmesi.
4. **Yetenek ve Proje Ağı**  
   Disiplinlerarası takım kurulumunu ve proje üretimini teşvik eden yapı.

---

## 3. Kullanıcı Rolleri ve Temel Yetkinlikler

## 3.1 Öğrenci
- Akış içeriklerini görüntüleme
- Beğeni/yorum/şikayet aksiyonları
- Kulüp/takım ile mesajlaşma
- Etkinliğe katılma, oylama, puanlama
- Profil yönetimi
- Haber tercihlerini yönetme (ilgi alanı, kategori, başlık yoğunluğu)

## 3.2 Kulüp/Topluluk
- Yönetim kadrosu oluşturma
- Etkinlik ve duyuru paylaşımı
- Üye yönetimi
- Memnuniyet anketi yayınlama
- Dashboard ve etkileşim analizi

## 3.3 Proje Takımı
- Proje duyuruları
- Ekip üyesi ekleme/çıkarma
- Ekip iletişimi ve profil yönetimi
- Proje bazlı etkileşim takibi

## 3.4 İşletme
- Reklam/kampanya yayınlama
- Topluluk sponsorluk süreçlerine katılma
- Etkileşim ve dönüşüm istatistiklerini takip etme

---

## 4. Ürün Kapsamı (Neler Yapılacak?)

Bu bölüm teknik implementasyon detayından bağımsız olarak ürünün kullanıcıya nasıl görüneceğini ve ana akışta nelerin olacağını tanımlar.

## 4.1 Public Anasayfa (İlk Karşılama)

- Siteye ilk girişte herkese açık bir **anasayfa** gösterilir.
- Bu sayfa, projeyi ilk kez gören birinin kısa sürede fikir sahibi olmasını sağlar.
- İçerik:
  - UniBlock nedir?
  - Kimler için? (öğrenci, kulüp, proje takımı, işletme)
  - Hangi problemleri çözer?
  - Temel modüller (akış, haberler, etkinlikler, mesajlaşma, dashboard)

## 4.2 Yönlendirme: Giriş Yap / Üye Ol

- Public anasayfadan iki net aksiyon sunulur:
  - **Giriş Yap**
  - **Üye Ol**
- Üyelikte rol bazlı kayıt deneyimi korunur.
- Auth sonrası kullanıcı, rolüne uygun ana akış deneyimine alınır.

## 4.3 Ana Akış (Feed) – Net Ayrıştırılmış Yapı

Ana akış tek bir sayfada karışık içerik yerine bölümlenmiş bir yapıda sunulur:

1. **Haberler**
2. **Duyurular ve Etkinlikler**
3. **Topluluk/Proje İçerikleri**

Bu ayrımın amacı, kullanıcıya “ne nerede” netliği sağlamak ve içerik keşfini hızlandırmaktır.

## 4.4 Haberler Kapsamı (Kampüs + Dünya Gündemi)

- Haberler sadece kampüs içi içerikle sınırlı değildir.
- İki temel kaynak birlikte sunulur:
  - Dünya gündemi
  - Kampüs/üniversite gündemi
- Kullanıcıya farklı sekmeler/bloklar ile anlaşılır bir haber deneyimi sağlanır.

## 4.5 Bölüme Göre Kişiselleştirilmiş Haber Akışı

- Haber listeleri öğrencinin bölüm/fakülte bilgisine göre şekillenir.
- Kişiselleştirme girdileri:
  - Bölüm/fakülte
  - İlgi alanları
  - Geçmiş etkileşim davranışları
- Kullanıcı, haber tercihlerini sonradan güncelleyebilir (kategori aç/kapat vb.).

## 4.6 Diğer Temel Modüller

- Mesajlaşma
- Etkinlik Yönetimi
- Profil Yönetimi
- Dashboard / İstatistik
- Sponsorluk ve Eşleştirme
- Performans Endeksi Hesaplama

**Performans Formülü:**

\[
Performans = (Katılım \times 0.4) + (Memnuniyet \times 0.3) + (Etkileşim \times 0.2) + (Süreklilik \times 0.1)
\]

---

## 5. Tespit Edilen Eksikler ve Kapatma Planı

## 5.1 Kimlik Doğrulama ve Güvenlik
**Eksik:**
- 2FA teknik akış detayları
- Şifre sıfırlama/hesap kurtarma
- Rol bazlı yetki matrisi (RBAC) net değil

**Yapılacaklar:**
1. Auth servisinde OTP tabanlı 2FA akışının tanımlanması
2. Password reset + token süre yönetimi
3. RBAC tablosu (rol-eylem matrisi) ve middleware kuralları

## 5.2 Ana Akış, Haberler ve Moderasyon
**Eksik:**
- Kişiselleştirilmiş akış algoritması detaysız
- Şikayet/moderasyon süreci tanımsız
- Haber içerik kaynak yönetimi ve güven skoru modeli net değil
- Haber başlık/özet özelleştirme tercihleri için kullanıcı ayar akışı tanımlı değil

**Yapılacaklar:**
1. Akış skorlama parametrelerinin belirlenmesi (bölüm, ilgi alanı, üyelik, etkileşim)
2. İçerik ihlal kategorileri + moderasyon SLA tanımı
3. Admin panelde içerik inceleme ekranı
4. Haberler modülü için kişiselleştirme modeli (kayıt bilgisi + davranış sinyalleri + trend)
5. Kullanıcı tercih ekranı (kategori seçimi, görmek istemediklerini kapatma, başlık yoğunluğu modu)
6. Haber kaynak güven skoru ve içerik doğrulama kuralları

## 5.3 Etkinlik ve Ölçümleme
**Eksik:**
- QR katılım doğrulama uçtan uca süreç net değil
- Memnuniyet anket veri modeli eksik
- Manipülasyon önleyici kontrol kuralları tanımsız

**Yapılacaklar:**
1. Etkinlik check-in/check-out QR doğrulama akışı
2. Anket soruları, puanlama ve raporlama modeli
3. Sahte etkileşim tespiti için doğrulama kuralları

## 5.4 Sponsor Eşleştirme
**Eksik:**
- Eşleşme kriterleri ve süreç adımları eksik
- Teklif/onay/raporlama yaşam döngüsü yok

**Yapılacaklar:**
1. Sponsor eşleşme skoru (kitle uyumu + etkileşim + lokasyon)
2. Sponsorluk pipeline: teklif > değerlendirme > onay > raporlama
3. İşletme paneline performans geri bildirimi

## 5.5 Teknik Dokümantasyon
**Eksik:**
- Sistem mimarisi
- API sözleşmesi
- Veritabanı şeması
- Test stratejisi
- Dağıtım/operasyon rehberi

**Yapılacaklar:**
1. C4-L1/L2 mimari dokümanları
2. OpenAPI (Swagger) sözleşmesi
3. ER diyagram + migration planı
4. Test piramidi (unit/integration/e2e) planı
5. CI/CD ve ortam yönetimi dokümantasyonu

---

## 6. Yol Haritası (Roadmap)

## Faz 1 – Temel Platform (MVP)
- Auth + rol bazlı kayıt/giriş
- Ana akış + temel etkileşim
- Haberler sayfası v1 (kategori kartları + ilgi alanı/bölüm bazlı kişiselleştirme)
- Kulüp/öğrenci/proje takımı/işletme profil ekranları
- Etkinlik oluşturma ve katılım

## Faz 2 – Ölçümleme ve Kalite
- QR katılım doğrulama
- Memnuniyet anketleri
- Dashboard v1
- Moderasyon altyapısı

## Faz 3 – Akıllı Sistemler
- Kişiselleştirilmiş akış
- Sponsor eşleştirme motoru
- Performans endeksi yayınlama ve sıralama

## Faz 4 – Ölçekleme
- Gelişmiş analitik
- Kurumsal raporlama
- Çoklu kampüs desteği

---

## 7. Dosya Yapısı Standardizasyonu (Uygulandı)

Proje dokümantasyon varlıkları aşağıdaki profesyonel yapıya taşınmıştır:

```text
docs/
  project/
    proje_detaylari.pdf
    proje_detaylari_guncel.md
  flows/
    auth/
      login/
        flow.drawio
      register/
        flow.drawio
    roles/
      ogrenci/
        flow.drawio
        flow.html
      kulup/
        flow.drawio
        flow.html
      isletme/
        flow.drawio
        flow.html
      proje_takimi/
        flow.drawio
  notes/
    eksikler.txt
```

---

## 8. Kalite, Test ve Operasyon Standartları

- Kod ve doküman adlandırma standardı (ASCII/snake_case)
- Her sürümde güncellenen değişiklik günlüğü
- Test raporu zorunluluğu (minimum critical-path)
- Yayın öncesi güvenlik kontrol listesi
- Performans KPI takibi (aktif kullanıcı, etkinlik katılım oranı, etkileşim oranı)

---

## 9. Sonuç

UniBlock projesi, kampüs ekosistemini dijitalleştirmek için güçlü bir iş vizyonuna sahiptir.  
Bu güncel dokümanla birlikte proje; kapsam, eksik kapatma planı, yol haritası ve doküman organizasyonu açısından profesyonel ve uygulanabilir bir çerçeveye taşınmıştır.
