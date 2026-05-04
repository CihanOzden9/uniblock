import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const updatedUser = await prisma.user.update({
    where: { email: "mert@uniblock.com" },
    data: {
      password: "123456"
    }
  });
  console.log("Password updated for:", updatedUser.email);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
