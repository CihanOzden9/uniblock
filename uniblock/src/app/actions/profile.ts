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

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: `${firstName} ${lastName}`,
        bio,
        faculty,
        department,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
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
