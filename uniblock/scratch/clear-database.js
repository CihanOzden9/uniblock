const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Veritabanı temizleme işlemi başlatılıyor...");

  // 1. Şikayetleri sil
  const deletedReports = await prisma.report.deleteMany({});
  console.log(`- ${deletedReports.count} adet şikayet silindi.`);

  // 2. Etkileşimleri sil
  const deletedInteractions = await prisma.interaction.deleteMany({});
  console.log(`- ${deletedInteractions.count} adet etkileşim silindi.`);

  // 3. Postları sil
  const deletedPosts = await prisma.post.deleteMany({});
  console.log(`- ${deletedPosts.count} adet gönderi/duyuru silindi.`);

  // 4. Etkinlikleri sil
  const deletedEvents = await prisma.event.deleteMany({});
  console.log(`- ${deletedEvents.count} adet etkinlik silindi.`);

  // 5. Anket seçeneklerini sil
  const deletedSurveyOptions = await prisma.surveyOption.deleteMany({});
  console.log(`- ${deletedSurveyOptions.count} adet anket seçeneği silindi.`);

  // 6. Anketleri sil
  const deletedSurveys = await prisma.survey.deleteMany({});
  console.log(`- ${deletedSurveys.count} adet anket silindi.`);

  // 7. Kulüp üyeliklerini sil
  const deletedClubMembers = await prisma.clubMember.deleteMany({});
  console.log(`- ${deletedClubMembers.count} adet kulüp üyeliği silindi.`);

  // 8. Kulüpleri sil
  const deletedClubs = await prisma.club.deleteMany({});
  console.log(`- ${deletedClubs.count} adet kulüp silindi.`);

  // 9. Proje/Takım kayıtlarını sil
  const deletedProjects = await prisma.projectTeam.deleteMany({});
  console.log(`- ${deletedProjects.count} adet proje/takım silindi.`);

  // 10. İşletmeleri sil
  const deletedBusinesses = await prisma.business.deleteMany({});
  console.log(`- ${deletedBusinesses.count} adet işletme silindi.`);

  // 11. SUPER_ADMIN olmayan kullanıcıları sil
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      role: {
        not: "SUPER_ADMIN"
      }
    }
  });
  console.log(`- ${deletedUsers.count} adet SUPER_ADMIN olmayan kullanıcı silindi.`);

  console.log("\nKalan Kullanıcılar (Sadece SUPER_ADMIN olmalı):");
  const remainingUsers = await prisma.user.findMany();
  remainingUsers.forEach(u => {
    console.log(`ID: ${u.id} | Name: ${u.name} | Email: ${u.email} | Role: ${u.role}`);
  });

  console.log("\nVeritabanı temizleme işlemi başarıyla tamamlandı!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
