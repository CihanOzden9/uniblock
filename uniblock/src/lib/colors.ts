// Kulüp/takım vurgu renkleri (Academic Pulse ile uyumlu canlı tonlar)
export const CLUB_COLORS = [
  "#005bbf", // eğitim mavisi
  "#fd6c00", // topluluk turuncusu
  "#7c3aed", // mor
  "#dc2626", // kırmızı
  "#059669", // zümrüt
  "#0891b2", // camgöbeği
  "#db2777", // pembe
  "#ca8a04", // hardal
  "#4f46e5", // indigo
  "#0d9488", // teal
  "#ea580c", // koyu turuncu
  "#16a34a", // yeşil
  "#2563eb", // parlak mavi
  "#e11d48", // gül
  "#9333ea", // menekşe
];

export function randomClubColor(): string {
  return CLUB_COLORS[Math.floor(Math.random() * CLUB_COLORS.length)];
}

// Geçerli 6 haneli hex mi?
export function isHexColor(v: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(v);
}
