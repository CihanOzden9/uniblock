# ADR 002: Takım (Team) Yapısının Eklenmesi

**Status:** Proposed
**Date:** 2026-05-30
**Deciders:** Cihan Ozden

## Context

Platformda şu an iki birinci sınıf varlık var: öğrenciler (`User`) ve kulüpler (`Club`). Kulüp yapısı zengin: üyelik (`ClubMember`, başvuru/onay akışıyla), gönderiler (`Post`), etkinlikler (`Event`), anketler (`Survey`), performans skoru, yönetim paneli (`/clubs/manage` + settings/stats/complaints) ve admin moderasyonu (`/admin/clubs`).

İhtiyaç: kulüp yapısına **birebir benzer** bir **Takım (Team)** varlığı eklemek.

Mevcut durumun ilgili kalıntıları (planı şekillendiren önemli noktalar):

- **`ProjectTeam` modeli zaten şemada var** ama tamamen kullanılmıyor — sadece `id/name/slug/description/leader` alanları taşıyor; üye, içerik veya statü yok. (`ledProjects` ilişkisi de atıl.)
- **Kayıt formunda "Takım" sekmesi zaten var** ama devre dışı: `RegisterForm.tsx:83` + "Takım kayıtları şu an kapalıdır" (`:199`).
- **Tuzak:** `Role` enum'undaki `PROJECT_ADMIN` rolü takım liderleri için kullanılamaz — `middleware.ts:31` ve `admin/layout.tsx:13` bu role **admin paneline tam erişim** veriyor. Takım liderine yeni bir rol gerekiyor.
- İçerik modelleri (`Post`, `Event`, `Survey`) sahipliği `clubId`/`organizerId` üzerinden **doğrudan Club'a bağlı**. `Interaction` ve `Report` ise içeriğe (post/event/survey) bağlı olduğu için **takım içeriğinde değişiklik gerektirmeden çalışır** (beğeni, yorum, oy, şikâyet otomatik gelir).

**Kararlaştırılmış gereksinimler (kullanıcı onayı ile):**
1. **Tam parite** — takımların da gönderileri, etkinlikleri, anketleri, üyeleri, başvuru akışı, performans skoru ve şikâyet/moderasyonu olacak.
2. **Ayrı `Team` tablosu** — Club'a paralel `Team` + `TeamMember` modelleri; mevcut boş `ProjectTeam` buna dönüştürülür; içerik modellerine nullable `teamId` eklenir.

## Decision

`Club` yapısına paralel, ayrı tablolu bir `Team` varlığı oluşturulacak. İçerik (`Post`/`Event`/`Survey`) sahipliği "**ya kulüp ya takım**" (XOR) olacak şekilde her iki modele de nullable FK eklenerek genelleştirilecek; `Interaction`/`Report` dokunulmadan yeniden kullanılacak. Takım liderleri için yeni `TEAM_ADMIN` rolü eklenecek (admin paneli erişimi vermeyen).

## Options Considered

### Option A: Ayrı `Team` tablosu (Seçilen)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Orta-Yüksek (paralel rotalar + içerik FK genelleştirme) |
| Cost | Orta — Club kodu şablon olarak kopyalanır |
| Scalability | Yüksek — Team bağımsız evrilebilir |
| Veri temizliği | Yüksek — kulüp tablosu kirlenmez |

**Pros:** Net kavramsal ayrım; takım kuralları kulüpten bağımsız değişebilir; `Interaction`/`Report` bedavaya gelir.
**Cons:** Club kodunun büyük kısmı (dashboard, actions, admin) takım için ikizlenir; içerik FK'leri nullable + XOR doğrulaması uygulama katmanında yapılmalı.

### Option B: Club'a `type` ayırıcı (CLUB | TEAM)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Düşük |
| Cost | En düşük — tüm içerik/feed/admin akışı bedava |
| Scalability | Düşük — iki kavram tek tabloda kilitlenir |
| Veri temizliği | Düşük |

**Pros:** En az kod; tüm content/feed/management/admin yığını anında çalışır.
**Cons:** İki kavram tek tabloda karışır; ileride alan/kural ayrışırsa teknik borç; mevcut tüm kulüp sorgularına `type` filtresi eklemek gerekir (gözden kaçma riski). **Reddedildi** (kullanıcı ayrı tablo istedi).

### Option C: Polimorfik "organizasyon" soyutlaması
İçerik için soyut `Organization(Club|Team)` ortak tablosu.
**Pros:** Sıfır içerik tekrarı. **Cons:** Tüm şema ve sorgu katmanında büyük refaktör + risk; bu projenin olgunluğuna (testsiz, `as any`'li) göre orantısız. **Reddedildi.**

## Trade-off Analysis

Asıl gerilim **kod tekrarı (Option A)** ile **kavram karışması/borç (Option B)** arasında. Tam parite istendiği için içerik katmanı her hâlükârda dokunuluyor; Option A'da bunu nullable `teamId` + XOR ile çözüyoruz. `Interaction`/`Report`'un içeriğe bağlı olması sayesinde moderasyon/etkileşim ikizlenmesi gerekmiyor — Option A'nın maliyetini ciddi düşüren nokta bu. Club dashboard/actions kodu kopyalanacak; bu bilinçli kabul edilen tekrar.

## Consequences

**Kolaylaşan:**
- Takımlar kulüplerden bağımsız evrilebilir; kulüp sorguları olduğu gibi kalır (regresyon riski düşük).
- Şikâyet/moderasyon ve etkileşim takım içeriği için otomatik çalışır.

**Zorlaşan:**
- `Post`/`Event`/`Survey` artık iki olası sahibe sahip → uygulama katmanında "tam olarak biri" kuralı elle korunmalı.
- Club ve Team arasında kopyalanan dashboard/actions kodu iki yerde bakım gerektirir.

**İleride gözden geçirilecek:**
- Liderlik tablosu: kulüp ve takım tek listede mi, ayrı mı sıralanacak (Faz 4'te netleşecek; öneri: ayrı).
- Kopyalanan kod yeterince büyürse ortak yardımcılara çıkarma (Option C'ye kısmi geçiş).

## Action Items — Faz Faz Geliştirme Planı

Her faz bağımsız derlenebilir/çalışır halde bırakılacak. Şifreler düz metin, `secure:false` çerez, Türkçe arayüz gibi mevcut konvansiyonlar korunacak (bkz. CLAUDE.md).

### Faz 0 — Şema & veri katmanı temeli
- [ ] `prisma/schema.prisma`: boş `ProjectTeam` → `Team` modeline dönüştür; `Club` alan setini yansıt (name, slug, description, logo, contactEmail, presidentEmail, website, status, leaderId/leader). **Not: takımda sıralama olmayacağı için `performanceScore` EKLENMEZ.**
- [ ] `TeamMember` modeli ekle (`ClubMember` aynası: userId/teamId, role, `MembershipStatus`, joinedAt, `@@unique([userId, teamId])`).
- [ ] `Role` enum'una `TEAM_ADMIN` ekle.
- [ ] İçerik FK'leri: `Post.teamId String?`+ilişki; `Event.organizerId`'yi nullable yap + `teamId String?`; `Survey.clubId`'yi nullable yap + `teamId String?`.
- [ ] `User`: `ledTeams Team[] @relation("TeamLeader")` + `teamMemberships TeamMember[]`; atıl `ledProjects`/`ProjectLeader` kaldır.
- [ ] `npx prisma db push` + `npx prisma generate`.
- [ ] `src/lib/session.ts` `INCLUDE`'a `ledTeams` + `teamMemberships: { include: { team: true } }` ekle.

### Faz 1 — Kayıt & kimlik
- [ ] `RegisterForm.tsx`: "Takım" sekmesini etkinleştir (kulüp alanlarının aynası: teamName, resmi e-posta vb.; `role=TEAM_ADMIN` hidden input).
- [ ] `actions/auth.ts register`: `TEAM_ADMIN` rolünde Team + TeamMember(BOARD_MEMBER) oluştur, çerezleri yaz.
- [ ] Giriş yönlendirmesi (`login/page.tsx`) ve Navbar yönetim linki: `TEAM_ADMIN` → `/teams/manage`.

### Faz 2 — Takım keşfi & üyelik (öğrenci tarafı)
- [ ] `src/app/actions/team.ts`: `club.ts` aynası — requestJoinTeam, leaveTeam, handleJoinRequest, add/remove/updateTeamMember, checkUserExistence.
- [ ] `/teams` + `TeamsClient.tsx` (`/clubs` aynası): listele, katılma isteği, ayrıl.
- [ ] `Navbar.tsx`: "Takımlar" linki (`/teams`).
- [ ] `middleware.ts`: `/teams` prefiksini allow-list'e ekle.

### Faz 3 — Takım yönetim paneli
- [ ] `/teams/manage` + `TeamDashboardClient.tsx` (`ClubDashboardClient` aynası): üyeler, gönderiler, etkinlikler, anketler, katılım istekleri, şikâyetler.
- [ ] `/teams/manage/settings` (+ updateTeamSettings, updateTeamPassword), `/teams/manage/stats`, `/teams/manage/complaints`.
- [ ] İçerik üretim action'larını teamId destekleyecek şekilde genişlet: `post.ts`, `survey.ts` (`clubId` yerine clubId **veya** teamId), `stats.ts` (`organizerId` takım için).

### Faz 4 — Feed & içerik entegrasyonu
- [ ] `feed/page.tsx`, `news/page.tsx`, `events/page.tsx`: takım kaynaklı gönderi/etkinlik/anketleri kulüp içeriğiyle birlikte çek ve göster (sahip etiketi "Takım").
- [ ] **Liderlik tablosu: takımlar HİÇBİR sıralamaya dâhil edilmeyecek** (karar: takımda sıralama sistemi yok). Feed'deki `topClubs` ve `stats.ts` sıralaması yalnızca kulüplere ait kalır; takım panelinde sıralama bölümü gösterilmez.

### Faz 5 — Admin paneli
- [ ] `/admin/teams` + status action'ları (`/admin/clubs` aynası); `AdminSidebar` linki; `admin/page.tsx` özetine takım metrikleri.
- [ ] Admin şikâyetlerinin takım içeriğini de kapsadığını doğrula (Interaction polimorfik olduğu için büyük ihtimalle otomatik).

### Faz 6 — Temizlik & cila
- [ ] Kalan `ProjectTeam`/`ledProjects` referanslarını temizle; `CLAUDE.md`'yi takım yapısıyla güncelle.
- [ ] Uçtan uca duman testi: kayıt → keşif → katılım → yönetim → içerik → feed → admin.
