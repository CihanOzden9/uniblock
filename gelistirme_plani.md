# UniBlock — Faz 1 Geliştirme Planı
**Kapsam:** Yönetici Paneli Eksiklerinin Tamamlanması  
**Güncelleme:** Mayıs 2026

---

## Genel Bakış

Faz 1, admin panelinde şablon halinde kalan dört kritik modülün tamamlanmasını kapsar. Bu modüller olmadan içerik moderasyonu, sistem yönetimi devri, etkinlik kontrolü ve kayıt form yönetimi mümkün değildir.

| # | Modül | Öncelik | Durum |
|---|---|---|---|
| 1 | Şikâyet Yönetimi | Kritik | ✅ Tamamlandı |
| 2 | Admin Davet Sistemi | Kritik | ✅ Tamamlandı |
| 3 | Etkinlik İptal & Oluşturma | Yüksek | ✅ Tamamlandı |
| 4 | Fakülte & Bölüm Yönetimi | Yüksek | ✅ Tamamlandı |

---

## 1. Şikâyet Yönetimi

**Rota:** `/admin/complaints`

**Problem:** Şikâyetler listeleniyor ancak admin aksiyon alamıyordu. Çözümleme ve içerik kaldırma aksiyonları eksikti.

**Hedefler:**
- Bekleyen şikâyetleri çözümlendi olarak işaretleyebilmeli
- Şikâyet edilen içeriği (yorum / duyuru) platformdan kaldırabilmeli
- Geçersiz şikâyetleri reddedebilmeli

**Teknik Yaklaşım:**

Mevcut `Report` modelinde `status` alanı `PENDING | RESOLVED | DISMISSED` değerlerini destekliyordu. Eksik olan yalnızca UI + server action katmanıydı.

```
src/app/actions/admin.ts
  └─ handleReport(reportId, "RESOLVED" | "DISMISSED")
  └─ deleteReportContent(reportId)        ← Interaction cascade ile silinir

src/app/admin/complaints/
  ├─ page.tsx                             ← Güncellendi (aksiyon sütunu eklendi)
  └─ ReportActions.tsx                    ← Yeni client component
```

**Aksiyon Mantığı:**

| Buton | İkon | Etki |
|---|---|---|
| Çöz | ✓ yeşil | `report.status = "RESOLVED"` — içerik yerinde kalır |
| İçeriği Kaldır | 🗑 kırmızı | `Interaction` silinir (cascade `Report`'u da siler) |
| Reddet | ✗ gri | `report.status = "DISMISSED"` — şikâyet geçersiz |

**Test Senaryoları:**
- [ ] PENDING şikâyette 3 buton görünür; RESOLVED/DISMISSED'da görünmez
- [ ] "İçeriği Kaldır" öncesi `confirm()` dialogu açılır
- [ ] Aksiyon sonrası sayfa `revalidatePath` ile güncellenir
- [ ] Toast bildirimi başarı/hata için gösterilir

---

## 2. Admin Davet Sistemi

**Rota:** `/admin/admins`

**Problem:** Sayfa yalnızca bir placeholder gösteriyordu. Sisteme ikinci bir admin atanamıyordu.

**Hedefler:**
- E-posta ile kayıtlı bir kullanıcıyı `SUPER_ADMIN` yapabilmeli
- Mevcut adminleri listeleyebilmeli
- Admin yetkisini geri alabilmeli

**Teknik Yaklaşım:**

Mevcut `User.role` alanında `SUPER_ADMIN` enum değeri zaten vardı. Prisma değişikliği gerekmedi.

```
src/app/actions/admin.ts
  └─ promoteUserToAdmin(email)    ← role = "SUPER_ADMIN", status = "ACTIVE"
  └─ removeAdminRole(userId)      ← role = "STUDENT"

src/app/admin/admins/
  ├─ page.tsx                     ← Yeniden yazıldı (liste + form)
  └─ AdminManager.tsx             ← Yeni client component (form + kaldır butonu)
```

**Kısıtlar:**
- Kullanıcı sistemde kayıtlı olmalı (kayıtsız e-posta hata döner)
- Zaten `SUPER_ADMIN` olan kullanıcıya tekrar yetki verilmez
- İlk kayıt (kurucu) crown ikonu ile ayırt edilir

**Test Senaryoları:**
- [ ] Geçerli e-posta → kullanıcı listede `SUPER_ADMIN` olarak görünür
- [ ] Kayıtsız e-posta → `"Kullanıcı bulunamadı"` hatası
- [ ] Zaten admin olan e-posta → `"Zaten yönetici"` hatası
- [ ] Yetki kaldırma → listeden düşer, role `STUDENT` olur

---

## 3. Etkinlik İptal & Oluşturma

**Rota:** `/admin/events`

**Problem:** Etkinlikler listeleniyor ancak iptal/oluşturma yoktu; istatistikler eksikti.

**Hedefler:**
- Herhangi bir etkinliği iptal edebilmeli (sebep zorunlu)
- İptal sebebi kulübe otomatik duyuru olarak iletilmeli
- Kulüpler adına yeni etkinlik oluşturabilmeli
- Yaklaşan / tamamlanan / iptal sayaçları ve kulüp istatistikleri gösterilmeli

**Veritabanı Değişikliği:**

```prisma
model Event {
  cancelled    Boolean  @default(false)   // ← Eklendi
  cancelReason String?                    // ← Eklendi
}
```
Migration: `20260526155727_add_cancelled_event_faculty_department`

```
src/app/actions/admin.ts
  └─ cancelEvent(eventId, reason)
       ├─ event.cancelled = true, cancelReason = reason
       └─ Kulüp liderine Post (duyuru) oluşturulur
  └─ createAdminEvent(formData)

src/app/admin/events/
  ├─ page.tsx          ← Yeniden yazıldı (istatistikler + iptal sütunu)
  └─ EventActions.tsx  ← Yeni: CancelEventButton + CreateEventButton
```

**İptal Akışı:**
1. Admin tablodaki "İptal Et" (🚫) butonuna tıklar
2. Modal açılır — sebep zorunlu olarak girilir
3. `event.cancelled = true` + `cancelReason` kaydedilir
4. Kulübün lider kullanıcısı bulunur → o kulübün altına otomatik `Post` (ANNOUNCEMENT) oluşturulur
5. Listede iptal edilen etkinlik soluk görünür, sebep satırda gösterilir

**İstatistik Kartları:**

| Kart | Açıklama |
|---|---|
| Yaklaşan | `date >= now && !cancelled` |
| Tamamlanan | `date < now && !cancelled` |
| İptal Edilen | `cancelled === true` |
| Ort. Katılım | Tamamlanan etkinliklerin RSVP ortalaması |

**En Aktif Kulüpler:** Etkinlik sayısına göre sıralı yatay çubuk grafik (top 5).

**Test Senaryoları:**
- [ ] Aktif etkinliğin yanında iptal butonu görünür; iptal edilmişte yoktur
- [ ] Sebep girilmeden form gönderilemez
- [ ] İptal sonrası kulübün duyuruları arasında ilgili post oluşur
- [ ] Yeni etkinlik oluşturulduktan sonra listede görünür
- [ ] Kulüp seçilmeden form gönderilemez

---

## 4. Fakülte & Bölüm Yönetimi

**Rota:** `/admin/departments`

**Problem:** Sayfa placeholder'dı. Kayıt formu fakülte/bölüm için serbest metin kullanıyordu; tutarsız veri girişine neden oluyordu.

**Hedefler:**
- Fakülte ekle / sil yapabilmeli
- Her fakülteye bağlı bölüm ekle / sil yapabilmeli
- Kayıt formu bu listelerden dropdown ile seçim yaptırmalı
- Henüz liste yoksa serbest metin fallback'i çalışmalı

**Veritabanı Değişikliği:**

```prisma
model Faculty {
  id          String       @id @default(cuid())
  name        String       @unique
  createdAt   DateTime     @default(now())
  departments Department[]
}

model Department {
  id        String   @id @default(cuid())
  name      String
  facultyId String
  faculty   Faculty  @relation(fields: [facultyId], references: [id], onDelete: Cascade)
  @@unique([facultyId, name])
}
```

```
src/app/actions/admin.ts
  └─ addFaculty(name)        deleteFaculty(id)
  └─ addDepartment(fid, n)   deleteDepartment(id)

src/app/admin/departments/
  ├─ page.tsx                ← Server component (veri çeker, toplam gösterir)
  └─ DepartmentManager.tsx   ← Client component, accordion yapısı

src/app/(public)/register/
  ├─ page.tsx                ← Server wrapper (fakülteleri DB'den çeker)
  └─ RegisterForm.tsx        ← Client component (dropdown veya serbest metin)
```

**Kayıt Formu Davranışı:**

```
DB'de fakülte var mı?
  └─ Evet → Fakülte dropdown gösterilir
             Fakülte seçilince bölüm dropdown aktif olur
             (bölüm yoksa serbest metin fallback)
  └─ Hayır → Her iki alan da serbest metin olarak görünür
```

**Test Senaryoları:**
- [ ] Fakülte ekleme → listede accordion olarak görünür
- [ ] Aynı isimde fakülte ekleme → `"Bu fakülte zaten mevcut"` hatası
- [ ] Fakülte silme → bağlı bölümler cascade ile silinir
- [ ] Bölüm ekleme → fakülte accordion'u açıkken listede görünür
- [ ] Kayıt sayfasında fakülte seçilince bölüm dropdown güncellenir
- [ ] DB'de fakülte yokken serbest metin alanı gösterilir

---

## Etkilenen Dosyalar

```
uniblock/
├── prisma/
│   └── schema.prisma                        Event + Faculty + Department
├── src/app/actions/
│   └── admin.ts                             Tüm Faz 1 server actions
├── src/app/admin/
│   ├── complaints/
│   │   ├── page.tsx
│   │   └── ReportActions.tsx                Yeni
│   ├── admins/
│   │   ├── page.tsx
│   │   └── AdminManager.tsx                 Yeni
│   ├── events/
│   │   ├── page.tsx
│   │   └── EventActions.tsx                 Yeni
│   └── departments/
│       ├── page.tsx
│       └── DepartmentManager.tsx            Yeni
└── src/app/(public)/register/
    ├── page.tsx                             Server wrapper'a çevrildi
    └── RegisterForm.tsx                     Yeni client component
```

---

## Bilinen Kısıtlar & Faz 2'ye Bırakılanlar

| Konu | Açıklama | Önerilen Çözüm |
|---|---|---|
| İptal bildirimi | Post olarak ekleniyor, ayrı bildirim sistemi yok | Faz 2'de `Notification` modeli eklenebilir |
| Şifre güvenliği | Plaintext saklanıyor | `bcrypt` entegrasyonu |
| Admin yetki kontrolü | Server action'larda oturum doğrulaması yok | `getCurrentUser()` + rol guard |
| Auth altyapısı | Cookie'de raw e-posta | JWT veya NextAuth geçişi |
