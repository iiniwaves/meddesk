const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash('password123', 10)

  await prisma.user.upsert({
    where: { email: 'dr.chidi@medicdesk.com' },
    update: {},
    create: {
      name: 'Dr. Chidi',
      email: 'dr.chidi@medicdesk.com',
      password: hashed,
      role: 'DOCTOR'
    }
  })

  console.log('✅ Seed complete — dr.chidi@medicdesk.com / password123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())