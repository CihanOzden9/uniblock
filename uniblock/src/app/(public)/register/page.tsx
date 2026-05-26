import { prisma } from "@/lib/prisma";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  const faculties = await prisma.faculty.findMany({
    orderBy: { name: "asc" },
    include: { departments: { orderBy: { name: "asc" } } }
  });

  return <RegisterForm faculties={faculties} />;
}
