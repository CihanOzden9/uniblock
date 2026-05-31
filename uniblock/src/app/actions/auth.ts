"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomClubColor } from "@/lib/colors";

export async function register(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const faculty = formData.get("faculty") as string;
  const department = formData.get("department") as string;
  const role = (formData.get("role") as string) || "STUDENT";
  const clubName = formData.get("clubName") as string;
  const teamName = formData.get("teamName") as string;

  if (!email || !password || !firstName || !lastName) {
    return { success: false, error: "Lütfen tüm zorunlu alanları doldurun." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Bu e-posta adresi zaten kullanımda." };
    }

    const newUser = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password, // Not: Gerçek uygulamada şifre hash'lenmelidir!
        role: role as any,
        status: "ACTIVE",
        faculty,
        department,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
      },
    });

    if (role === "CLUB_ADMIN" && clubName) {
      const slug = clubName.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      const club = await prisma.club.create({
        data: {
          name: clubName,
          slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
          leaderId: newUser.id,
          status: "ACTIVE",
          contactEmail: email,
          color: randomClubColor(),
        } as any,
      });

      // Lideri aynı zamanda kulüp üyesi (BOARD_MEMBER) olarak ekle
      await prisma.clubMember.create({
        data: {
          userId: newUser.id,
          clubId: club.id,
          role: "BOARD_MEMBER",
          status: "APPROVED"
        }
      });
    }

    if (role === "TEAM_ADMIN" && teamName) {
      const slug = teamName.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      const team = await prisma.team.create({
        data: {
          name: teamName,
          slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
          leaderId: newUser.id,
          status: "ACTIVE",
          contactEmail: email,
          color: randomClubColor(),
        } as any,
      });

      // Kaptanı aynı zamanda takım üyesi (BOARD_MEMBER) olarak ekle
      await prisma.teamMember.create({
        data: {
          userId: newUser.id,
          teamId: team.id,
          role: "BOARD_MEMBER",
          status: "APPROVED"
        }
      });
    }

    const cookieStore = await cookies();
    
    // Auth token simülasyonu
    cookieStore.set("auth_token", newUser.email, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7, // 1 hafta
      path: "/",
    });

    // Rol bilgisini de saklayalım (middleware için)
    cookieStore.set("user_role", newUser.role.toLowerCase(), {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true, role: newUser.role };
  } catch (error) {
    console.error("Register Error:", error);
    return { success: false, error: "Kayıt sırasında bir hata oluştu." };
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "E-posta ve şifre gereklidir." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return { success: false, error: "Hatalı e-posta veya şifre." };
    }

    /*
    if (user.status === "PENDING") {
      return { success: false, error: "Hesabınız henüz onaylanmamış. Lütfen yöneticinin onayını bekleyin." };
    }

    if (user.status === "REJECTED") {
      return { success: false, error: "Hesap başvurunuz reddedildi." };
    }

    if (user.status === "BANNED") {
      return { success: false, error: "Hesabınız askıya alındı." };
    }
    */

    const cookieStore = await cookies();
    
    // Auth token simülasyonu
    cookieStore.set("auth_token", user.email, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7, // 1 hafta
      path: "/",
    });

    // Rol bilgisini de saklayalım (middleware için)
    cookieStore.set("user_role", user.role.toLowerCase(), {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true, role: user.role };
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, error: "Giriş sırasında bir hata oluştu." };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("user_role");
  redirect("/login");
}
