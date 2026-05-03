"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createSurvey(formData: FormData) {
  try {
    const question = formData.get("question") as string;
    const clubId = formData.get("clubId") as string;
    const optionsRaw = formData.get("options") as string; // Will be comma separated
    
    if (!question || !clubId || !optionsRaw) {
      throw new Error("Tüm alanlar zorunludur.");
    }

    const options = optionsRaw.split(",").map(opt => opt.trim()).filter(opt => opt !== "");

    if (options.length < 2) {
      throw new Error("En az iki seçenek eklemelisiniz.");
    }

    const survey = await prisma.survey.create({
      data: {
        question,
        clubId,
        options: {
          create: options.map(text => ({ text }))
        }
      }
    });

    revalidatePath("/clubs/manage");
    revalidatePath("/feed");
    
    return { success: true, survey };
  } catch (error: any) {
    console.error("Survey creation error:", error);
    return { success: false, error: error.message || "Anket oluşturulurken bir hata oluştu." };
  }
}

export async function deleteSurvey(id: string) {
  try {
    await prisma.survey.delete({
      where: { id }
    });
    revalidatePath("/clubs/manage");
    revalidatePath("/feed");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Anket silinemedi." };
  }
}
