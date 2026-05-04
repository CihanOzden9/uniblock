import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const club = await prisma.club.findFirst({
    where: {
      name: {
        contains: "Yazılım",
        mode: "insensitive"
      }
    },
    include: {
      leader: true
    }
  });

  if (club) {
    console.log("Club Found:", club.name);
    console.log("Leader Name:", club.leader.name);
    console.log("Leader Email:", club.leader.email);
    console.log("Leader Password:", club.leader.password);
  } else {
    console.log("Club not found.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
