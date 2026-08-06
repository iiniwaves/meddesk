import { prisma } from '@/lib/prisma'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '5')
  const search = searchParams.get('search') || ''

  const where = search
    ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { patientNo: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {}

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.patient.count({ where }),
  ])

  return Response.json({
    patients,
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

  const patient = await prisma.patient.create({
    data: {
      patientNo: body.patientNo,
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: new Date(body.dateOfBirth),
      gender: body.gender,
      phone: body.phone,
      address: body.address || null,
      bloodGroup: body.bloodGroup || null,
      allergies: body.allergies || [],
      hmo: body.hmo || null,
    },
  })

  return Response.json(patient, { status: 201 })
}
