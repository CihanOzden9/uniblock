import { getCurrentUser } from "@/lib/session";
import SettingsClient from "./SettingsClient";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user || user.ledClubs.length === 0) {
    redirect("/clubs/manage");
  }

  const clubId = user.ledClubs[0].id;
  const club = await prisma.club.findUnique({
    where: { id: clubId },
    include: {
      leader: true
    }
  });

  if (!club) {
    redirect("/clubs/manage");
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <AdminNavbar user={user} />
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto w-full">
        <SettingsClient club={club} />
      </main>
    </div>
  );
}
