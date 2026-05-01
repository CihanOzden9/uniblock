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

(function init() {
  const page = document.body.dataset.page;
  if (page === "feed") setupFeedTabs();
  if (page === "news") setupNewsFilters();
  if (page === "login") setupLoginForm();
  if (page === "register") setupRegisterForm();
})();
