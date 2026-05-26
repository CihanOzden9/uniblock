const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@admin.com';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log('Admin user already exists!');
    return;
  }

  const user = await prisma.user.create({
    data: {
      email: adminEmail,
      password: 'admin',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    }
  });

  console.log('Admin user created successfully:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
