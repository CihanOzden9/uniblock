"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    // NEWS tipi kaldırıldı; kulüp/takım paylaşımı varsayılan olarak Duyuru (ANNOUNCEMENT).
    const type = ((formData.get("type") as string) || "ANNOUNCEMENT") as "ANNOUNCEMENT";
    const clubId = formData.get("clubId") as string;
    const teamId = formData.get("teamId") as string;
    const authorId = formData.get("authorId") as string;

    if (!title || !content || !authorId || (!clubId && !teamId)) {
      throw new Error("Tüm alanlar zorunludur.");
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        type,
        clubId: clubId || null,
        teamId: teamId || null,
        authorId,
      },
    });

    // TODO(bildirim): Bu içerik bir kulüp/takıma aitse, takipçilere bildirim üret.
    // Hedef kümesi: prisma.follow.findMany({ where: clubId ? { clubId } : { teamId } })
    // → her takipçi için Notification kaydı (sonraki faz). Follow tablosu hazır.

    // Ana akışı ve kulüp/takım yönetim sayfasını yenile
    revalidatePath("/clubs/manage");
    revalidatePath("/teams/manage");
    revalidatePath("/feed");

    return { success: true, post };
  } catch (error: any) {
    console.error("Post creation error:", error);
    return { success: false, error: error.message || "İçerik oluşturulurken bir hata oluştu." };
  }
}

export async function updatePost(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!id || !title || !content) {
      throw new Error("Tüm alanlar zorunludur.");
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    revalidatePath("/clubs/manage");
    revalidatePath("/teams/manage");
    revalidatePath("/feed");

    return { success: true, post };
  } catch (error: any) {
    console.error("Post update error:", error);
    return { success: false, error: error.message || "İçerik güncellenirken bir hata oluştu." };
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    });

    revalidatePath("/clubs/manage");
    revalidatePath("/teams/manage");
    revalidatePath("/feed");

    return { success: true };
  } catch (error: any) {
    console.error("Post delete error:", error);
    return { success: false, error: "İçerik silinirken bir hata oluştu." };
  }
}
