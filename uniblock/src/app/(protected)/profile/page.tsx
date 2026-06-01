import { getCurrentUser } from "@/lib/session";
import ProfileClient from "./ProfileClient";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const faculties = await prisma.faculty.findMany({
    orderBy: { name: "asc" },
    include: { departments: { orderBy: { name: "asc" } } }
  });

  return <ProfileClient user={user} faculties={faculties} />;
}

