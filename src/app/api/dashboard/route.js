import { prisma } from '@/lib/prisma'

export async function GET() {
  const now = new Date()
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const tomorrow = new Date(today)
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)

  const [
    todayPatientCount,
    todayAppointments,
    appointments,
    recentPatients,
    lowStockDrugs,
  ] = await Promise.all([
    prisma.patient.count({
      where: { createdAt: { gte: today, lt: tomorrow } },
    }),
    prisma.appointment.count({
      where: { date: { gte: today, lt: tomorrow } },
    }),
    prisma.appointment.findMany({
      where: { date: { gte: today, lt: tomorrow } },
      include: { patient: true, doctor: true },
      orderBy: { time: 'asc' },
    }),
    prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.drug.findMany({
      where: { quantity: { lte: 10 } },
      orderBy: { quantity: 'asc' },
      take: 5,
    }),
  ])

  return Response.json({
    stats: {
      todayPatients: todayPatientCount,
      appointments: todayAppointments,
    },
    appointments: appointments.map(a => ({
      patient: `${a.patient.firstName} ${a.patient.lastName}`,
      time: a.time,
      doctor: a.doctor.name,
      status: a.status.toLowerCase(),
    })),
    recentPatients: recentPatients.map(p => {
      const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear()
      return {
        name: `${p.firstName} ${p.lastName}`,
        info: `${age}, ${p.gender === 'Male' ? 'M' : 'F'}`,
      }
    }),
    lowStock: lowStockDrugs.map(d => ({
      drug: d.name,
      qty: d.quantity,
    })),
  })
}
