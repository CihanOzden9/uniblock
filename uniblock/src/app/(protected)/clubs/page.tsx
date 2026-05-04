import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import ClubsClient from "./ClubsClient";
import { redirect } from "next/navigation";

export default async function ClubsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch real clubs with current user's membership status
  const clubs = await prisma.club.findMany({
    include: {
      _count: {
        select: { members: { where: { status: "APPROVED" } } }
      },
      members: {
        where: { userId: user.id },
        select: { status: true }
      }
    }
  });

  return <ClubsClient user={user} clubs={clubs} />;
}
