import { PrismaClient } from "@prisma/client";
import FeedClient from "./FeedClient";

const prisma = new PrismaClient();

// Veritabanından postları çeker ve FeedClient bileşenine aktarır
export default async function FeedPage() {
  const currentUser = await prisma.user.findUnique({
    where: { email: "mert@uniblock.com" }
  });

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      club: true,
      author: true
    }
  });

  // Post etkileşimlerini ayrıca çekiyoruz
  const postInteractions = await prisma.interaction.findMany({
    where: {
      postId: { in: posts.map(p => p.id) }
    },
    include: {
      user: {
        select: { name: true, image: true }
      }
    }
  });

  // Postları etkileşimleriyle birleştiriyoruz
  const postsWithInteractions = posts.map(p => ({
    ...p,
    interactions: postInteractions.filter(i => i.postId === p.id)
  }));

  // Kulüplerin performans sıralamasını çeker
  const topClubs = await prisma.club.findMany({
    orderBy: { performanceScore: "desc" },
    take: 5
  });

  // Aktif anketleri çeker
  const surveys = await prisma.survey.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      club: true,
      options: true
    }
  });

  // Anket etkileşimlerini ayrıca çekiyoruz (Type error'u aşmak için Raw Query kullanıyoruz)
  const surveyIds = surveys.map(s => s.id);
  let surveyInteractions: any[] = [];
  
  if (surveyIds.length > 0) {
    surveyInteractions = await prisma.$queryRawUnsafe(`
      SELECT "userId", "optionId", "surveyId" 
      FROM "Interaction" 
      WHERE "surveyId" IN (${surveyIds.map(id => `'${id}'`).join(',')}) 
      AND "type" = 'VOTE'
    `);
  }

  // Anketleri etkileşimleriyle birleştiriyoruz
  const surveysWithInteractions = surveys.map(s => ({
    ...s,
    interactions: surveyInteractions.filter(i => i.surveyId === s.id)
  }));

  return <FeedClient initialPosts={postsWithInteractions} topClubs={topClubs} initialSurveys={surveysWithInteractions} currentUser={currentUser} />;

}
