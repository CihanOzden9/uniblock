# Faz 1: Kimlik, Yetki ve Kullanıcı Çekirdeği Geliştirme Planı

**Sürüm:** 1.0  
**Tarih:** 2026-05-01  
**Durum:** Taslak / Planlama  
**Bağımlılık:** Faz 0 (Mimari Omurga)

---

## 1. Amaç
Bu fazın amacı, UniBlock platformunun güvenlik ve kullanıcı yönetim temelini oluşturmaktır. Kullanıcıların güvenli bir şekilde sisteme girmesi, rollerine uygun yetkilerle donatılması ve kişisel profillerini yönetebilmesi hedeflenir.

---

## 2. Modüler Detaylar ve Teknik Görevler

### 1.1 Auth (Kimlik Doğrulama) Modülü
Bu modül, sisteme giriş kapısıdır ve tüm güvenlik akışını yönetir.

- **[AUTH-01] Kayıt (Register) Sistemi:**
  - Rol bazlı kayıt formu (Öğrenci, Kulüp, Takım, İşletme).
  - Üniversite e-posta doğrulaması (Öğrenciler için `.edu.tr` kontrolü).
  - Şifre politikası (min 8 karakter, büyük-küçük harf, rakam, özel karakter).
- **[AUTH-02] Giriş (Login) ve Oturum Yönetimi:**
  - JWT tabanlı stateless oturum yönetimi.
  - "Beni Hatırla" fonksiyonu (Refresh Token).
- **[AUTH-03] Şifre Sıfırlama ve Hesap Kurtarma:**
  - E-posta ile şifre sıfırlama linki gönderimi.
  - Token süresi yönetimi (örn: 15 dakika geçerlilik).
- **[AUTH-04] 2FA (İki Faktörlü Doğrulama):**
  - OTP (One Time Password) entegrasyonu (E-posta veya SMS/Authenticator).
  - 2FA açma/kapama tercihi.

### 1.2 RBAC (Rol Bazlı Yetki Kontrolü) Modülü
Kullanıcıların sistemdeki eylemlerini kısıtlayan ve yöneten katmandır.

- **[RBAC-01] Rol-Yetki Matrisi Uygulaması:**
  - `roles` ve `permissions` tablolarının oluşturulması.
  - Middleware katmanında yetki kontrolü.
- **[RBAC-02] Route Guard Yapısı:**
  - Next.js Middleware ile sayfa bazlı yetki kontrolü (örn: `/admin` sadece Admin rolüne).
- **[RBAC-03] Bileşen Bazlı Yetki Katmanı:**
  - UI tarafında yetkiye göre buton/menü gizleme (örn: "Etkinlik Oluştur" butonu sadece Kulüp/Takım rollerine görünür).

### 1.3 Profil ve Hesap Modülü
Kullanıcının platformdaki dijital kimliğini ve ayarlarını yönettiği alandır.

- **[PROF-01] Profil Görüntüleme ve Güncelleme:**
  - Ad, soyad, biyografi, profil fotoğrafı.
  - Eğitim bilgileri (Fakülte, Bölüm, Sınıf).
- **[PROF-02] İlgi Alanları Yönetimi:**
  - Haber akışını besleyecek "Etiket" seçimi (Teknoloji, Sanat, Spor vb.).
- **[PROF-03] Hesap Güvenliği ve Ayarlar:**
  - E-posta/Şifre değiştirme.
  - 2FA durumu kontrolü.
  - Bildirim tercihleri (E-posta/Push).

---

## 3. Veri Modeli İhtiyaçları (ERD v1 - Faz 1 Parçası)

| Tablo | Açıklama |
| :--- | :--- |
| **Users** | ID, email, password_hash, role_id, is_active, last_login |
| **User_Profiles** | user_id, first_name, last_name, bio, avatar_url, faculty, department |
| **Roles** | id, name (student, club, business, etc.), slug |
| **Permissions** | id, action_name (create_event, view_stats, etc.) |
| **Role_Permissions** | role_id, permission_id |
| **Password_Resets** | email, token, expires_at |
| **User_Interests** | user_id, interest_id |

---

## 4. API Endpoints (Taslak)

- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Giriş yapma
- `POST /api/auth/logout` - Çıkış yapma
- `POST /api/auth/reset-password-request` - Şifre sıfırlama talebi
- `PATCH /api/user/profile` - Profil güncelleme
- `GET /api/user/permissions` - Mevcut kullanıcının yetki listesi

---

## 5. UI/UX Gereksinimleri (Ekranlar)

1. **Auth Ekranları:** Giriş Yap, Üye Ol, Şifremi Unuttum, OTP Doğrulama.
2. **Profil Ekranı:** Kullanıcı bilgilerinin düzenlendiği dashboard benzeri yapı.
3. **Ayarlar Sayfası:** Güvenlik ve gizlilik kontrolleri.

---

## 6. Kabul Kriterleri (DoD - Definition of Done)

- [ ] Tüm Auth akışları (Register/Login/Reset) başarılı ve hatalı senaryolarda doğru mesajı veriyor.
- [ ] Yetkisiz kullanıcılar, yetki gerektiren sayfalara veya API uçlarına erişemiyor.
- [ ] Profil bilgileri veritabanına doğru kaydediliyor ve UI'da güncel yansıyor.
- [ ] 2FA akışı aktif edildiğinde login sürecine başarıyla dahil oluyor.
- [ ] Kod standartları (ESLint/Prettier) ve unit testler (min %70 coverage) sağlanmış.

---

## 7. Riskler ve Önlemler

- **Risk:** Şifre sıfırlama maillerinin spama düşmesi.
- **Önlem:** SendGrid veya AWS SES gibi güvenilir bir SMTP servis sağlayıcısı kullanımı.
- **Risk:** Rol karmaşası (Kullanıcının birden fazla role sahip olması durumu).
- **Önlem:** Mimariyi "tek kullanıcı - tek ana rol" veya "çoklu rol desteği" olarak Faz 1 başında netleştir (Öneri: Multi-role support).
