const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // existing user seed
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

  // paste the patients code here, below the user seed
  const patients = [
    { patientNo: 'PAT-3290', firstName: 'Chidi', lastName: 'Uzor', dateOfBirth: new Date('2001-01-01'), gender: 'Male', phone: '09123890293', bloodGroup: 'AB+', allergies: ['Peanut Butter', 'Penicillin Allergy'] },
    { patientNo: 'PAT-6728', firstName: 'Bolanle', lastName: 'Onipade', dateOfBirth: new Date('1988-01-01'), gender: 'Female', phone: '09123890293', bloodGroup: 'O+', allergies: [] },
    { patientNo: 'PAT-9902', firstName: 'Odion', lastName: 'Grace', dateOfBirth: new Date('2008-01-01'), gender: 'Female', phone: '09123890293', bloodGroup: 'A+', allergies: [] },
    { patientNo: 'PAT-8390', firstName: 'Bello', lastName: 'Tukur', dateOfBirth: new Date('1996-01-01'), gender: 'Male', phone: '09123890293', bloodGroup: 'B+', allergies: [] },
    { patientNo: 'PAT-1112', firstName: 'Donald', lastName: 'Ebele', dateOfBirth: new Date('1976-01-01'), gender: 'Male', phone: '09123890293', bloodGroup: 'O-', allergies: [] },
    { patientNo: 'PAT-6297', firstName: 'Inioluwa', lastName: 'Boluwaduro', dateOfBirth: new Date('2014-01-01'), gender: 'Female', phone: '09123890293', bloodGroup: 'A+', allergies: [] },
  ]

  for (const p of patients) {
    await prisma.patient.upsert({
      where: { patientNo: p.patientNo },
      update: {},
      create: p,
    })
  }

  console.log('✅ Patients seeded')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())