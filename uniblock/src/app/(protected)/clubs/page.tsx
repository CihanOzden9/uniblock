import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import ClubsClient from "./ClubsClient";
import { getFollowedClubIds } from "@/app/actions/follow";
import { redirect } from "next/navigation";

export default async function ClubsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const followedIds = await getFollowedClubIds(user.id);

  // Fetch real clubs with current user's membership status
  const clubs = await prisma.club.findMany({
    include: {
      _count: {
        select: { members: { where: { status: "APPROVED" } }, followers: true }
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

  return <ClubsClient user={user} clubs={clubs} followedIds={followedIds} />;
}
