"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData, userId: string) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const bio = formData.get("bio") as string;
    const faculty = formData.get("faculty") as string;
    const department = formData.get("department") as string;
    const image = formData.get("image") as string;

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: `${firstName} ${lastName}`.trim(),
        bio,
        faculty,
        department,
        image: image || null,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Profil güncellenirken bir hata oluştu." };
  }
}

export async function updateInterests(interests: string[], userId: string) {
  try {
    console.log("Updating interests for user:", userId, interests);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        interests,
      },
    });
    console.log("Successfully updated interests:", updatedUser.interests);

    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update interests:", error);
    return { success: false, error: error.message };
  }
}

export async function updatePassword(formData: FormData, userId: string) {
  try {
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error("Tüm şifre alanları zorunludur.");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Yeni şifreler birbiriyle uyuşmuyor.");
    }

    if (newPassword.length < 6) {
      throw new Error("Yeni şifre en az 6 karakter olmalıdır.");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user) {
      throw new Error("Kullanıcı bulunamadı.");
    }

    // Projedeki mevcut kimlik doğrulama sistemine uygun olarak şifre düz metin olarak kontrol edilmektedir.
    if (user.password && user.password !== currentPassword) {
      throw new Error("Mevcut şifre yanlış.");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword }
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Şifre güncellenirken bir hata oluştu." };
  }
}

