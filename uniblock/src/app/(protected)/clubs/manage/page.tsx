import { PrismaClient } from "@prisma/client";
import ClubDashboardClient from "@/app/(protected)/clubs/manage/ClubDashboardClient";

const prisma = new PrismaClient();

export default async function ClubManagePage() {
  // Demo amaçlı giriş yapmış kullanıcıyı simüle ediyoruz
  const user = await prisma.user.findUnique({
    where: { email: "mert@uniblock.com" },
    include: {
      ledClubs: {
        include: {
          members: {
            include: {
              user: true
            }
          },
          posts: {
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          events: true,
          surveys: {
            include: {
              options: true
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  });

  if (!user || user.ledClubs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-heading font-bold text-xl uppercase tracking-widest text-red-500">
        Yetkiniz yok veya yönettiğiniz bir kulüp bulunamadı.
      </div>
    );
  }

  const club = user.ledClubs[0];

  return <ClubDashboardClient club={club} />;
}
