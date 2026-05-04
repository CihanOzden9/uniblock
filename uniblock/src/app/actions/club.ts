"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function addClubMember(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const clubId = formData.get("clubId") as string;
    const role = formData.get("role") as string || "MEMBER";

    if (!email || !clubId) {
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
    const existingMember = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId: clubId
        }
      }
    });

    if (existingMember) {
      throw new Error("Bu kullanıcı zaten kulübe üye.");
    }

    // Üyeliği oluştur
    await prisma.clubMember.create({
      data: {
        userId: user.id,
        clubId,
        role
      }
    });

    revalidatePath("/clubs/manage");
    
    return { success: true };
  } catch (error: any) {
    console.error("Add member error:", error);
    return { success: false, error: error.message || "Üye eklenirken bir hata oluştu." };
  }
}

export async function removeClubMember(clubId: string, userId: string) {
  try {
    await prisma.clubMember.delete({
      where: {
        userId_clubId: {
          userId,
          clubId
        }
      }
    });

    revalidatePath("/clubs/manage");
    
    return { success: true };
  } catch (error: any) {
    console.error("Remove member error:", error);
    return { success: false, error: "Üye kulüpten çıkarılamadı." };
  }
}

export async function updateClubMemberRole(clubId: string, userId: string, role: string) {
  try {
    await prisma.clubMember.update({
      where: {
        userId_clubId: {
          userId,
          clubId
        }
      },
      data: { role }
    });

    revalidatePath("/clubs/manage");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Üye rolü güncellenemedi." };
  }
}

export async function updateClubSettings(formData: FormData) {
  try {
    const clubId = formData.get("clubId") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const website = formData.get("website") as string;
    const logo = formData.get("logo") as string;
    const leaderName = formData.get("leaderName") as string;

    await prisma.club.update({
      where: { id: clubId },
      data: {
        name,
        description,
        contactEmail,
        website,
        logo: logo || null,
        leader: {
          update: {
            name: leaderName
          }
        }
      }
    });

    revalidatePath("/clubs/manage");
    return { success: true };
  } catch (error: any) {
    console.error("Update club settings error:", error);
    return { success: false, error: "Ayarlar güncellenirken bir hata oluştu." };
  }
}

export async function updateClubPassword(formData: FormData) {
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
