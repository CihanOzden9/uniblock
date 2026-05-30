import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const INCLUDE = {
  ledClubs: true,
  clubMemberships: { include: { club: true } },
  ledTeams: true,
  teamMemberships: { include: { team: true } },
} as const;

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const email = cookieStore.get("auth_token")?.value;

  if (!email) return null;

  const user = await prisma.user.findUnique({
    where: { email },
    include: INCLUDE
  });

  return user;
}
