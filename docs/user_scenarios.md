# UniBlock Kullanıcı Senaryoları (Happy Path + Edge Cases)

## Öğrenci
### Happy Paths
1. Public landing → register (bölüm/ilgi alanı seç) → feed görüntüle → haber oku/beğen → event katıl → QR check-in.
2. Login → personalized feed → comment → profile güncelle.

### Edge Cases
1. Şifresi unutma → reset → yeni şifre.
2. İnternet kesintisi sırasında like → retry.
3. Yasak içerik şikayet et.

## Kulüp
### Happy Paths
1. Login → event oluştur → üye davet → dashboard KPI görüntüle.
2. Mesaj grubu oluştur → üyelere bildirim gönder.

### Edge Cases
1. Event kapasite doldu → katılım reddet.
2. Üye çıkarma → onay modal.

## Proje_Takımı
### Happy Paths
1. Proje duyuru paylaş → ekip üye ekle → sponsor başvur.
2. Dashboard proje performansı izle.

### Edge Cases
1. Ekip lideri ayrıldı → yeni lider ata.

## İşletme
### Happy Paths
1. Login → sponsor etkinlik listele → başvur → dashboard dönüşüm izle.

### Edge Cases
1. Sponsor reddedildi → itiraz et.

## Admin
### Happy Paths
1. Moderasyon kuyruğu incele → içerik onayla/reddet.
2. Kullanıcı banla.

### Edge Cases
1. Sistem hatası log incele.

**Not:** v1 - Faz 1 sonrası genişletilecek.
