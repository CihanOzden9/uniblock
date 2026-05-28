const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function simulateLogin(email, password) {
  console.log(`\n[Giriş Denemesi] E-posta: ${email}`);
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: false, error: "Hatalı e-posta veya şifre." };
  }

  if (user.password !== password) {
    return { success: false, error: "Hatalı e-posta veya şifre." };
  }

  // Durum kontrolü
  if (user.status !== "ACTIVE") {
    return { success: false, error: `Hesap aktif değil, mevcut durum: ${user.status}` };
  }

  return { success: true, role: user.role, name: user.name };
}

async function runTests() {
  console.log("Kimlik Doğrulama Mantığı Testleri Başlatılıyor...");

  // Test 1: Admin Girişi
  const adminResult = await simulateLogin("admin@admin.com", "admin");
  console.log("Sonuç:", adminResult);
  if (adminResult.success && adminResult.role === "SUPER_ADMIN") {
    console.log("✅ TEST 1 BAŞARILI: Admin girişi sorunsuz çalışıyor.");
  } else {
    console.error("❌ TEST 1 BAŞARISIZ: Admin girişi hatası.");
  }

  // Test 2: Hatalı Şifre Denemesi
  const failResult = await simulateLogin("admin@admin.com", "yanlis-sifre");
  console.log("Sonuç:", failResult);
  if (!failResult.success && failResult.error === "Hatalı e-posta veya şifre.") {
    console.log("✅ TEST 2 BAŞARILI: Hatalı şifre doğru şekilde reddedildi.");
  } else {
    console.error("❌ TEST 2 BAŞARISIZ: Hatalı şifre testi.");
  }

  // Test 3: Kulüp Yöneticisi Girişi
  const clubAdminResult = await simulateLogin("akuyazilim@uniblock.com", "000000");
  console.log("Sonuç:", clubAdminResult);
  if (clubAdminResult.success && clubAdminResult.role === "CLUB_ADMIN") {
    console.log("✅ TEST 3 BAŞARILI: Kulüp Yöneticisi girişi sorunsuz çalışıyor.");
  } else {
    console.error("❌ TEST 3 BAŞARISIZ: Kulüp Yöneticisi girişi hatası.");
  }
}

runTests()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
