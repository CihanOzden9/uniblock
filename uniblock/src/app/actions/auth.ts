"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const faculty = formData.get("faculty") as string;
  const department = formData.get("department") as string;
  const role = (formData.get("role") as string) || "STUDENT";

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

    await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password, // Not: Gerçek uygulamada şifre hash'lenmelidir!
        role: role as any,
        faculty,
        department,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
      },
    });

    return { success: true };
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

    const cookieStore = await cookies();
    
    // Auth token simülasyonu
    cookieStore.set("auth_token", user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 hafta
      path: "/",
    });

    // Rol bilgisini de saklayalım (middleware için)
    cookieStore.set("user_role", user.role.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
