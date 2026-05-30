import { prisma } from "@/lib/prisma";
import { Calendar, Clock, MapPin, Shield, Ban, BarChart3 } from "lucide-react";
import { CancelEventButton, CreateEventButton } from "./EventActions";

export default async function AdminEventsPage() {
  const [events, clubs] = await Promise.all([
    prisma.event.findMany({
      orderBy: { date: "desc" },
      include: {
        organizer: { select: { id: true, name: true } },
        _count: { select: { interactions: true } },
      },
    }),
    prisma.club.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const now = new Date();
  const past = events.filter(e => new Date(e.date) < now && !e.cancelled);
  const upcoming = events.filter(e => new Date(e.date) >= now && !e.cancelled);
  const cancelled = events.filter(e => e.cancelled);

  const totalAttendance = past.reduce((sum, e) => sum + e._count.interactions, 0);
  const avgAttendance = past.length > 0 ? Math.round(totalAttendance / past.length) : 0;

  const clubStats = events.reduce((acc: Record<string, { name: string; count: number; past: number }>, e) => {
    if (!e.organizer) return acc;
    const id = e.organizer.id;
    if (!acc[id]) acc[id] = { name: e.organizer.name, count: 0, past: 0 };
    acc[id].count++;
    if (new Date(e.date) < now && !e.cancelled) acc[id].past++;
    return acc;
  }, {});
  const topClubs = Object.values(clubStats).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.2em]">Yönetim / Etkinlikler</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">Etkinlik Yönetimi</h1>
          <p className="text-sm text-white/40 mt-1">Tüm kulüplerin etkinliklerini görüntüle, yönet ve oluştur.</p>
        </div>
        <CreateEventButton clubs={clubs} />
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#181a24] border border-emerald-500/20 p-5">
          <div className="text-2xl font-heading font-black text-emerald-400">{upcoming.length}</div>
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Yaklaşan</div>
        </div>
        <div className="bg-[#181a24] border border-white/[0.06] p-5">
          <div className="text-2xl font-heading font-black text-white/60">{past.length}</div>
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Tamamlanan</div>
        </div>
        <div className="bg-[#181a24] border border-red-500/20 p-5">
          <div className="text-2xl font-heading font-black text-red-400">{cancelled.length}</div>
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">İptal Edilen</div>
        </div>
        <div className="bg-[#181a24] border border-blue-500/20 p-5">
          <div className="text-2xl font-heading font-black text-blue-400">{avgAttendance}</div>
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Ort. Katılım</div>
        </div>
      </div>

      {/* En Aktif Kulüpler */}
      {topClubs.length > 0 && (
        <div className="bg-[#181a24] border border-white/[0.06] p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <h2 className="text-[12px] font-bold text-white/60 uppercase tracking-widest">En Aktif Kulüpler</h2>
          </div>
          <div className="space-y-3">
            {topClubs.map((club, i) => {
              const pct = topClubs[0].count > 0 ? Math.round((club.count / topClubs[0].count) * 100) : 0;
              return (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-[11px] text-white/30 w-4 text-right">{i + 1}</span>
                  <span className="text-[12px] font-semibold text-white w-48 truncate">{club.name}</span>
                  <div className="flex-1 bg-white/[0.04] h-1.5">
                    <div className="bg-amber-400 h-1.5 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] text-white/40 w-16 text-right">{club.count} etkinlik</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Etkinlik Listesi */}
      <div className="bg-[#181a24] border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Tüm Etkinlikler</h2>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{events.length} Etkinlik</span>
        </div>
        <div className="grid grid-cols-[1fr_150px_150px_120px_100px_100px_50px] px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Etkinlik</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Kulüp</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Konum</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tarih</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center">Kapasite</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center">Durum</span>
          <span />
        </div>
        <div className="divide-y divide-white/[0.04]">
          {events.length > 0 ? events.map((event) => {
            const isPast = new Date(event.date) < now;
            return (
              <div key={event.id} className={`grid grid-cols-[1fr_150px_150px_120px_100px_100px_50px] px-5 py-3 hover:bg-white/[0.02] transition-colors items-center ${event.cancelled ? "opacity-50" : ""}`}>
                <div className="min-w-0">
                  <span className="text-[12px] font-semibold text-white truncate block">{event.title}</span>
                  {event.cancelled && (
                    <span className="text-[10px] text-red-400/70 truncate block">İptal: {event.cancelReason}</span>
                  )}
                  {!event.cancelled && (
                    <span className="text-[10px] text-white/25 truncate block">{event.description.substring(0, 50)}…</span>
                  )}
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Shield className="w-3 h-3 text-emerald-400/50 shrink-0" />
                  <span className="text-[11px] text-white/50 truncate">{event.organizer?.name ?? "—"}</span>
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="w-3 h-3 text-white/20 shrink-0" />
                  <span className="text-[11px] text-white/40 truncate">{event.location || "Belirtilmemiş"}</span>
                </div>
                <div className="flex items-center gap-1 text-white/30">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-medium">{new Date(event.date).toLocaleDateString("tr-TR")}</span>
                </div>
                <span className="text-[11px] font-bold text-blue-400 text-center">{event.capacity || "∞"}</span>
                <div className="flex justify-center">
                  <span className={`text-[9px] font-black px-2 py-0.5 uppercase tracking-widest ${
                    event.cancelled ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : isPast ? "bg-white/[0.04] text-white/30 border border-white/[0.06]"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {event.cancelled ? "İptal" : isPast ? "Tamamlandı" : "Aktif"}
                  </span>
                </div>
                <div className="flex justify-end">
                  {!event.cancelled && (
                    <CancelEventButton eventId={event.id} title={event.title} />
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="px-5 py-12 text-center text-[12px] text-white/20 font-medium">Henüz etkinlik oluşturulmamış.</div>
          )}
        </div>
      </div>
    </div>
  );
}
