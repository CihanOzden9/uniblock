"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function likePost(postId: string, userId: string) {
  try {
    // Check if already liked
    const existing = await prisma.interaction.findFirst({
      where: {
        postId,
        userId,
        type: "LIKE"
      }
    });

    if (existing) {
      await prisma.interaction.delete({
        where: { id: existing.id }
      });
    } else {
      await prisma.interaction.create({
        data: {
          postId,
          userId,
          type: "LIKE"
        }
      });
    }

    revalidatePath("/feed");
    return { success: true };
  } catch (error) {
    console.error("Like error:", error);
    return { success: false };
  }
}

export async function commentPost(postId: string, userId: string, content: string) {
  try {
    if (!content.trim()) throw new Error("Yorum boş olamaz.");

    await prisma.interaction.create({
      data: {
        postId,
        userId,
        type: "COMMENT",
        content
      }
    });

    revalidatePath("/feed");
    return { success: true };
  } catch (error: any) {
    console.error("Comment error:", error);
    return { success: false, error: error.message };
  }
}

export async function voteSurvey(surveyId: string, optionId: string, userId: string) {
  try {
    // Check if already voted in this survey
    const existing = await prisma.interaction.findFirst({
      where: {
        surveyId,
        userId,
        type: "VOTE"
      }
    });

    if (existing) {
      throw new Error("Bu ankete zaten oy verdiniz.");
    }

    await prisma.interaction.create({
      data: {
        surveyId,
        optionId,
        userId,
        type: "VOTE"
      }
    });

    revalidatePath("/feed");
    return { success: true };
  } catch (error: any) {
    console.error("Vote error:", error);
    return { success: false, error: error.message };
  }
}
