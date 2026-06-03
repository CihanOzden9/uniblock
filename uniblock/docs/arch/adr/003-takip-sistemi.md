# ADR 003: Topluluk Takip (Follow) Sistemi

**Status:** Accepted
**Date:** 2026-06-03
**Deciders:** Cihan Ozden

## Context

Şimdiye kadar bir kulüp/takıma "katılmak" tek yoldu: `ClubMember`/`TeamMember` üzerinden **onay (PENDING→APPROVED) gerektiren** katılma isteği. Bu hem ağır (yönetici onayı bekler) hem de günlük "içeriğini görmek istiyorum" niyeti için fazla.

İhtiyaç: kullanıcının bir topluluğu **anlık, onaysız takip edebilmesi**. Takip edince:
- "Takip Ettiklerim" listesinde görünür,
- topluluk duyuru/etkinlik/anket yayınladığında bildirim alır (**bildirim sistemi sonraki faz** — bu ADR yalnızca altyapıyı hazırlar).

Katılma isteği ise artık **yönetime/kadroya katılma** anlamına gelir ve onay akışı korunur.

## Decision

İki kavram ayrıştırıldı:

| | **Takip (Follow)** — yeni | **Üyelik (Membership)** — mevcut |
|---|---|---|
| Eylem | Anlık, onaysız (toggle) | Katılma isteği → yönetici onayı |
| Anlam | İçerik abonesi (takipçi) | Yönetim/kadro üyesi |
| Model | yeni `Follow` | `ClubMember`/`TeamMember` |
| UI | Liste kartı birincil aksiyon + "Takip Ettiklerim" sekmesi | Detay sayfası "Katıl" (`JoinLeaveButton`) |

Tek polimorfik `Follow` modeli (XOR `clubId`/`teamId`), kod tabanının mevcut içerik-sahipliği desenine uyar.

## Options Considered

- **A — Tek `Follow` (XOR club/team) [Seçilen]:** Tek tablo, tek `toggleFollow` action, Club/Team paralelliğiyle tutarlı. XOR doğrulaması uygulama katmanında.
- **B — Ayrı `ClubFollower` + `TeamFollower`:** Daha katı tipler, ama iki tablo + iki action; gereksiz tekrar.
- **C — Mevcut `ClubMember`'a `type` (FOLLOW|MEMBER):** Üyelik tablosunu kirletir; yönetim üye sorgularının hepsine filtre eklemek gerekir (regresyon riski). Reddedildi.

## Consequences

**Kolaylaşan:**
- O(1) takip/bırak; "kullanıcının takipleri" ve "topluluğun takipçileri" indeksli sorgular.
- Bildirim sistemi `Follow` tablosunu hedef kümesi olarak doğrudan kullanır.
- "Takip Ettiklerim" artık gerçek takip anlamına gelir (önceden üyeliği gösteriyordu).

**Zorlaşan / dikkat:**
- `Post`/`Event`/`Survey` gibi her satır XOR `clubId`/`teamId` taşır; `Follow` da aynı kuralı uygular (DB değil app enforce eder).
- Liste kartının birincil aksiyonu artık **Takip**; üyelik "Katıl" detay sayfasına taşındı.

**İleride (bu ADR kapsamı dışı — sadece hazırlık):**
- `Notification` modeli + içerik üretiminde (`createPost`/`createSurvey`/etkinlik) takipçilere bildirim üretimi. Kod içine `// TODO(bildirim)` işaretçileri bırakıldı.

## Action Items

- [x] `Follow` modeli (User.follows, Club.followers, Team.followers) + `db push`/`generate`
- [x] `actions/follow.ts` → `toggleFollow`
- [x] `clubs`/`teams` liste sayfaları takip durumunu çeker; kart birincil aksiyonu Takip; "Takip Ettiklerim" = follow filtresi
- [x] Detay sayfasına `FollowButton`; üyelik "Katıl" korunur
- [x] İçerik üretim aksiyonlarına `// TODO(bildirim)` işaretçileri
- [ ] (Sonraki faz) `Notification` modeli + bildirim dağıtımı
