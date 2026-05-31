import { prisma } from "@/lib/prisma";
import { AlertTriangle, Clock } from "lucide-react";
import ReportActions from "./ReportActions";

export default async function AdminComplaintsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reporter: { select: { name: true, email: true } },
      interaction: {
        include: {
          user: { select: { name: true } },
          post: { select: { title: true, club: { select: { name: true } } } },
        },
      },
    },
  });

  const pending = reports.filter(r => r.status === "PENDING");
  const resolved = reports.filter(r => r.status === "RESOLVED");
  const dismissed = reports.filter(r => r.status === "DISMISSED");

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5 text-accent" />
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em]">Yönetim / Şikâyetler</span>
        </div>
        <h1 className="text-3xl font-heading font-bold text-on-surface tracking-tight">Şikâyet Yönetimi</h1>
        <p className="text-sm text-on-surface-variant mt-1">{pending.length} bekleyen, {resolved.length} çözümlenen şikâyet.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-outline-variant shadow-ambient p-5">
          <div className="text-2xl font-heading font-bold text-accent">{pending.length}</div>
          <div className="text-[12px] font-medium text-on-surface-variant mt-1">Bekleyen</div>
        </div>
        <div className="bg-card rounded-xl border border-outline-variant shadow-ambient p-5">
          <div className="text-2xl font-heading font-bold text-emerald-600">{resolved.length}</div>
          <div className="text-[12px] font-medium text-on-surface-variant mt-1">Çözümlenen</div>
        </div>
        <div className="bg-card rounded-xl border border-outline-variant shadow-ambient p-5">
          <div className="text-2xl font-heading font-bold text-on-surface-variant">{dismissed.length}</div>
          <div className="text-[12px] font-medium text-on-surface-variant mt-1">Reddedilen</div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant">
          <h2 className="text-[14px] font-bold text-on-surface tracking-tight">Tüm Şikâyetler</h2>
        </div>
        <div className="grid grid-cols-[1fr_1fr_1fr_110px_90px_120px] px-5 py-3 border-b border-outline-variant bg-surface-container-low">
          <span className="text-[11px] font-semibold text-on-surface-variant">Şikâyet Eden</span>
          <span className="text-[11px] font-semibold text-on-surface-variant">Hedef İçerik</span>
          <span className="text-[11px] font-semibold text-on-surface-variant">Sebep</span>
          <span className="text-[11px] font-semibold text-on-surface-variant">Tarih</span>
          <span className="text-[11px] font-semibold text-on-surface-variant text-center">Durum</span>
          <span className="text-[11px] font-semibold text-on-surface-variant text-right">Aksiyonlar</span>
        </div>
        <div className="divide-y divide-outline-variant">
          {reports.length > 0 ? reports.map((report) => (
            <div key={report.id} className="grid grid-cols-[1fr_1fr_1fr_110px_90px_120px] px-5 py-3 hover:bg-surface-container-low transition-colors items-center">
              <div className="min-w-0">
                <span className="text-[13px] font-semibold text-on-surface truncate block">{report.reporter.name}</span>
                <span className="text-[11px] text-on-surface-variant truncate block">{report.reporter.email}</span>
              </div>
              <div className="min-w-0">
                <span className="text-[12px] text-on-surface truncate block">{report.interaction?.post?.title || "Yorum"}</span>
                <span className="text-[11px] text-on-surface-variant truncate block">Yazan: {report.interaction?.user?.name || "—"}</span>
              </div>
              <span className="text-[12px] text-on-surface-variant truncate">{report.reason || "Belirtilmemiş"}</span>
              <div className="flex items-center gap-1 text-on-surface-variant">
                <Clock className="w-3 h-3" />
                <span className="text-[11px] font-medium">{new Date(report.createdAt).toLocaleDateString("tr-TR")}</span>
              </div>
              <div className="flex justify-center">
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                  report.status === "PENDING" ? "bg-accent/15 text-[color:var(--community-orange-deep)]"
                  : report.status === "RESOLVED" ? "bg-emerald-100 text-emerald-700"
                  : "bg-surface-container-high text-on-surface-variant"
                }`}>
                  {report.status === "PENDING" ? "Bekliyor" : report.status === "RESOLVED" ? "Çözüldü" : "Reddedildi"}
                </span>
              </div>
              <ReportActions reportId={report.id} status={report.status} />
            </div>
          )) : (
            <div className="px-5 py-12 text-center">
              <AlertTriangle className="w-8 h-8 text-outline-variant mx-auto mb-2" />
              <p className="text-[12px] text-on-surface-variant font-medium">Hiç şikâyet kaydı yok.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
