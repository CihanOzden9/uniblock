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
    { label: "Aktif Öğrenci", value: activeStudents, icon: Users, tone: "primary", href: "/admin/students" },
    { label: "Aktif Kulüp", value: activeClubs, icon: Shield, tone: "primary", href: "/admin/clubs" },
    { label: "Aktif Takım", value: activeTeams, icon: Users, tone: "primary", href: "/admin/teams" },
    { label: "Etkinlik", value: totalEvents, icon: Calendar, tone: "primary", href: "/admin/events" },
    { label: "Bekleyen Şikâyet", value: pendingComplaints, icon: AlertTriangle, tone: "accent", href: "/admin/complaints" },
    { label: "Bekleyen Öğrenci", value: pendingStudents, icon: Clock, tone: "accent", href: "/admin/students?tab=pending" },
    { label: "Bekleyen Kulüp", value: pendingClubs, icon: Clock, tone: "accent", href: "/admin/clubs?tab=pending" },
    { label: "Bekleyen Takım", value: pendingTeams, icon: Clock, tone: "accent", href: "/admin/teams" },
  ];

  const toneChip = (tone: string) =>
    tone === "accent"
      ? "bg-accent/15 text-[color:var(--community-orange-deep)]"
      : "bg-primary-fixed text-primary";

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
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em]">Sistem Aktif</span>
        </div>
        <h1 className="text-3xl font-heading font-bold text-on-surface tracking-tight">
          Genel Bakış
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Hoş geldin {user?.name?.split(" ")[0] || "Admin"} — platformun güncel durumunu buradan takip et.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link key={i} href={stat.href} className="group">
              <div className="bg-card rounded-xl border border-outline-variant shadow-ambient p-5 transition-all duration-300 hover:shadow-ambient-lg hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${toneChip(stat.tone)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
                </div>
                <div className="text-3xl font-heading font-bold text-on-surface tracking-tight">{stat.value.toLocaleString("tr-TR")}</div>
                <div className="text-[12px] font-medium text-on-surface-variant mt-1">{stat.label}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Students */}
        <div className="bg-card rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <h2 className="text-[14px] font-bold text-on-surface tracking-tight">Son Kayıt Olan Öğrenciler</h2>
            </div>
            <Link href="/admin/students" className="text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors">Tümü →</Link>
          </div>
          <div className="divide-y divide-outline-variant">
            {recentUsers.length > 0 ? recentUsers.map((student) => (
              <div key={student.id} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-primary">{student.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??"}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-on-surface truncate">{student.name}</p>
                  <p className="text-[11px] text-on-surface-variant truncate">{student.faculty} — {student.department}</p>
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant shrink-0">
                  <Clock className="w-3 h-3" />
                  <span className="text-[11px] font-medium">{timeAgo(student.createdAt)}</span>
                </div>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-[12px] text-on-surface-variant font-medium">Henüz kayıtlı öğrenci yok.</div>
            )}
          </div>
        </div>

        {/* Recent Clubs */}
        <div className="bg-card rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <h2 className="text-[14px] font-bold text-on-surface tracking-tight">Kulüpler</h2>
            </div>
            <Link href="/admin/clubs" className="text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors">Tümü →</Link>
          </div>
          <div className="divide-y divide-outline-variant">
            {recentClubs.length > 0 ? recentClubs.map((club) => (
              <div key={club.id} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-on-surface truncate">{club.name}</p>
                  <p className="text-[11px] text-on-surface-variant">{club._count.members} Üye · {club._count.events} Etkinlik</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <TrendingUp className="w-3 h-3 text-accent" />
                  <span className="text-[12px] font-bold text-accent">{club.performanceScore} P</span>
                </div>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-[12px] text-on-surface-variant font-medium">Henüz kulüp oluşturulmamış.</div>
            )}
          </div>
        </div>
      </div>

      {/* Pending Complaints */}
      <div className="bg-card rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-accent" />
            <h2 className="text-[14px] font-bold text-on-surface tracking-tight">Bekleyen Şikâyetler</h2>
            {pendingComplaints > 0 && (
              <span className="text-[10px] font-bold bg-accent/15 text-[color:var(--community-orange-deep)] px-2 py-0.5 rounded-full">{pendingComplaints} Bekliyor</span>
            )}
          </div>
          <Link href="/admin/complaints" className="text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors">Tümünü Gör →</Link>
        </div>
        <div className="divide-y divide-outline-variant">
          {recentReports.length > 0 ? recentReports.map((report: any) => (
            <div key={report.id} className="flex items-center gap-4 px-5 py-3 hover:bg-surface-container-low transition-colors">
              <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-[color:var(--community-orange-deep)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-on-surface truncate">{report.interaction?.post?.title || "Yorum Şikâyeti"}</p>
                <p className="text-[11px] text-on-surface-variant truncate">Şikâyet eden: {report.reporter?.name} · Sebep: {report.reason || "Belirtilmemiş"}</p>
              </div>
              <span className="text-[10px] font-bold bg-primary-fixed text-primary px-2 py-0.5 rounded-full shrink-0">İncelenmedi</span>
              <div className="flex items-center gap-1 text-on-surface-variant shrink-0">
                <Clock className="w-3 h-3" />
                <span className="text-[11px] font-medium">{timeAgo(report.createdAt)}</span>
              </div>
            </div>
          )) : (
            <div className="px-5 py-8 text-center">
              <AlertTriangle className="w-8 h-8 text-outline-variant mx-auto mb-2" />
              <p className="text-[12px] text-on-surface-variant font-medium">Bekleyen şikâyet bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
