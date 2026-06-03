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

// Varsayılan topluluk rengi (renk seçilmemişse)
export const DEFAULT_CLUB_COLOR = "#fd6c00";

// Hex rengi verilen alfa (0-1) ile rgba'ya çevirir; geçersizse fallback turuncu döner
export function withAlpha(hex: string | null | undefined, alpha: number): string {
  const c = hex && isHexColor(hex) ? hex : DEFAULT_CLUB_COLOR;
  const r = parseInt(c.slice(1, 3), 16);
  const g = parseInt(c.slice(3, 5), 16);
  const b = parseInt(c.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Kart vurgu rengini güvenli şekilde döndürür
export function accentOf(hex: string | null | undefined): string {
  return hex && isHexColor(hex) ? hex : DEFAULT_CLUB_COLOR;
}
