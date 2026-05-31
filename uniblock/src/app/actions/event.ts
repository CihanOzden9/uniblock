"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Kulüp/takım yönetim panelinden etkinlik paylaşımı.
// clubId varsa organizerId'ye, teamId varsa teamId'ye yazılır (XOR).
export async function createCommunityEvent(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const location = (formData.get("location") as string) || null;
    const capacityRaw = formData.get("capacity") as string;
    const clubId = (formData.get("clubId") as string) || null;
    const teamId = (formData.get("teamId") as string) || null;

    if (!title || !description || !date || (!clubId && !teamId)) {
      return { success: false, error: "Başlık, açıklama ve tarih zorunludur." };
    }

    await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        capacity: capacityRaw ? parseInt(capacityRaw) : null,
        organizerId: clubId,
        teamId: teamId,
      },
    });

    revalidatePath("/feed");
    revalidatePath("/events");
    revalidatePath("/clubs/manage");
    revalidatePath("/teams/manage");
    return { success: true };
  } catch (error: any) {
    console.error("createCommunityEvent error:", error);
    return { success: false, error: "Etkinlik oluşturulamadı." };
  }
}

// Etkinliğe katıl / katılımı geri al (RSVP toggle). Kontenjan kontrolü dahil (Faz 2).
export async function rsvpEvent(eventId: string, userId: string) {
  try {
    if (!eventId || !userId) {
      return { success: false, error: "Geçersiz istek." };
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, capacity: true, cancelled: true },
    });
    if (!event) return { success: false, error: "Etkinlik bulunamadı." };
    if (event.cancelled) return { success: false, error: "Bu etkinlik iptal edilmiş." };

    const existing = await prisma.interaction.findFirst({
      where: { eventId, userId, type: "RSVP" },
      select: { id: true },
    });

    if (existing) {
      // Katılımı geri al
      await prisma.interaction.delete({ where: { id: existing.id } });
      revalidatePath("/feed");
      revalidatePath("/events");
      return { success: true, joined: false };
    }

    // Kontenjan kontrolü (Faz 2)
    if (event.capacity != null) {
      const count = await prisma.interaction.count({ where: { eventId, type: "RSVP" } });
      if (count >= event.capacity) {
        return { success: false, error: "Üzgünüz, bu etkinliğin kontenjanı dolmuştur." };
      }
    }

    await prisma.interaction.create({
      data: { type: "RSVP", eventId, userId },
    });

    revalidatePath("/feed");
    revalidatePath("/events");
    return { success: true, joined: true };
  } catch (error: any) {
    console.error("rsvpEvent error:", error);
    return { success: false, error: "İşlem gerçekleştirilemedi." };
  }
}

// Kulüp/takım etkinliğini düzenle. Sahiplik kontrolü: clubId/teamId eşleşmeli.
export async function updateCommunityEvent(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const location = (formData.get("location") as string) || null;
    const capacityRaw = formData.get("capacity") as string;
    const clubId = (formData.get("clubId") as string) || null;
    const teamId = (formData.get("teamId") as string) || null;

    if (!id || !title || !description || !date) {
      return { success: false, error: "Başlık, açıklama ve tarih zorunludur." };
    }

    const event = await prisma.event.findUnique({
      where: { id },
      select: { organizerId: true, teamId: true },
    });
    if (!event) return { success: false, error: "Etkinlik bulunamadı." };
    // Sahiplik: sadece kendi kulübünün/takımının etkinliği
    if ((clubId && event.organizerId !== clubId) || (teamId && event.teamId !== teamId)) {
      return { success: false, error: "Bu etkinliği düzenleme yetkiniz yok." };
    }

    await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        location,
        capacity: capacityRaw ? parseInt(capacityRaw) : null,
      },
    });

    revalidatePath("/feed");
    revalidatePath("/events");
    revalidatePath("/clubs/manage");
    revalidatePath("/teams/manage");
    return { success: true };
  } catch (error: any) {
    console.error("updateCommunityEvent error:", error);
    return { success: false, error: "Etkinlik güncellenemedi." };
  }
}

// Kulüp/takım etkinliğini sil. Sahiplik kontrolü dahil.
export async function deleteCommunityEvent(id: string, ownerId: string) {
  try {
    if (!id || !ownerId) return { success: false, error: "Geçersiz istek." };

    const event = await prisma.event.findUnique({
      where: { id },
      select: { organizerId: true, teamId: true },
    });
    if (!event) return { success: false, error: "Etkinlik bulunamadı." };
    if (event.organizerId !== ownerId && event.teamId !== ownerId) {
      return { success: false, error: "Bu etkinliği silme yetkiniz yok." };
    }

    await prisma.event.delete({ where: { id } });

    revalidatePath("/feed");
    revalidatePath("/events");
    revalidatePath("/clubs/manage");
    revalidatePath("/teams/manage");
    return { success: true };
  } catch (error: any) {
    console.error("deleteCommunityEvent error:", error);
    return { success: false, error: "Etkinlik silinemedi." };
  }
}
