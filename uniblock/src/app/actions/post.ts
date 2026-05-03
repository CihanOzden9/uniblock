"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createPost(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const type = formData.get("type") as "NEWS" | "ANNOUNCEMENT";
    const clubId = formData.get("clubId") as string;
    const authorId = formData.get("authorId") as string;

    if (!title || !content || !type || !clubId || !authorId) {
      throw new Error("Tüm alanlar zorunludur.");
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        type,
        clubId,
        authorId,
      },
    });

    // Ana akışı ve kulüp yönetim sayfasını yenile
    revalidatePath("/clubs/manage");
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
    const type = formData.get("type") as "NEWS" | "ANNOUNCEMENT";

    if (!id || !title || !content || !type) {
      throw new Error("Tüm alanlar zorunludur.");
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        type,
      },
    });

    revalidatePath("/clubs/manage");
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
    revalidatePath("/feed");
    
    return { success: true };
  } catch (error: any) {
    console.error("Post delete error:", error);
    return { success: false, error: "İçerik silinirken bir hata oluştu." };
  }
}
