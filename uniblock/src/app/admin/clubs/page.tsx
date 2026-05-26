import { prisma } from "@/lib/prisma";
import { Shield, Users, Calendar, TrendingUp } from "lucide-react";
import ClubStatusActions from "./ClubStatusActions";

export default async function AdminClubsPage() {
  const clubs = await prisma.club.findMany({
    orderBy: [
      { status: "asc" },
      { performanceScore: "desc" }
    ],
    include: {
      leader: { select: { name: true, email: true } },
      _count: { select: { members: true, events: true, posts: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.2em]">Yönetim / Kulüpler</span>
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">Kulüp Yönetimi</h1>
        <p className="text-sm text-white/40 mt-1">Sistemde {clubs.length} kulüp kayıtlı.</p>
      </div>

      <div className="bg-[#181a24] border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Tüm Kulüpler</h2>
        </div>
        <div className="grid grid-cols-[1fr_1fr_80px_80px_80px_80px_100px] px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Kulüp Adı</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Başkan</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center">Üye</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center">Puan</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center">Durum</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center">İşlem</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {clubs.length > 0 ? clubs.map((club) => (
            <div key={club.id} className="grid grid-cols-[1fr_1fr_80px_80px_80px_80px_100px] px-5 py-3 hover:bg-white/[0.02] transition-colors items-center">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[12px] font-semibold text-white truncate block">{club.name}</span>
                  <span className="text-[10px] text-white/25 truncate block">/{club.slug}</span>
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-white/50 truncate block">{club.leader.name}</span>
                <span className="text-[10px] text-white/25 truncate block">{club.leader.email}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-blue-400/50" />
                <span className="text-[11px] font-bold text-blue-400">{club._count.members}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400/50" />
                <span className="text-[11px] font-bold text-emerald-400">{club.performanceScore}</span>
              </div>
              <div className="flex justify-center">
                <span className={`text-[9px] font-black px-2 py-0.5 uppercase tracking-widest ${
                  club.status === "PENDING" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                  club.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {club.status === "PENDING" ? "Bekliyor" : club.status === "ACTIVE" ? "Aktif" : "Kapalı"}
                </span>
              </div>
              <ClubStatusActions clubId={club.id} status={club.status} />
            </div>
          )) : (
            <div className="px-5 py-12 text-center text-[12px] text-white/20 font-medium">Henüz kulüp oluşturulmamış.</div>
          )}
        </div>
      </div>
    </div>
  );
}

