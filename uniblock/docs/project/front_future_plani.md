# Front_future Geliştirme Planı

Kaynak: repo kökündeki `Front_future` dosyası (elle yazılmış istek listesi).
Bu belge o isteklerin parçalara ayrılmış, fazlanmış ve netleştirilmiş hâlidir.

> **Çalışma kuralı:** Kullanıcı yeni özellik/düzeltme bildirdikçe bu plana eklenecek.
> **Geliştirme sırası:** `1 → 2 → 3 → 5 → 7 → 6 → 4 → 3.5(RSS)`
> **Durak:** İlk 3 faz (1-2-3) bitince test için DURULACAK.

---

## Netleştirilen belirsizlikler
1. **Haberler** = kulüp paylaşımı değil; **harici RSS** linkleriyle çekilen, öğrencinin
   **bölümüne/fakültesine göre** filtrelenen haber akışı. (→ Faz 3.5, en sonda.)
2. **"Takip Ettiklerim"** = Kulüpler ve Takımlar sayfalarında **sekme** (ayrı sayfa/param değil).
   Etkinlikler sayfasındaki **"Üyeliklerim" sekmesi kaldırılacak**; işlevi bu sekmeye taşınıyor.
3. İçerik tipleri: **NEWS (Haber) kaldırılır**; kulüp/takım yalnızca **Duyuru** ve **Etkinlik** paylaşır.
   Görsel/video şimdilik gerekmiyor.

---

## Faz 1 — İçerik Modeli & Composer (temel)
- `PostType`: `NEWS` UI'dan kaldırılır; kulüp/takım paylaşımı **Duyuru (ANNOUNCEMENT)** olur.
- Composer (yönetim paneli Sheet) iki moda ayrılır:
  - **Duyuru:** başlık + mesaj.
  - **Etkinlik:** başlık + açıklama + **yer + tarih + saat + kontenjan**.
- "Etkinlik" modu bir **`Event` kaydı** oluşturur (`organizerId`=kulüp / `teamId`=takım) →
  takvim otomatik beslenir.
- **Kabul:** Kulüp etkinlik paylaşır → hem akışta hem `/events` takviminde görünür; Haber tipi yok.

## Faz 2 — Kontenjan & Uyarı
- `Event.capacity` (mevcut) kullanılır. RSVP sayısına göre doluluk hesabı.
- Akış/detay kartında **"Sınırlı Kontenjan — X kaldı"** rozeti; dolunca **Katıl/RSVP kilitlenir**.
- **Kabul:** Kontenjan göstergesi ve dolu-uyarısı çalışıyor.

## Faz 3 — Navigasyon & Sekme Yapısı
- Navbar sırası: **Akış · Etkinlikler · Kulüpler · Takımlar · Haberler (en son)**.
- **Kulüpler** sayfası: `Tüm Topluluklar | Takip Ettiklerim` sekmeleri (pill segment).
  "Takip Ettiklerim" = APPROVED üyelikler + **Ayrıl** butonu.
- **Takımlar** sayfası: aynı sekme yapısı.
- **Etkinlikler** sayfası: **"Üyeliklerim" sekmesi kaldırılır** → sadece takvim + Yaklaşan Etkinlikler.
- Feed kısayolu *"Takip Ettiğim Topluluklar"* → `/clubs` "Takip Ettiklerim" sekmesi (takımlar için aynısı).
- **Kabul:** Kısayol doğru sekmeye gidiyor; Etkinlikler'de üyelik sekmesi yok.

### ⏸ İLK 3 FAZ BİTTİ — TEST İÇİN DURULACAK

## Faz 5 — Yönetim Sayfaları Güncellemesi
- `clubs/manage` & `teams/manage` "Etkinlikler" sekmesindeki **"yakında" placeholder'ı**
  gerçek etkinlik yönetimiyle değiştir (Faz 1 modeline göre listele/düzenle/sil).
- **Kabul:** Yönetici etkinliklerini panelden yönetiyor.

## Faz 7 — Admin Filtreleme
- `/admin/students`, `/admin/clubs`, `/admin/teams` → arama + durum/fakülte/kategori filtreleri.
- **Kabul:** Üç sekmede de filtre çalışıyor.

## Faz 6 — Öğrenci Ayarlar Sayfası
- "Kaydettiklerim" ≠ "Ayarlar" karmaşasını çöz; ayarlar sayfasını netleştir/baştan yaz.
- **Kabul:** Ayarlar net bir sayfa; kaydettiklerim ayrı.

## Faz 4 — Kulüp & Takım Detay Sayfaları
- Yeni route `/clubs/[slug]`, `/teams/[slug]` (mockup `bili_im..._detay` layout'u):
  kapak + Hakkında + Yönetim Kurulu + Paylaşımlar + Yaklaşan/Geçmiş Etkinlikler.
- Liste kartlarındaki dış-link → bu iç sayfaya bağlanır.
- **Kabul:** Kullanıcı kulüp sayfasına girip paylaşım/etkinlik/hakkında görüyor.

## Faz 3.5 — Haberler (RSS) Modülü  *(EN SON)*
- **Veri modeli:** `RssSource` (`name`, `url`, `faculty?`, `department?`, `active`); boş hedef = genel.
- **Backend:** RSS çek+parse (server-side), DB cache + periyodik yenileme; `getNewsForUser(user)`
  bölüm/fakülte + genel kaynakları tarihe göre döndürür.
- **Admin:** RSS kaynağı Ekle/Düzenle/Sil + fakülte/bölüm etiketleme + aktif/pasif.
- **UI:** `/news` = 3-kolon feed kabuğu; orta kolon RSS kartları (başlık, kaynak, tarih, özet, dış link).
- **Kabul:** Admin RSS ekler → ilgili bölüm öğrencisi `/news`'te görür.

## Ayrı İz — QR Katılım Doğrulama
- `Event.qrCode` (mevcut). `EventAttendance` (check-in/out + süre), QR üret/okut akışı,
  mobil `/events/[id]/checkin`. Faz 1-2 sonrası anlamlı. (Kök `future` dosyasındaki QR maddesiyle örtüşür.)

---

## Bağımlılık akışı
```
1 (içerik modeli) → 2 (kontenjan) → 3 (nav/sekme)  ⏸ test
→ 5 (yönetim) → 7 (admin filtre) → 6 (ayarlar) → 4 (detay) → 3.5 (RSS)
QR izi: 1-2 sonrası bağımsız.
```
