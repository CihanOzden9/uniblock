import { prisma } from "@/lib/prisma";
import { Users2, Users, Calendar } from "lucide-react";
import TeamStatusActions from "./TeamStatusActions";

export default async function AdminTeamsPage() {
  const teams = await prisma.team.findMany({
    orderBy: [
      { status: "asc" },
      { createdAt: "desc" }
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
          <Users2 className="w-5 h-5 text-primary" />
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em]">Yönetim / Takımlar</span>
        </div>
        <h1 className="text-3xl font-heading font-bold text-on-surface tracking-tight">Takım Yönetimi</h1>
        <p className="text-sm text-on-surface-variant mt-1">Sistemde {teams.length} takım kayıtlı.</p>
      </div>

      <div className="bg-card rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant">
          <h2 className="text-[14px] font-bold text-on-surface tracking-tight">Tüm Takımlar</h2>
        </div>
        <div className="grid grid-cols-[1fr_1fr_80px_80px_80px_100px] px-5 py-3 border-b border-outline-variant bg-surface-container-low">
          <span className="text-[11px] font-semibold text-on-surface-variant">Takım Adı</span>
          <span className="text-[11px] font-semibold text-on-surface-variant">Kaptan</span>
          <span className="text-[11px] font-semibold text-on-surface-variant text-center">Üye</span>
          <span className="text-[11px] font-semibold text-on-surface-variant text-center">Etkinlik</span>
          <span className="text-[11px] font-semibold text-on-surface-variant text-center">Durum</span>
          <span className="text-[11px] font-semibold text-on-surface-variant text-center">İşlem</span>
        </div>
        <div className="divide-y divide-outline-variant">
          {teams.length > 0 ? teams.map((team) => (
            <div key={team.id} className="grid grid-cols-[1fr_1fr_80px_80px_80px_100px] px-5 py-3 hover:bg-surface-container-low transition-colors items-center">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                  <Users2 className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <span className="text-[13px] font-semibold text-on-surface truncate block">{team.name}</span>
                  <span className="text-[11px] text-on-surface-variant truncate block">/{team.slug}</span>
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-[12px] text-on-surface truncate block">{team.leader.name}</span>
                <span className="text-[11px] text-on-surface-variant truncate block">{team.leader.email}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-primary" />
                <span className="text-[12px] font-bold text-primary">{team._count.members}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3 text-accent" />
                <span className="text-[12px] font-bold text-accent">{team._count.events}</span>
              </div>
              <div className="flex justify-center">
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                  team.status === "PENDING" ? "bg-accent/15 text-[color:var(--community-orange-deep)]" :
                  team.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {team.status === "PENDING" ? "Bekliyor" : team.status === "ACTIVE" ? "Aktif" : "Kapalı"}
                </span>
              </div>
              <TeamStatusActions teamId={team.id} status={team.status} />
            </div>
          )) : (
            <div className="px-5 py-12 text-center text-[12px] text-on-surface-variant font-medium">Henüz takım oluşturulmamış.</div>
          )}
        </div>
      </div>
    </div>
  );
}
