import { PrismaClient } from "@prisma/client";
import Navbar from "@/components/layout/Navbar";
import { ShieldAlert, CheckCircle2 } from "lucide-react";

const prisma = new PrismaClient();

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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-32 pb-20 px-8 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <ShieldAlert className="w-10 h-10 text-accent" />
          <div>
            <h1 className="font-heading text-4xl font-black uppercase tracking-tighter">Takım Şikayetleri</h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Takım Yönetim Paneli</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-[10px] font-black px-2 py-1 uppercase tracking-widest ${
                      report.status === "PENDING" ? "bg-red-500 text-white" :
                      report.status === "RESOLVED" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                      {report.status}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(report.createdAt).toLocaleString()}</span>
                  </div>

                  <h3 className="font-bold text-xl mb-2">"{report.reason}"</h3>

                  <div className="bg-gray-50 p-4 border-l-4 border-black mb-4">
                    <p className="text-sm italic text-gray-600 mb-2">"{report.interaction.content}"</p>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold uppercase text-gray-400">Yazar: {report.interaction.user.name}</span>
                      <span className="text-[10px] font-black uppercase text-accent">Takım: {report.interaction.post?.team?.name || "Bireysel"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="font-bold text-gray-400 uppercase">Bildiren:</span>
                    <span className="font-black underline">{report.reporter.name} ({report.reporter.email})</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-2 min-w-[200px]">
                   <div className="p-4 border-2 border-dashed border-gray-200 text-center">
                     <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Post Sahibi Bildirildi mi?</p>
                     <div className="flex items-center justify-center gap-2 text-green-600 font-black text-xs">
                       <CheckCircle2 className="w-4 h-4" /> EVET
                     </div>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold uppercase tracking-widest">Henüz hiç şikayet kaydı yok.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
