import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import {
  Users, Shield, Calendar, AlertTriangle,
  TrendingUp, Activity, Clock, ArrowUpRight,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  const [
    activeStudents, activeClubs, totalEvents, pendingComplaints,
    totalPosts, totalInteractions, recentUsers, recentClubs, recentReports,
    pendingStudents, pendingClubs, activeTeams, pendingTeams
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT", status: "ACTIVE" } }),
    prisma.club.count({ where: { status: "ACTIVE" } }),
    prisma.event.count(),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.post.count(),
    prisma.interaction.count(),
    prisma.user.findMany({
      where: { role: "STUDENT" }, orderBy: { createdAt: "desc" }, take: 5,
      select: { id: true, name: true, email: true, faculty: true, department: true, createdAt: true, image: true, status: true },
    }),
    prisma.club.findMany({
      orderBy: { createdAt: "desc" }, take: 5,
      select: { id: true, name: true, slug: true, performanceScore: true, createdAt: true, logo: true, status: true, _count: { select: { members: true, events: true } } },
    }),
    prisma.report.findMany({
      where: { status: "PENDING" }, orderBy: { createdAt: "desc" }, take: 5,
      include: {
        reporter: { select: { name: true } },
        interaction: { include: { user: { select: { name: true } }, post: { select: { title: true } } } },
      },
    }),
    prisma.user.count({ where: { role: "STUDENT", status: "PENDING" } }),
    prisma.club.count({ where: { status: "PENDING" } }),
    prisma.team.count({ where: { status: "ACTIVE" } }),
    prisma.team.count({ where: { status: "PENDING" } }),
  ]);

  const stats = [
    { label: "Aktif Öğrenci", value: activeStudents, icon: Users, color: "from-blue-500/20 to-blue-600/20", iconColor: "text-blue-400", borderColor: "border-blue-500/20", href: "/admin/students" },
    { label: "Aktif Kulüp", value: activeClubs, icon: Shield, color: "from-emerald-500/20 to-emerald-600/20", iconColor: "text-emerald-400", borderColor: "border-emerald-500/20", href: "/admin/clubs" },
    { label: "Aktif Takım", value: activeTeams, icon: Users, color: "from-teal-500/20 to-teal-600/20", iconColor: "text-teal-400", borderColor: "border-teal-500/20", href: "/admin/teams" },
    { label: "Etkinlik", value: totalEvents, icon: Calendar, color: "from-amber-500/20 to-amber-600/20", iconColor: "text-amber-400", borderColor: "border-amber-500/20", href: "/admin/events" },
    { label: "Bekleyen Şikâyet", value: pendingComplaints, icon: AlertTriangle, color: "from-red-500/20 to-red-600/20", iconColor: "text-red-400", borderColor: "border-red-500/20", href: "/admin/complaints" },
    { label: "Bekleyen Öğrenci", value: pendingStudents, icon: Clock, color: "from-orange-500/20 to-orange-600/20", iconColor: "text-orange-400", borderColor: "border-orange-500/20", href: "/admin/students?tab=pending" },
    { label: "Bekleyen Kulüp", value: pendingClubs, icon: Clock, color: "from-pink-500/20 to-pink-600/20", iconColor: "text-pink-400", borderColor: "border-pink-500/20", href: "/admin/clubs?tab=pending" },
    { label: "Bekleyen Takım", value: pendingTeams, icon: Clock, color: "from-teal-500/20 to-teal-600/20", iconColor: "text-teal-400", borderColor: "border-teal-500/20", href: "/admin/teams" },
  ];

  function timeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Az önce";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} dk önce`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    return `${days} gün önce`;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.2em]">Sistem Aktif</span>
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">
          Hoş geldin, {user?.name?.split(" ")[0] || "Admin"}
        </h1>
        <p className="text-sm text-white/40 mt-1">Sistem genelindeki tüm verileri buradan görüntüleyebilirsin.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link key={i} href={stat.href} className="group">
              <div className={`relative overflow-hidden bg-[#181a24] border ${stat.borderColor} p-5 transition-all duration-300 hover:border-white/20 hover:bg-[#1c1e2a]`}>
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${stat.color} opacity-50 blur-2xl -translate-y-6 translate-x-6`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 flex items-center justify-center bg-gradient-to-br ${stat.color} border ${stat.borderColor}`}>
                      <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                  </div>
                  <div className="text-3xl font-heading font-black text-white tracking-tight">{stat.value.toLocaleString("tr-TR")}</div>
                  <div className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Students */}
        <div className="bg-[#181a24] border border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Son Kayıt Olan Öğrenciler</h2>
            </div>
            <Link href="/admin/students" className="text-[10px] font-bold text-white/30 hover:text-blue-400 uppercase tracking-widest transition-colors">Tümü →</Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentUsers.length > 0 ? recentUsers.map((student) => (
              <div key={student.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-blue-400">{student.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??"}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-white truncate">{student.name}</p>
                  <p className="text-[10px] text-white/30 truncate">{student.faculty} — {student.department}</p>
                </div>
                <div className="flex items-center gap-1 text-white/20 shrink-0">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-medium">{timeAgo(student.createdAt)}</span>
                </div>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-[12px] text-white/20 font-medium">Henüz kayıtlı öğrenci yok.</div>
            )}
          </div>
        </div>

        {/* Recent Clubs */}
        <div className="bg-[#181a24] border border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Kulüpler</h2>
            </div>
            <Link href="/admin/clubs" className="text-[10px] font-bold text-white/30 hover:text-emerald-400 uppercase tracking-widest transition-colors">Tümü →</Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentClubs.length > 0 ? recentClubs.map((club) => (
              <div key={club.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-white truncate">{club.name}</p>
                  <p className="text-[10px] text-white/30">{club._count.members} Üye · {club._count.events} Etkinlik</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <TrendingUp className="w-3 h-3 text-emerald-400/50" />
                  <span className="text-[11px] font-bold text-emerald-400">{club.performanceScore} P</span>
                </div>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-[12px] text-white/20 font-medium">Henüz kulüp oluşturulmamış.</div>
            )}
          </div>
        </div>
      </div>

      {/* Pending Complaints */}
      <div className="bg-[#181a24] border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Bekleyen Şikâyetler</h2>
            {pendingComplaints > 0 && (
              <span className="text-[9px] font-black bg-red-500/20 text-red-400 px-2 py-0.5 border border-red-500/20 uppercase tracking-widest">{pendingComplaints} Bekliyor</span>
            )}
          </div>
          <Link href="/admin/complaints" className="text-[10px] font-bold text-white/30 hover:text-red-400 uppercase tracking-widest transition-colors">Tümünü Gör →</Link>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {recentReports.length > 0 ? recentReports.map((report: any) => (
            <div key={report.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors">
              <div className="w-8 h-8 bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-white truncate">{report.interaction?.post?.title || "Yorum Şikâyeti"}</p>
                <p className="text-[10px] text-white/30 truncate">Şikâyet eden: {report.reporter?.name} · Sebep: {report.reason || "Belirtilmemiş"}</p>
              </div>
              <span className="text-[9px] font-black bg-amber-500/10 text-amber-400 px-2 py-0.5 border border-amber-500/20 uppercase tracking-widest shrink-0">İncelenmedi</span>
              <div className="flex items-center gap-1 text-white/20 shrink-0">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-medium">{timeAgo(report.createdAt)}</span>
              </div>
            </div>
          )) : (
            <div className="px-5 py-8 text-center">
              <AlertTriangle className="w-8 h-8 text-white/10 mx-auto mb-2" />
              <p className="text-[12px] text-white/20 font-medium">Bekleyen şikâyet bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
