const feedData = {
  forYou: [
    {
      type: "Kulüp",
      title: "Yazılım Kulübü: Backend Bootcamp Başlıyor",
      meta: "Bugün 11:20",
      content: "3 haftalık backend bootcamp programı için ön kayıtlar açıldı. Kontenjan 80 kişi ile sınırlı.",
      source: "Yazılım Kulübü"
    },
    {
      type: "Topluluk",
      title: "Tasarım Topluluğu: UI Critique Session",
      meta: "Bugün 15:40",
      content: "Öğrencilerin arayüz çalışmalarını birlikte değerlendireceği açık oturum Cuma günü Medya Lab’de.",
      source: "Design Community"
    },
    {
      type: "Etkinlik",
      title: "Kampüs Bahar Festivali Programı Güncellendi",
      meta: "Dün 19:05",
      content: "Sahne saatleri, kulüp stant yerleşimi ve etkinlik haritası duyurular sekmesinde yayımlandı.",
      source: "Kampüs Etkinlik Ofisi"
    }
  ],
  trend: [
    {
      type: "Kulüp",
      title: "Girişimcilik Kulübü: Pitch Night Başvuruları",
      meta: "2 saat önce",
      content: "10 takımın sahne alacağı Pitch Night için son başvuru tarihi Pazartesi 23:59.",
      source: "Girişimcilik Kulübü"
    },
    {
      type: "Topluluk",
      title: "Mobil Topluluk Meetup’ı Bu Hafta Rekor Katılımla",
      meta: "Dün",
      content: "Android ve iOS odaklı teknik oturumların notları paylaşıldı, bir sonraki meetup kayıtları açıldı.",
      source: "Mobil Topluluk"
    },
    {
      type: "Etkinlik",
      title: "Siber Güvenlik CTF Hazırlık Serisi Başladı",
      meta: "3 gün önce",
      content: "Başlangıçtan ileri seviyeye görevlerle takım bazlı hazırlık oturumları başlıyor.",
      source: "Cyber Club"
    }
  ]
};

const newsData = [
  {
    category: "Teknoloji",
    title: "Kampüste Nesnelerin İnterneti Laboratuvarı Açılıyor",
    summary: "Yeni IoT laboratuvarı ile öğrenciler gömülü sistemler ve sensör ağları üzerinde uygulamalı çalışma yapabilecek.",
    source: "UniBlock News",
    date: "28 Nisan 2026"
  },
  {
    category: "Yazılım",
    title: "Açık Kaynak Haftası: 12 Kulüp Ortak Etkinlik Düzenliyor",
    summary: "Üniversite kulüpleri, açık kaynak katkı kültürünü yaygınlaştırmak için bir haftalık kodlama maratonu başlatıyor.",
    source: "Kampüs Bülten",
    date: "27 Nisan 2026"
  },
  {
    category: "Yapay Zeka",
    title: "Öğrenci Takımından Görüntü İşleme Projesi TÜBİTAK’a Seçildi",
    summary: "Gerçek zamanlı trafik analizi yapan proje, ulusal düzeyde destek almaya hak kazandı.",
    source: "Teknokampus",
    date: "26 Nisan 2026"
  },
  {
    category: "Girişimcilik",
    title: "Kuluçka Merkezinden 5 Yeni Startup Mezun Oldu",
    summary: "Fintek, sağlık ve eğitim teknolojileri alanında çalışan takımlar yatırımcı sunum gününe çıkıyor.",
    source: "Startup Kampüs",
    date: "25 Nisan 2026"
  },
  {
    category: "Kampüs",
    title: "Bahar Şenliği Programı ve Sahne Takvimi Yayınlandı",
    summary: "3 gün sürecek şenlikte kulüp stantları, konserler ve sosyal sorumluluk etkinlikleri yer alıyor.",
    source: "Üni Duyuru",
    date: "24 Nisan 2026"
  }
];

const categoryColors = {
  "Teknoloji": "#059669",
  "Yazılım": "#000000",
  "Sistem": "#525252",
  "Yapay Zeka": "#059669",
  "Girişimcilik": "#000000",
  "Kampüs": "#525252",
  "default": "#000000"
};

function cardTemplate(item, isNews = false) {
  const category = isNews ? item.category : item.type;
  const dotColor = categoryColors[category] || categoryColors.default;
  const dateOrMeta = isNews ? item.date : item.meta;
  const source = item.source || "UniBlock";

  return `
    <article class="news-card">
      <div>
        <div class="news-card-header">
          <div class="news-meta-left">
            <span class="category-dot" style="background:${dotColor}"></span>
            <span class="meta-text">${category}</span>
          </div>
          <span class="meta-text">${dateOrMeta}</span>
        </div>
        <div class="news-divider"></div>
        <h3>${item.title}</h3>
        <p>${isNews ? item.summary : item.content}</p>
      </div>
      <div class="news-card-footer">
        <span class="source">${source}</span>
        <span class="read-link">Detay →</span>
      </div>
      <div class="interaction-bar">
        <button class="int-btn like-btn" onclick="handleLike(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          Beğen
        </button>
        <button class="int-btn comment-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          Yorum
        </button>
      </div>
    </article>
  `;
}

function renderFeed(tabKey = "forYou") {
  const container = document.getElementById("feed-list");
  if (!container) return;

  const items = feedData[tabKey] || [];
  container.innerHTML = items.map((item) => cardTemplate(item, false)).join("");
}

function setupFeedTabs() {
  const buttons = document.querySelectorAll("[data-feed-tab]");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.getAttribute("data-feed-tab");
      renderFeed(tab);
    });
  });

  renderFeed("forYou");
}

function renderNews(filter = "Tümü") {
  const container = document.getElementById("news-list");
  if (!container) return;

  const filtered = filter === "Tümü"
    ? newsData
    : newsData.filter((n) => n.category === filter);

  container.innerHTML = filtered.map((item) => cardTemplate(item, true)).join("");
}

function setupNewsFilters() {
  const chipsContainer = document.getElementById("category-chips");
  if (!chipsContainer) return;

  const categories = ["Tümü", "Teknoloji", "Yazılım", "Yapay Zeka", "Girişimcilik", "Kampüs"];
  chipsContainer.innerHTML = "";

  categories.forEach((cat, index) => {
    const chip = document.createElement("button");
    chip.className = `chip ${index === 0 ? "active" : ""}`;
    chip.textContent = cat;

    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderNews(cat);
    });

    chipsContainer.appendChild(chip);
  });

  renderNews("Tümü");
}

function setupLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = "./ogrenci.html";
  });
}

function setupRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = "./login.html";
  });
}

const rankingData = [
  { name: "Yazılım Kulübü", points: 2450 },
  { name: "Girişimcilik Kulübü", points: 2100 },
  { name: "Tasarım Topluluğu", points: 1850 },
  { name: "Mobil Topluluk", points: 1600 },
  { name: "Siber Güvenlik", points: 1420 }
];

function renderRanking() {
  const container = document.getElementById("ranking-mini");
  if (!container) return;

  container.innerHTML = rankingData.map((club, index) => `
    <div class="rank-item">
      <span class="rank-no">0${index + 1}</span>
      <div class="rank-info">
        <span class="rank-name">${club.name}</span>
        <span class="rank-points">${club.points} PUAN</span>
      </div>
    </div>
  `).join("");
}

window.handleLike = function(btn) {
  const isLiked = btn.classList.toggle("active");
  btn.style.color = isLiked ? "var(--accent)" : "var(--gray-400)";
  btn.querySelector("svg").setAttribute("fill", isLiked ? "var(--accent)" : "none");
};

window.toggleMessages = function() {
  document.getElementById("message-overlay").classList.toggle("active");
};

const clubsData = [
  { name: "Yazılım Kulübü", cat: "Teknoloji", manager: "Can Demir", points: 2450, events: 12 },
  { name: "Girişimcilik Kulübü", cat: "Girişimcilik", manager: "Ayşe Ak", points: 2100, events: 8 },
  { name: "Tasarım Topluluğu", cat: "Sanat", manager: "Mert Soylu", points: 1850, events: 15 },
  { name: "Mobil Topluluk", cat: "Teknoloji", manager: "Selin Gün", points: 1600, events: 6 },
  { name: "Siber Güvenlik", cat: "Sistem", manager: "Bora Tan", points: 1420, events: 4 }
];

function renderFullRanking() {
  const container = document.getElementById("full-ranking-body");
  if (!container) return;

  container.innerHTML = clubsData.sort((a, b) => b.points - a.points).map((club, index) => `
    <tr>
      <td class="rank-cell">0${index + 1}</td>
      <td class="club-cell">${club.name}</td>
      <td>${club.cat}</td>
      <td>${club.events} Etkinlik</td>
      <td class="points-cell">${club.points} PUAN</td>
    </tr>
  `).join("");
}

function renderClubs() {
  const container = document.getElementById("club-list");
  if (!container) return;

  container.innerHTML = clubsData.map(club => `
    <div class="club-card">
      <div class="club-header">
        <div class="club-logo-circle">${club.name.split(' ').map(n => n[0]).join('')}</div>
        <div class="club-name">
          <h3>${club.name}</h3>
          <span class="club-cat">${club.cat}</span>
        </div>
      </div>
      <div class="manager-section">
        <p class="manager-label">Başkan / Yönetici</p>
        <div class="manager-info">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          ${club.manager}
        </div>
      </div>
      <button class="btn btn-outline" style="width: 100%; margin-top: 10px; font-size: 10px;">Yöneticilerle Konuş</button>
    </div>
  `).join("");
}

(function init() {
  const page = document.body.dataset.page;
  if (page === "feed") {
    setupFeedTabs();
    renderRanking();
  }
  if (page === "news") setupNewsFilters();
  if (page === "login") setupLoginForm();
  if (page === "register") setupRegisterForm();
  if (page === "ranking") renderFullRanking();
  if (page === "clubs") renderClubs();
})();
