import { getCurrentUser } from "@/lib/session";
import SettingsClient from "./SettingsClient";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user || user.ledTeams.length === 0) {
    redirect("/teams/manage");
  }

  const teamId = user.ledTeams[0].id;
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      leader: true
    }
  });

  if (!team) {
    redirect("/teams/manage");
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <AdminNavbar user={{ name: user.name || "Yönetici", role: user.role }} basePath="/teams/manage" />
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto w-full">
        <SettingsClient team={team} />
      </main>
    </div>
  );
}
