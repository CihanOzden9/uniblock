import { prisma } from "@/lib/prisma";
import { Shield, Users, Calendar, TrendingUp } from "lucide-react";
import ClubStatusActions from "./ClubStatusActions";
import AdminFilters from "../AdminFilters";

export default async function AdminClubsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const status = sp.status || "";

  const where: any = {};
  if (q) where.OR = [
    { name: { contains: q, mode: "insensitive" } },
    { slug: { contains: q, mode: "insensitive" } },
  ];
  if (status) where.status = status;

  const clubs = await prisma.club.findMany({
    where,
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
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em]">Yönetim / Kulüpler</span>
        </div>
        <h1 className="text-3xl font-heading font-bold text-on-surface tracking-tight">Kulüp Yönetimi</h1>
        <p className="text-sm text-on-surface-variant mt-1">{clubs.length} kulüp listeleniyor.</p>
      </div>

      <AdminFilters
        searchPlaceholder="Kulüp adı ara..."
        selects={[
          { key: "status", label: "Tüm Durumlar", options: [
            { value: "ACTIVE", label: "Aktif" },
            { value: "PENDING", label: "Bekliyor" },
            { value: "REJECTED", label: "Reddedilmiş" },
            { value: "BANNED", label: "Engelli" },
          ] },
        ]}
      />

      <div className="bg-card rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant">
          <h2 className="text-[14px] font-bold text-on-surface tracking-tight">Tüm Kulüpler</h2>
        </div>
        <div className="grid grid-cols-[1fr_1fr_80px_80px_80px_80px_100px] px-5 py-3 border-b border-outline-variant bg-surface-container-low">
          <span className="text-[11px] font-semibold text-on-surface-variant">Kulüp Adı</span>
          <span className="text-[11px] font-semibold text-on-surface-variant">Başkan</span>
          <span className="text-[11px] font-semibold text-on-surface-variant text-center">Üye</span>
          <span className="text-[11px] font-semibold text-on-surface-variant text-center">Puan</span>
          <span className="text-[11px] font-semibold text-on-surface-variant text-center">Durum</span>
          <span className="text-[11px] font-semibold text-on-surface-variant text-center">İşlem</span>
        </div>
        <div className="divide-y divide-outline-variant">
          {clubs.length > 0 ? clubs.map((club) => (
            <div key={club.id} className="grid grid-cols-[1fr_1fr_80px_80px_80px_80px_100px] px-5 py-3 hover:bg-surface-container-low transition-colors items-center">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <span className="text-[13px] font-semibold text-on-surface truncate block">{club.name}</span>
                  <span className="text-[11px] text-on-surface-variant truncate block">/{club.slug}</span>
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-[12px] text-on-surface truncate block">{club.leader.name}</span>
                <span className="text-[11px] text-on-surface-variant truncate block">{club.leader.email}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-primary" />
                <span className="text-[12px] font-bold text-primary">{club._count.members}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3 text-accent" />
                <span className="text-[12px] font-bold text-accent">{club.performanceScore}</span>
              </div>
              <div className="flex justify-center">
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                  club.status === "PENDING" ? "bg-accent/15 text-[color:var(--community-orange-deep)]" :
                  club.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {club.status === "PENDING" ? "Bekliyor" : club.status === "ACTIVE" ? "Aktif" : "Kapalı"}
                </span>
              </div>
              <ClubStatusActions clubId={club.id} status={club.status} />
            </div>
          )) : (
            <div className="px-5 py-12 text-center text-[12px] text-on-surface-variant font-medium">{(q || status) ? "Filtreye uygun kulüp bulunamadı." : "Henüz kulüp oluşturulmamış."}</div>
          )}
        </div>
      </div>
    </div>
  );
}

