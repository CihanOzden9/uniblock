import { getCurrentUser } from "@/lib/session";
import StatsClient from "./StatsClient";
import { getTeamStatsData } from "@/app/actions/stats";
import AdminNavbar from "@/components/layout/AdminNavbar";

export default async function StatsPage() {
  const user = await getCurrentUser();

  if (!user || user.ledTeams.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-heading font-bold text-xl uppercase tracking-widest text-red-500">
        Yetkiniz yok veya yönettiğiniz bir takım bulunamadı.
      </div>
    );
  }

  const team = user.ledTeams[0];
  const statsResult = await getTeamStatsData(team.id);

  if (!statsResult.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-heading font-bold text-xl uppercase tracking-widest text-red-500">
        {statsResult.error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <AdminNavbar user={{ name: user.name || "Yönetici", role: user.role }} basePath="/teams/manage" />
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto w-full">
        <StatsClient
          teamName={team.name}
          data={statsResult.data!}
        />
      </main>
    </div>
  );
}
