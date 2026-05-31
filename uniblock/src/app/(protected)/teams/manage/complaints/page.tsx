import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import { ShieldAlert, CheckCircle2 } from "lucide-react";

export default async function TeamAdminComplaintsPage() {
  // Takım gönderilerine ait şikayetleri çekiyoruz
  const reports = await (prisma as any).report.findMany({
    where: {
      interaction: {
        post: {
          teamId: { not: null }
        }
      }
    },
    include: {
      reporter: { select: { name: true, email: true } },
      interaction: {
        include: {
          user: { select: { name: true } },
          post: {
            include: {
              team: { select: { name: true } }
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }) as any[];

  const statusChip = (status: string) =>
    status === "PENDING" ? "bg-destructive/10 text-destructive" :
    status === "RESOLVED" ? "bg-emerald-100 text-emerald-700" : "bg-surface-container-high text-on-surface-variant";

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-[color:var(--community-orange-deep)]" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-on-surface">Takım Şikayetleri</h1>
            <p className="text-on-surface-variant text-[13px] mt-0.5">Takım Yönetim Paneli</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="bg-card rounded-xl border border-outline-variant shadow-ambient p-6 md:p-8 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusChip(report.status)}`}>{report.status}</span>
                    <span className="text-[12px] text-on-surface-variant">{new Date(report.createdAt).toLocaleString()}</span>
                  </div>

                  <h3 className="font-heading font-bold text-xl mb-3 text-on-surface">"{report.reason}"</h3>

                  <div className="bg-surface-container-low p-4 rounded-lg border-l-4 border-primary mb-4">
                    <p className="text-[14px] italic text-on-surface-variant mb-2">"{report.interaction.content}"</p>
                    <div className="flex justify-between items-end">
                      <span className="text-[12px] text-on-surface-variant">Yazar: {report.interaction.user.name}</span>
                      <span className="text-[12px] font-semibold text-accent">Takım: {report.interaction.post?.team?.name || "Bireysel"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[13px]">
                    <span className="text-on-surface-variant">Bildiren:</span>
                    <span className="font-semibold text-on-surface">{report.reporter.name} ({report.reporter.email})</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-2 min-w-[200px]">
                  <div className="p-4 border border-dashed border-outline-variant rounded-xl text-center">
                    <p className="text-[12px] font-medium text-on-surface-variant mb-2">Post Sahibi Bildirildi mi?</p>
                    <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold text-[13px]">
                      <CheckCircle2 className="w-4 h-4" /> EVET
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center border border-dashed border-outline-variant rounded-xl">
              <p className="text-on-surface-variant font-medium">Henüz hiç şikayet kaydı yok.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
