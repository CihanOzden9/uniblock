"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function handleUserStatus(userId: string, status: "ACTIVE" | "REJECTED" | "BANNED") {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status }
    });

    revalidatePath("/admin");
    revalidatePath("/admin/students");

    return { success: true };
  } catch (error: any) {
    console.error("Handle user status error:", error);
    return { success: false, error: "İşlem gerçekleştirilemedi." };
  }
}

export async function handleClubStatus(clubId: string, status: "ACTIVE" | "REJECTED" | "BANNED") {
  try {
    const club = await prisma.club.update({
      where: { id: clubId },
      data: { status },
      include: { leader: true }
    });

    if (status === "ACTIVE") {
      await prisma.post.create({
        data: {
          title: `${club.name} Topluluğa Katıldı!`,
          content: `${club.name} kulübü sistemimize onaylanarak katıldı. Etkinlikleri ve duyuruları takip etmeyi unutmayın!`,
          type: "ANNOUNCEMENT",
          authorId: club.leaderId,
          clubId: club.id,
        }
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/clubs");

    return { success: true };
  } catch (error: any) {
    console.error("Handle club status error:", error);
    return { success: false, error: "İşlem gerçekleştirilemedi." };
  }
}

export async function handleReport(reportId: string, action: "RESOLVED" | "DISMISSED") {
  try {
    await prisma.report.update({
      where: { id: reportId },
      data: { status: action }
    });

    revalidatePath("/admin/complaints");
    return { success: true };
  } catch (error: any) {
    console.error("Handle report error:", error);
    return { success: false, error: "İşlem gerçekleştirilemedi." };
  }
}

export async function deleteReportContent(reportId: string) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { interaction: true }
    });

    if (!report) return { success: false, error: "Şikayet bulunamadı." };

    await prisma.interaction.delete({ where: { id: report.interactionId } });

    revalidatePath("/admin/complaints");
    return { success: true };
  } catch (error: any) {
    console.error("Delete report content error:", error);
    return { success: false, error: "İçerik kaldırılamadı." };
  }
}

export async function promoteUserToAdmin(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return { success: false, error: "Bu e-posta ile kayıtlı kullanıcı bulunamadı." };
    if (user.role === "SUPER_ADMIN") return { success: false, error: "Süperadmin yetkisi değiştirilemez." };
    if (user.role === "ADMIN") return { success: false, error: "Bu kullanıcı zaten yönetici." };

    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN", status: "ACTIVE" }
    });

    revalidatePath("/admin/admins");
    return { success: true, name: user.name };
  } catch (error: any) {
    console.error("Promote user error:", error);
    return { success: false, error: "İşlem gerçekleştirilemedi." };
  }
}

export async function removeAdminRole(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role === "SUPER_ADMIN") return { success: false, error: "Süperadmin yetkisi kaldırılamaz." };

    await prisma.user.update({
      where: { id: userId },
      data: { role: "STUDENT" }
    });

    revalidatePath("/admin/admins");
    return { success: true };
  } catch (error: any) {
    console.error("Remove admin role error:", error);
    return { success: false, error: "İşlem gerçekleştirilemedi." };
  }
}

export async function toggleAdminsVisibility(visible: boolean) {
  try {
    await prisma.systemSettings.upsert({
      where: { id: "singleton" },
      update: { adminsVisible: visible },
      create: { id: "singleton", adminsVisible: visible },
    });
    revalidatePath("/admin/admins");
    return { success: true };
  } catch (error: any) {
    console.error("Toggle visibility error:", error);
    return { success: false, error: "İşlem gerçekleştirilemedi." };
  }
}

export async function cancelEvent(eventId: string, reason: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true }
    });

    if (!event) return { success: false, error: "Etkinlik bulunamadı." };

    await prisma.event.update({
      where: { id: eventId },
      data: { cancelled: true, cancelReason: reason }
    });

    const clubLeader = await prisma.user.findFirst({
      where: { ledClubs: { some: { id: event.organizerId } } }
    });

    if (clubLeader) {
      await prisma.post.create({
        data: {
          title: `Etkinlik İptal Edildi: ${event.title}`,
          content: `"${event.title}" etkinliği admin tarafından iptal edilmiştir.\n\nSebep: ${reason}`,
          type: "ANNOUNCEMENT",
          authorId: clubLeader.id,
          clubId: event.organizerId
        }
      });
    }

    revalidatePath("/admin/events");
    return { success: true };
  } catch (error: any) {
    console.error("Cancel event error:", error);
    return { success: false, error: "Etkinlik iptal edilemedi." };
  }
}

export async function createAdminEvent(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const capacity = formData.get("capacity") as string;
    const clubId = formData.get("clubId") as string;

    if (!title || !description || !date || !clubId) {
      return { success: false, error: "Lütfen zorunlu alanları doldurun." };
    }

    await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location: location || null,
        capacity: capacity ? parseInt(capacity) : null,
        organizerId: clubId
      }
    });

    revalidatePath("/admin/events");
    return { success: true };
  } catch (error: any) {
    console.error("Create event error:", error);
    return { success: false, error: "Etkinlik oluşturulamadı." };
  }
}

export async function addFaculty(name: string) {
  try {
    if (!name.trim()) return { success: false, error: "Fakülte adı boş olamaz." };

    await prisma.faculty.create({ data: { name: name.trim() } });

    revalidatePath("/admin/departments");
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") return { success: false, error: "Bu fakülte zaten mevcut." };
    return { success: false, error: "Fakülte eklenemedi." };
  }
}

export async function deleteFaculty(facultyId: string) {
  try {
    await prisma.faculty.delete({ where: { id: facultyId } });
    revalidatePath("/admin/departments");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Fakülte silinemedi." };
  }
}

export async function addDepartment(facultyId: string, name: string) {
  try {
    if (!name.trim()) return { success: false, error: "Bölüm adı boş olamaz." };

    await prisma.department.create({
      data: { name: name.trim(), facultyId }
    });

    revalidatePath("/admin/departments");
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") return { success: false, error: "Bu bölüm zaten mevcut." };
    return { success: false, error: "Bölüm eklenemedi." };
  }
}

export async function deleteDepartment(departmentId: string) {
  try {
    await prisma.department.delete({ where: { id: departmentId } });
    revalidatePath("/admin/departments");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Bölüm silinemedi." };
  }
}
