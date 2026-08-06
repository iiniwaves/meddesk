const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash('password123', 10)

  const doctor = await prisma.user.upsert({
    where: { email: 'dr.chidi@medicdesk.com' },
    update: {},
    create: {
      name: 'Dr. Chidi',
      email: 'dr.chidi@medicdesk.com',
      password: hashed,
      role: 'DOCTOR',
    },
  })

  const doctor2 = await prisma.user.upsert({
    where: { email: 'dr.danladi@medicdesk.com' },
    update: {},
    create: {
      name: 'Dr Danladi',
      email: 'dr.danladi@medicdesk.com',
      password: hashed,
      role: 'DOCTOR',
    },
  })

  console.log('✅ Users seeded')

  const patientsData = [
    { patientNo: 'PAT-3290', firstName: 'Chidi', lastName: 'Uzor', dateOfBirth: new Date('2001-01-01'), gender: 'Male', phone: '09123890293', bloodGroup: 'AB+', allergies: ['Peanut Butter', 'Penicillin Allergy'] },
    { patientNo: 'PAT-6728', firstName: 'Bolanle', lastName: 'Onipade', dateOfBirth: new Date('1988-01-01'), gender: 'Female', phone: '09123890293', bloodGroup: 'O+', allergies: [] },
    { patientNo: 'PAT-9902', firstName: 'Odion', lastName: 'Grace', dateOfBirth: new Date('2008-01-01'), gender: 'Female', phone: '09123890293', bloodGroup: 'A+', allergies: [] },
    { patientNo: 'PAT-8390', firstName: 'Bello', lastName: 'Tukur', dateOfBirth: new Date('1996-01-01'), gender: 'Male', phone: '09123890293', bloodGroup: 'B+', allergies: [] },
    { patientNo: 'PAT-1112', firstName: 'Donald', lastName: 'Ebele', dateOfBirth: new Date('1976-01-01'), gender: 'Male', phone: '09123890293', bloodGroup: 'O-', allergies: [] },
    { patientNo: 'PAT-6297', firstName: 'Inioluwa', lastName: 'Boluwaduro', dateOfBirth: new Date('2014-01-01'), gender: 'Female', phone: '09123890293', bloodGroup: 'A+', allergies: [] },
  ]

  const patients = {}
  for (const p of patientsData) {
    patients[p.patientNo] = await prisma.patient.upsert({
      where: { patientNo: p.patientNo },
      update: {},
      create: p,
    })
  }

  console.log('✅ Patients seeded')

  // Appointments
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const appointmentsData = [
    { patientNo: 'PAT-3290', time: '09:15 AM', status: 'DONE', doctorId: doctor2.id },
    { patientNo: 'PAT-6728', time: '09:15 AM', status: 'PENDING', doctorId: doctor2.id },
    { patientNo: 'PAT-9902', time: '10:00 AM', status: 'PENDING', doctorId: doctor2.id },
    { patientNo: 'PAT-8390', time: '10:45 AM', status: 'PENDING', doctorId: doctor.id },
    { patientNo: 'PAT-1112', time: '11:30 AM', status: 'CONFIRMED', doctorId: doctor.id },
    { patientNo: 'PAT-6297', time: '02:00 PM', status: 'PENDING', doctorId: doctor2.id },
  ]

  for (const a of appointmentsData) {
    await prisma.appointment.create({
      data: {
        patientId: patients[a.patientNo].id,
        doctorId: a.doctorId,
        date: today,
        time: a.time,
        status: a.status,
      },
    })
  }

  console.log('✅ Appointments seeded')

  // Visits
  const visitsData = [
    { patientNo: 'PAT-3290', doctorName: 'Dr Danladi', complaint: 'Fever & Headache', diagnosis: 'Malaria', date: new Date('2026-01-09') },
    { patientNo: 'PAT-3290', doctorName: 'Dr Danladi', complaint: 'Body pain', diagnosis: 'Flu', date: new Date('2025-12-15') },
    { patientNo: 'PAT-6728', doctorName: 'Dr. Chidi', complaint: 'Routine checkup', diagnosis: 'Normal', date: new Date('2026-01-09') },
    { patientNo: 'PAT-8390', doctorName: 'Dr Danladi', complaint: 'Cough & Catarrh', diagnosis: 'Upper Respiratory Infection', date: new Date('2025-11-20') },
  ]

  for (const v of visitsData) {
    await prisma.visit.create({
      data: {
        patientId: patients[v.patientNo].id,
        doctorName: v.doctorName,
        complaint: v.complaint,
        diagnosis: v.diagnosis,
        date: v.date,
      },
    })
  }

  console.log('✅ Visits seeded')

  // Drugs
  const drugsData = [
    { name: 'Ibuprofen', quantity: 4, price: 500, category: 'Painkiller' },
    { name: 'Paracetamol', quantity: 4, price: 200, category: 'Painkiller' },
    { name: 'Iverctimin', quantity: 4, price: 1500, category: 'Supplement' },
    { name: 'Amoxicillin', quantity: 50, price: 800, category: 'Antibiotic' },
    { name: 'Metformin', quantity: 30, price: 1200, category: 'Antidiabetic' },
    { name: 'Omeprazole', quantity: 25, price: 600, category: 'Antacid' },
  ]

  for (const d of drugsData) {
    await prisma.drug.upsert({
      where: { name: d.name },
      update: {},
      create: d,
    })
  }

  console.log('✅ Drugs seeded')
  console.log('✅ Seed complete — dr.chidi@medicdesk.com / password123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
