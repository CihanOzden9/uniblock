const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("=== USERS ===");
  users.forEach(u => {
    console.log(`ID: ${u.id} | Email: ${u.email} | Password: ${u.password} | Name: ${u.name} | Role: ${u.role} | Status: ${u.status}`);
  });

  const clubs = await prisma.club.findMany();
  console.log("\n=== CLUBS ===");
  clubs.forEach(c => {
    console.log(`ID: ${c.id} | Name: ${c.name} | Slug: ${c.slug} | Status: ${c.status}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
