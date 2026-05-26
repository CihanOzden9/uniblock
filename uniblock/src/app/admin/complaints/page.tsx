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
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.2em]">Yönetim / Şikâyetler</span>
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">Şikâyet Yönetimi</h1>
        <p className="text-sm text-white/40 mt-1">{pending.length} bekleyen, {resolved.length} çözümlenen şikâyet.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#181a24] border border-red-500/20 p-5">
          <div className="text-2xl font-heading font-black text-red-400">{pending.length}</div>
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Bekleyen</div>
        </div>
        <div className="bg-[#181a24] border border-emerald-500/20 p-5">
          <div className="text-2xl font-heading font-black text-emerald-400">{resolved.length}</div>
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Çözümlenen</div>
        </div>
        <div className="bg-[#181a24] border border-white/[0.06] p-5">
          <div className="text-2xl font-heading font-black text-white/50">{dismissed.length}</div>
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Reddedilen</div>
        </div>
      </div>

      <div className="bg-[#181a24] border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Tüm Şikâyetler</h2>
        </div>
        <div className="grid grid-cols-[1fr_1fr_1fr_110px_90px_120px] px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Şikâyet Eden</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Hedef İçerik</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Sebep</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tarih</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center">Durum</span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-right">Aksiyonlar</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {reports.length > 0 ? reports.map((report) => (
            <div key={report.id} className="grid grid-cols-[1fr_1fr_1fr_110px_90px_120px] px-5 py-3 hover:bg-white/[0.02] transition-colors items-center">
              <div className="min-w-0">
                <span className="text-[12px] font-semibold text-white truncate block">{report.reporter.name}</span>
                <span className="text-[10px] text-white/25 truncate block">{report.reporter.email}</span>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-white/50 truncate block">{report.interaction?.post?.title || "Yorum"}</span>
                <span className="text-[10px] text-white/25 truncate block">Yazan: {report.interaction?.user?.name || "—"}</span>
              </div>
              <span className="text-[11px] text-white/40 truncate">{report.reason || "Belirtilmemiş"}</span>
              <div className="flex items-center gap-1 text-white/30">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-medium">{new Date(report.createdAt).toLocaleDateString("tr-TR")}</span>
              </div>
              <div className="flex justify-center">
                <span className={`text-[9px] font-black px-2 py-0.5 uppercase tracking-widest ${
                  report.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : report.status === "RESOLVED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-white/[0.04] text-white/30 border border-white/[0.06]"
                }`}>
                  {report.status === "PENDING" ? "Bekliyor" : report.status === "RESOLVED" ? "Çözüldü" : "Reddedildi"}
                </span>
              </div>
              <ReportActions reportId={report.id} status={report.status} />
            </div>
          )) : (
            <div className="px-5 py-12 text-center">
              <AlertTriangle className="w-8 h-8 text-white/10 mx-auto mb-2" />
              <p className="text-[12px] text-white/20 font-medium">Hiç şikâyet kaydı yok.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
