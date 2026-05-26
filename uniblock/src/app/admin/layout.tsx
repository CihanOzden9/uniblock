import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "PROJECT_ADMIN" && user.role !== "ADMIN")) {
    redirect("/feed");
  }

  const [pendingUsers, pendingClubs, pendingComplaints] = await Promise.all([
    prisma.user.count({ where: { role: { in: ["STUDENT", "CLUB_ADMIN"] }, status: "PENDING" } }),
    prisma.club.count({ where: { status: "PENDING" } }),
    prisma.report.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="min-h-screen flex bg-[#0f1117]">
      <AdminSidebar 
        user={{ name: user.name || "Admin", role: user.role, image: user.image }} 
        pendingCounts={{
          users: pendingUsers,
          clubs: pendingClubs,
          complaints: pendingComplaints
        }}
      />
      <main className="flex-1 ml-[260px] min-h-screen bg-[#0f1117]">
        {children}
      </main>
    </div>
  );
}
