import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding veritabanı...')

  // 1. Örnek Kullanıcı (Öğrenci)
  const student = await prisma.user.upsert({
    where: { email: 'ahmet@uniblock.com' },
    update: {},
    create: {
      email: 'ahmet@uniblock.com',
      name: 'Ahmet Yılmaz',
      role: 'STUDENT',
      faculty: 'Mühendislik Fakültesi',
      department: 'Bilgisayar Mühendisliği',
    },
  })

  // 2. Örnek Kullanıcı (Kulüp Yöneticisi)
  const clubAdmin = await prisma.user.upsert({
    where: { email: 'mert@uniblock.com' },
    update: {},
    create: {
      email: 'mert@uniblock.com',
      name: 'Mert Demir',
      role: 'CLUB_ADMIN',
    },
  })

  // 3. Örnek Kulüp
  const yazilimKulubu = await prisma.club.upsert({
    where: { slug: 'yazilim-kulubu' },
    update: {},
    create: {
      name: 'Yazılım Kulübü',
      slug: 'yazilim-kulubu',
      description: 'Kampüsün en aktif yazılım topluluğu.',
      leaderId: clubAdmin.id,
      performanceScore: 1250,
    },
  })

  // 4. Örnek İçerik (Duyuru)
  await prisma.post.create({
    data: {
      title: 'Hackathon 2026 Başvuruları Başladı!',
      content: 'Büyük ödüllü yazılım maratonu için kayıtlar açıldı. Takımını kur ve katıl!',
      type: 'ANNOUNCEMENT',
      authorId: clubAdmin.id,
      clubId: yazilimKulubu.id,
    },
  })

  console.log('Seeding tamamlandı.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
