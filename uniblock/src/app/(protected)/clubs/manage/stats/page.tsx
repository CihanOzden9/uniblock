import { getCurrentUser } from "@/lib/session";
import StatsClient from "./StatsClient";
import { getStatsData } from "@/app/actions/stats";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { prisma } from "@/lib/prisma";

export default async function StatsPage() {
  const user = await getCurrentUser();

  if (!user || user.ledClubs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-heading font-bold text-xl uppercase tracking-widest text-red-500">
        Yetkiniz yok veya yönettiğiniz bir kulüp bulunamadı.
      </div>
    );
  }

  const club = user.ledClubs[0];
  const statsResult = await getStatsData(club.id);

  if (!statsResult.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-heading font-bold text-xl uppercase tracking-widest text-red-500">
        {statsResult.error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <AdminNavbar user={{ name: user.name || "Yönetici", role: user.role }} />
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto w-full">
        <StatsClient 
          clubName={club.name} 
          data={statsResult.data!} 
        />
      </main>
    </div>
  );
}
