import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import TeamsClient from "./TeamsClient";
import { redirect } from "next/navigation";

export default async function TeamsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch real teams with current user's membership status
  const teams = await prisma.team.findMany({
    include: {
      _count: {
        select: { members: { where: { status: "APPROVED" } } }
      },
      members: {
        where: {
          OR: [
            { userId: user.id },
            { role: { not: "MEMBER" }, status: "APPROVED" }
          ]
        },
        select: {
          status: true,
          role: true,
          userId: true,
          user: { select: { name: true, department: true } }
        }
      },
      leader: {
        select: { id: true, name: true, department: true }
      }
    }
  });

  return <TeamsClient user={user} teams={teams} />;
}
