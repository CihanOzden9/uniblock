"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addTeamMember(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const teamId = formData.get("teamId") as string;
    const role = formData.get("role") as string || "MEMBER";

    if (!email || !teamId) {
      throw new Error("E-posta adresi zorunludur.");
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error("Bu e-posta adresine sahip bir kullanıcı bulunamadı.");
    }

    // Zaten üye mi kontrol et
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId: teamId
        }
      }
    });

    if (existingMember) {
      throw new Error("Bu kullanıcı zaten takıma üye.");
    }

    // Üyeliği oluştur
    await prisma.teamMember.create({
      data: {
        userId: user.id,
        teamId,
        role
      }
    });

    revalidatePath("/teams/manage");

    return { success: true };
  } catch (error: any) {
    console.error("Add member error:", error);
    return { success: false, error: error.message || "Üye eklenirken bir hata oluştu." };
  }
}

export async function checkUserExistence(email: string, teamId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return { success: false, error: "USER_NOT_FOUND" };
    }

    const member = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId: teamId
        }
      }
    });

    return {
      success: true,
      user,
      isMember: !!member,
      memberRole: member?.role
    };
  } catch (error) {
    return { success: false, error: "CHECK_FAILED" };
  }
}

export async function removeTeamMember(teamId: string, userId: string) {
  try {
    await prisma.teamMember.delete({
      where: {
        userId_teamId: {
          userId,
          teamId
        }
      }
    });

    revalidatePath("/teams/manage");

    return { success: true };
  } catch (error: any) {
    console.error("Remove member error:", error);
    return { success: false, error: "Üye takımdan çıkarılamadı." };
  }
}

export async function updateTeamMemberRole(teamId: string, userId: string, role: string) {
  try {
    await prisma.teamMember.update({
      where: {
        userId_teamId: {
          userId,
          teamId
        }
      },
      data: { role }
    });

    revalidatePath("/teams/manage");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Üye rolü güncellenemedi." };
  }
}

export async function updateTeamSettings(formData: FormData) {
  try {
    const teamId = formData.get("teamId") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const presidentEmail = formData.get("presidentEmail") as string;
    const website = formData.get("website") as string;
    const logo = formData.get("logo") as string;
    const leaderName = formData.get("leaderName") as string;
    const color = formData.get("color") as string;

    await prisma.team.update({
      where: { id: teamId },
      data: {
        name,
        description,
        contactEmail,
        presidentEmail: presidentEmail || null,
        website,
        logo: logo || null,
        ...(color ? { color } : {}),
        leader: {
          update: {
            name: leaderName
          }
        }
      } as any
    });

    revalidatePath("/teams/manage");
    revalidatePath("/feed");
    revalidatePath("/teams");
    return { success: true };
  } catch (error: any) {
    console.error("Update team settings error:", error);
    return { success: false, error: "Ayarlar güncellenirken bir hata oluştu." };
  }
}

export async function updateTeamPassword(formData: FormData) {
  try {
    const leaderId = formData.get("leaderId") as string;
    const password = formData.get("password") as string;

    if (!password || password.length < 6) {
      throw new Error("Şifre en az 6 karakter olmalıdır.");
    }

    await prisma.user.update({
      where: { id: leaderId },
      data: { password }
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Şifre güncellenemedi." };
  }
}

export async function requestJoinTeam(teamId: string, userId: string) {
  try {
    // Zaten bir kaydı var mı kontrol et
    const existing = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: { userId, teamId }
      }
    });

    if (existing) {
      if (existing.status === "PENDING") throw new Error("Zaten bir katılım isteğiniz bulunuyor.");
      if (existing.status === "APPROVED") throw new Error("Zaten bu takımın üyesisiniz.");
      // Eğer reddedildiyse tekrar başvurabilsin diye siliyoruz
      await prisma.teamMember.delete({ where: { id: existing.id } });
    }

    await prisma.teamMember.create({
      data: {
        userId,
        teamId,
        status: "PENDING",
        role: "MEMBER"
      }
    });

    revalidatePath("/teams");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "İstek gönderilemedi." };
  }
}

export async function handleJoinRequest(memberId: string, action: "APPROVED" | "REJECTED") {
  try {
    if (action === "APPROVED") {
      await prisma.teamMember.update({
        where: { id: memberId },
        data: { status: "APPROVED", joinedAt: new Date() }
      });
    } else {
      await prisma.teamMember.delete({
        where: { id: memberId }
      });
    }

    revalidatePath("/teams/manage");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "İşlem gerçekleştirilemedi." };
  }
}

export async function leaveTeam(teamId: string, userId: string) {
  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { leaderId: true }
    });

    if (team?.leaderId === userId) {
      throw new Error("Takım kaptanı takımdan ayrılamaz.");
    }

    await prisma.teamMember.delete({
      where: {
        userId_teamId: { userId, teamId }
      }
    });

    revalidatePath("/teams");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Takımdan ayrılırken bir hata oluştu." };
  }
}
