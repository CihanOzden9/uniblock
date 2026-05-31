"use client";

import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import {
  Calendar, ChevronLeft, ChevronRight, CalendarClock, MapPin, Clock, CheckCircle2
} from "lucide-react";
import MessagingOverlay from "@/components/shared/MessagingOverlay";
import { useState, useMemo } from "react";

interface EventsClientProps {
  user: any;
  myEvents: any[];
  calendarEvents: any[];
}

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];
const WEEKDAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const CHIP_COLORS = [
  "bg-primary text-white",
  "bg-accent text-white",
  "bg-primary-container text-white",
];

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export default function EventsClient({ user, myEvents, calendarEvents }: EventsClientProps) {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [activeTab, setActiveTab] = useState<"calendar" | "joined">("calendar");

  // Etkinlikleri gün anahtarına göre grupla (renk indeksi sabit kalsın diye sırayla)
  const eventsByDay = useMemo(() => {
    const map = new Map<string, { ev: any; color: string }[]>();
    calendarEvents.forEach((ev, idx) => {
      const d = new Date(ev.date);
      const key = dayKey(d);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push({ ev, color: CHIP_COLORS[idx % CHIP_COLORS.length] });
    });
    return map;
  }, [calendarEvents]);

  // Görüntülenen ay için takvim hücreleri (Pazartesi başlangıçlı)
  const cells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Pzt=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr: (Date | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [viewDate]);

  // Sağ panel: bugünden itibaren yaklaşan etkinlikler
  const upcoming = useMemo(() => {
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return calendarEvents
      .filter(e => new Date(e.date) >= t)
      .sort((a, b) => +new Date(a.date) - +new Date(b.date))
      .slice(0, 6);
  }, [calendarEvents]);

  const goPrev = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goNext = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const isToday = (d: Date) => dayKey(d) === dayKey(today);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar user={user} />

      <main className="flex-1 pt-20">
        {/* Hero bandı */}
        <header className="w-full bg-surface-container-low py-12 px-margin-mobile md:px-margin-desktop border-b border-outline-variant">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-[12px] font-semibold tracking-wide uppercase text-primary">Etkinlikler</span>
              </div>
              <h1 className="font-heading text-[clamp(32px,4.5vw,48px)] font-bold tracking-tight leading-[1.1] mt-2 text-on-surface">
                Etkinlik Takvimi
              </h1>
              <p className="text-[16px] leading-[1.6] text-on-surface-variant max-w-[640px] mt-2">
                Kampüsteki tüm etkinlikleri takvim üzerinde keşfet ve hiçbir şeyi kaçırma.
              </p>
            </div>

            {/* Sekme: Takvim / Katıldıklarım */}
            <div className="flex gap-1 bg-surface p-1 rounded-full border border-outline-variant shrink-0 w-fit">
              <button
                onClick={() => setActiveTab("calendar")}
                className={`px-5 py-2 rounded-full text-[14px] font-medium transition-colors flex items-center gap-2 ${activeTab === "calendar" ? "bg-primary text-white" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                <Calendar className="w-4 h-4" /> Takvim
              </button>
              <button
                onClick={() => setActiveTab("joined")}
                className={`px-5 py-2 rounded-full text-[14px] font-medium transition-colors flex items-center gap-2 ${activeTab === "joined" ? "bg-primary text-white" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                <CheckCircle2 className="w-4 h-4" /> Katıldıklarım
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${activeTab === "joined" ? "bg-white/20 text-white" : "bg-primary-fixed text-primary"}`}>{myEvents.length}</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-[1280px] mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
          {activeTab === "calendar" ? (
            <div className="flex flex-col lg:flex-row gap-gutter">
              {/* Sol: Takvim grid */}
              <div className="flex-1 min-w-0">
                <div className="bg-card rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
                  {/* Ay başlığı + navigasyon */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant bg-surface-container-low">
                    <button onClick={goPrev} className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="font-heading text-xl font-bold tracking-tight text-on-surface">
                      {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </h2>
                    <button onClick={goNext} className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Hafta günleri */}
                  <div className="grid grid-cols-7 border-b border-outline-variant">
                    {WEEKDAYS.map(w => (
                      <div key={w} className="py-2.5 text-center text-[12px] font-semibold text-on-surface-variant">{w}</div>
                    ))}
                  </div>

                  {/* Gün hücreleri */}
                  <div className="grid grid-cols-7">
                    {cells.map((cell, i) => {
                      if (!cell) return <div key={i} className="min-h-[92px] border-b border-r border-outline-variant/60 bg-surface-container-low/40" />;
                      const dayEvents = eventsByDay.get(dayKey(cell)) || [];
                      return (
                        <div key={i} className={`min-h-[92px] border-b border-r border-outline-variant/60 p-1.5 ${isToday(cell) ? "bg-primary-fixed/30" : "hover:bg-surface-container-low transition-colors"}`}>
                          <span className={`text-[13px] block mb-1 ${isToday(cell) ? "font-bold text-primary" : "text-on-surface"}`}>
                            {cell.getDate()}
                          </span>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map(({ ev, color }) => (
                              <div key={ev.id} title={ev.title} className={`${color} text-[10px] font-medium rounded px-1.5 py-0.5 truncate cursor-pointer hover:opacity-80`}>
                                {ev.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <span className="text-[10px] text-on-surface-variant font-medium pl-1">+{dayEvents.length - 2} daha</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sağ: Yaklaşan Etkinlikler + Toplam Puan */}
              <aside className="w-full lg:w-80 shrink-0 space-y-stack-md">
                <div className="bg-card rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
                  <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low">
                    <h3 className="font-heading text-[18px] font-bold tracking-tight text-on-surface flex items-center gap-2">
                      <CalendarClock className="w-5 h-5 text-primary" /> Yaklaşan Etkinlikler
                    </h3>
                  </div>
                  <div className="p-stack-md space-y-1">
                    {upcoming.length > 0 ? upcoming.map((ev, idx) => {
                      const d = new Date(ev.date);
                      const colorBox = idx % 2 === 0 ? "bg-primary-fixed text-primary" : "bg-accent/15 text-[color:var(--community-orange-deep)]";
                      return (
                        <div key={ev.id} className="flex gap-3 p-2 -mx-2 rounded-lg hover:bg-surface-container-low transition-colors group cursor-pointer">
                          <div className={`w-12 h-12 rounded-lg ${colorBox} flex flex-col items-center justify-center shrink-0`}>
                            <span className="text-[11px] font-semibold uppercase leading-none">{MONTHS[d.getMonth()].slice(0, 3)}</span>
                            <span className="text-[18px] font-bold leading-none mt-0.5">{d.getDate()}</span>
                          </div>
                          <div className="min-w-0 flex flex-col justify-center">
                            <h4 className="text-[14px] font-semibold text-on-surface group-hover:text-primary transition-colors truncate">{ev.title}</h4>
                            <p className="text-[12px] text-on-surface-variant truncate flex items-center gap-1">
                              <MapPin className="w-3 h-3 shrink-0" /> {ev.location || ev.source}
                            </p>
                          </div>
                        </div>
                      );
                    }) : (
                      <p className="text-[13px] text-on-surface-variant text-center py-6">Yaklaşan etkinlik yok.</p>
                    )}
                  </div>
                </div>

                {/* Katılım puanı kartı */}
                <div className="bg-primary rounded-xl shadow-ambient p-5 text-white">
                  <p className="text-[12px] font-semibold uppercase tracking-wide opacity-80">Toplam Katılım Puanın</p>
                  <p className="font-heading text-4xl font-bold mt-1.5">
                    {myEvents.reduce((acc, c) => acc + (c.points || 0), 0)}
                  </p>
                  <p className="text-[13px] opacity-90 mt-1">{myEvents.length} etkinliğe katıldın</p>
                </div>
              </aside>
            </div>
          ) : (
            /* Katıldıklarım sekmesi */
            myEvents.length > 0 ? (
              <div className="bg-card rounded-xl border border-outline-variant shadow-ambient overflow-hidden max-w-3xl">
                <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
                  <h3 className="font-heading text-[18px] font-bold tracking-tight text-on-surface flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> Katıldığım Etkinlikler
                  </h3>
                  <span className="text-[12px] text-on-surface-variant">{myEvents.length} etkinlik</span>
                </div>
                <div className="divide-y divide-outline-variant">
                  {myEvents.map((ev) => {
                    const d = new Date(ev.date);
                    return (
                      <div key={ev.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-primary-fixed text-primary flex flex-col items-center justify-center shrink-0">
                          <span className="text-[11px] font-semibold uppercase leading-none">{MONTHS[d.getMonth()].slice(0, 3)}</span>
                          <span className="text-[18px] font-bold leading-none mt-0.5">{d.getDate()}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[15px] font-semibold text-on-surface truncate">{ev.title}</h4>
                          <p className="text-[12px] text-on-surface-variant truncate flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 shrink-0" /> {ev.location || ev.source}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-on-surface-variant">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(ev.joinedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                          <p className="text-[11px] text-on-surface-variant mt-0.5">tarihinde katıldın</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-outline-variant shadow-ambient p-16 text-center max-w-3xl">
                <div className="w-16 h-16 rounded-full bg-primary-fixed mx-auto mb-5 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold tracking-tight mb-1.5">Henüz Bir Etkinliğe Katılmadın</h3>
                <p className="text-[14px] text-on-surface-variant mb-6">Akıştan veya takvimden ilgini çeken etkinliklere katıl.</p>
                <Link href="/feed">
                  <button className="rounded-full text-[14px] font-semibold bg-primary text-white hover:bg-primary-container transition-colors px-6 h-11">Etkinlikleri Keşfet</button>
                </Link>
              </div>
            )
          )}
        </div>
      </main>

      <footer className="mt-auto bg-card border-t border-outline-variant px-margin-desktop py-stack-lg shrink-0">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="font-heading font-extrabold text-[20px] text-primary">
            Uni<span className="text-accent">.</span>Block
          </div>
          <div className="flex gap-8 text-[14px] font-medium text-on-surface-variant">
            <Link href="#" className="hover:text-primary transition-colors">Hakkımızda</Link>
            <Link href="#" className="hover:text-primary transition-colors">İletişim</Link>
            <Link href="#" className="hover:text-primary transition-colors">Gizlilik</Link>
          </div>
          <p className="text-[13px] text-on-surface-variant">© 2026 Kampüs Haber Ağı</p>
        </div>
      </footer>

      <MessagingOverlay />
    </div>
  );
}
