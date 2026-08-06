import { prisma } from '@/lib/prisma'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Default to today's appointments if no status filter
  const status = searchParams.get('status')
  const where = status ? { status } : {}

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: { patient: true, doctor: true },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.appointment.count({ where }),
  ])

  return Response.json({
    appointments: appointments.map(a => ({
      ...a,
      doctorEmail: a.doctor.email,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export async function POST(request) {
  const body = await request.json()

  const doctor = await prisma.user.findUnique({
    where: { email: body.doctorEmail },
  })

  if (!doctor) return Response.json({ error: 'Doctor not found' }, { status: 404 })

  const appointment = await prisma.appointment.create({
    data: {
      patientId: body.patientId,
      doctorId: doctor.id,
      date: new Date(body.date),
      time: body.time,
      status: body.status || 'PENDING',
      notes: body.notes || null,
    },
  })

  return Response.json(appointment, { status: 201 })
}
