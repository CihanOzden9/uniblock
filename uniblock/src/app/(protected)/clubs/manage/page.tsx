import { getCurrentUser } from "@/lib/session";
import ClubDashboardClient from "@/app/(protected)/clubs/manage/ClubDashboardClient";
import { prisma } from "@/lib/prisma";

export default async function ClubManagePage() {
  const user = await getCurrentUser();

  if (!user || user.ledClubs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-heading font-bold text-xl uppercase tracking-widest text-red-500">
        Yetkiniz yok veya yönettiğiniz bir kulüp bulunamadı.
      </div>
    );
  }

  // Refetch with specific manage relations if needed, or use the one from session
  const clubId = user.ledClubs[0].id;
  const club = await prisma.club.findUnique({
    where: { id: clubId },
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
      },
      leader: true
    }
  });

  if (!club) return <div>Kulüp bulunamadı.</div>;

  // Kulübün anket etkileşimlerini ayrıca çekiyoruz
  const surveyInteractions = await (prisma.interaction as any).findMany({
    where: {
      surveyId: { in: club.surveys.map(s => s.id) },
      type: "VOTE"
    },
    select: { surveyId: true, optionId: true }
  }) as any[];

  // Kulübün postlarındaki şikayetleri çekiyoruz
  const reports = await (prisma as any).report.findMany({
    where: {
      interaction: {
        postId: { in: club.posts.map(p => p.id) }
      }
    },
    include: {
      reporter: { select: { name: true } },
      interaction: {
        include: {
          user: { select: { name: true } },
          post: { select: { title: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }) as any[];

  // Kulüp verisine etkileşimleri ekliyoruz
  const enhancedClub = {
    ...club,
    surveys: club.surveys.map(s => ({
      ...s,
      interactions: surveyInteractions.filter(i => i.surveyId === s.id)
    })),
    reports: reports
  };

  return <ClubDashboardClient club={enhancedClub} />;
}
