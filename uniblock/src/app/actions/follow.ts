"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

type FollowTarget = { clubId?: string; teamId?: string };

/**
 * Bir kulübü veya takımı takip et / takibi bırak (anlık, onaysız).
 * Üyelikten (ClubMember/TeamMember onay akışı) tamamen bağımsızdır.
 * Döner: { success, following } — following = işlemden sonraki durum.
 */
export async function toggleFollow({ clubId, teamId }: FollowTarget) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Oturum bulunamadı." };

    // XOR: tam olarak biri verilmeli
    if ((!clubId && !teamId) || (clubId && teamId)) {
      return { success: false, error: "Geçersiz takip hedefi." };
    }

    const where = clubId
      ? { userId_clubId: { userId: user.id, clubId } }
      : { userId_teamId: { userId: user.id, teamId: teamId! } };

    const existing = await prisma.follow.findUnique({ where });

    let following: boolean;
    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      following = false;
    } else {
      await prisma.follow.create({
        data: { userId: user.id, clubId: clubId ?? null, teamId: teamId ?? null },
      });
      following = true;
    }

    revalidatePath("/clubs");
    revalidatePath("/teams");
    revalidatePath("/feed");

    return { success: true, following };
  } catch (error: any) {
    console.error("toggleFollow error:", error);
    return { success: false, error: "İşlem gerçekleştirilemedi." };
  }
}

/** Kullanıcının takip ettiği kulüp ID'leri. */
export async function getFollowedClubIds(userId: string): Promise<string[]> {
  const rows = await prisma.follow.findMany({
    where: { userId, clubId: { not: null } },
    select: { clubId: true },
  });
  return rows.map((r) => r.clubId!).filter(Boolean);
}

/** Kullanıcının takip ettiği takım ID'leri. */
export async function getFollowedTeamIds(userId: string): Promise<string[]> {
  const rows = await prisma.follow.findMany({
    where: { userId, teamId: { not: null } },
    select: { teamId: true },
  });
  return rows.map((r) => r.teamId!).filter(Boolean);
}
