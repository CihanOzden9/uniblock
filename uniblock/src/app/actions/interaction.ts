"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function likePost(postId: string, userId: string) {
  try {
    // Check if already liked
    const existing = await (prisma.interaction as any).findFirst({
      where: {
        postId,
        userId,
        type: "LIKE"
      }
    });

    if (existing) {
      await (prisma.interaction as any).delete({
        where: { id: existing.id }
      });
    } else {
      await (prisma.interaction as any).create({
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

// İçeriği kaydet / kaydı geri al (SAVE toggle) — post veya event
export async function toggleSave(
  target: { postId?: string; eventId?: string },
  userId: string
) {
  try {
    if (!userId || (!target.postId && !target.eventId)) {
      return { success: false, error: "Geçersiz istek." };
    }
    const where: any = { userId, type: "SAVE" };
    if (target.postId) where.postId = target.postId;
    if (target.eventId) where.eventId = target.eventId;

    const existing = await (prisma.interaction as any).findFirst({ where });

    if (existing) {
      await (prisma.interaction as any).delete({ where: { id: existing.id } });
      revalidatePath("/feed");
      revalidatePath("/saved");
      return { success: true, saved: false };
    }

    await (prisma.interaction as any).create({
      data: { userId, type: "SAVE", postId: target.postId || null, eventId: target.eventId || null },
    });
    revalidatePath("/feed");
    revalidatePath("/saved");
    return { success: true, saved: true };
  } catch (error) {
    console.error("Save error:", error);
    return { success: false, error: "İşlem gerçekleştirilemedi." };
  }
}

export async function commentPost(postId: string, userId: string, content: string) {
  try {
    if (!content.trim()) throw new Error("Yorum boş olamaz.");

    await (prisma.interaction as any).create({
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
    // Anket 24 saatten eskiyse oy kullanılamaz
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      select: { createdAt: true }
    });
    if (!survey) {
      throw new Error("Anket bulunamadı.");
    }
    const expiresAt = new Date(survey.createdAt).getTime() + 24 * 60 * 60 * 1000;
    if (Date.now() > expiresAt) {
      throw new Error("Bu anketin süresi dolmuştur.");
    }

    // Check if already voted in this survey
    const existing = await (prisma.interaction as any).findFirst({
      where: {
        surveyId,
        userId,
        type: "VOTE"
      }
    });

    if (existing) {
      throw new Error("Bu ankete zaten oy verdiniz.");
    }

    await (prisma.interaction as any).create({
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

export async function editComment(commentId: string, userId: string, content: string) {
  try {
    const existing = await (prisma.interaction as any).findUnique({
      where: { id: commentId }
    });

    if (!existing || existing.userId !== userId) {
      throw new Error("Bu yorumu düzenleme yetkiniz yok.");
    }

    await (prisma.interaction as any).update({
      where: { id: commentId },
      data: { content }
    });

    revalidatePath("/feed");
    return { success: true };
  } catch (error: any) {
    console.error("Edit comment error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteComment(commentId: string, userId: string) {
  try {
    const existing = await (prisma.interaction as any).findUnique({
      where: { id: commentId }
    });

    if (!existing || existing.userId !== userId) {
      throw new Error("Bu yorumu silme yetkiniz yok.");
    }

    await (prisma.interaction as any).delete({
      where: { id: commentId }
    });

    revalidatePath("/feed");
    return { success: true };
  } catch (error: any) {
    console.error("Delete comment error:", error);
    return { success: false, error: error.message };
  }
}

export async function reportComment(commentId: string, reporterId: string, reason: string) {
  try {
    await (prisma as any).report.create({
      data: {
        interactionId: commentId,
        reporterId: reporterId,
        reason,
        status: "PENDING"
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Report error:", error);
    return { success: false, error: error.message };
  }
}

export async function resolveReport(reportId: string, status: "RESOLVED" | "DISMISSED") {
  try {
    await (prisma as any).report.update({
      where: { id: reportId },
      data: { status }
    });

    revalidatePath("/clubs/manage");
    return { success: true };
  } catch (error: any) {
    console.error("Resolve report error:", error);
    return { success: false, error: error.message };
  }
}
