import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      role: true,
      password: true // Note: These might be hashed if using auth properly
    }
  });

  console.log("--- UNI BLOCK KULLANICI LİSTESİ ---");
  users.forEach(user => {
    console.log(`İsim: ${user.name || 'Belirtilmemiş'}`);
    console.log(`E-posta: ${user.email}`);
    console.log(`Rol: ${user.role}`);
    console.log(`Şifre: ${user.password || 'Girilmemiş'}`);
    console.log('-----------------------------------');
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
