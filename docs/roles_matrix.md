# UniBlock RBAC Roles ve Yetki Matrisi

## Roller
- **Öğrenci**: Platform kullanıcıları
- **Kulüp**: Topluluk yöneticileri
- **Proje_Takımı**: Proje ekipleri
- **İşletme**: Sponsor/işletme hesapları
- **Admin**: Sistem yöneticileri

## Yetki Matrisi

| Action / Role          | Öğrenci | Kulüp | Proje_Takımı | İşletme | Admin |
|------------------------|---------|-------|--------------|---------|-------|
| view_feed              | ✅      | ✅    | ✅           | ✅      | ✅    |
| view_news              | ✅      | ✅    | ✅           | ✅      | ✅    |
| like_comment_complain  | ✅      | ✅    | ✅           | ✅      | ✅    |
| create_event           | ❌      | ✅    | ✅           | ❌      | ✅    |
| manage_event           | ❌      | ✅    | ✅           | ❌      | ✅    |
| qr_checkin             | ✅      | ✅    | ✅           | ❌      | ✅    |
| manage_members         | ❌      | ✅    | ✅           | ❌      | ✅    |
| view_dashboard         | ✅      | ✅    | ✅           | ✅      | ✅    |
| sponsor_apply          | ❌      | ✅    | ✅           | ✅      | ✅    |
| manage_sponsorship     | ❌      | ❌    | ❌           | ✅      | ✅    |
| moderate_content       | ❌      | ❌    | ❌           | ❌      | ✅    |
| manage_users           | ❌      | ❌    | ❌           | ❌      | ✅    |
| system_settings        | ❌      | ❌    | ❌           | ❌      | ✅    |

**Not:** Bu v1 matrisidir. Faz ilerledikçe genişletilecek.
