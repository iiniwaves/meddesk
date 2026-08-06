import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  const { id } = await params

  const patient = await prisma.patient.findUnique({
    where: { patientNo: id },
    include: { visits: { orderBy: { date: 'desc' } } },
  })

  if (!patient) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(patient)
}

export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json()

  const patient = await prisma.patient.update({
    where: { patientNo: id },
    data: {
      ...(body.firstName && { firstName: body.firstName }),
      ...(body.lastName && { lastName: body.lastName }),
      ...(body.dateOfBirth && { dateOfBirth: new Date(body.dateOfBirth) }),
      ...(body.gender && { gender: body.gender }),
      ...(body.phone && { phone: body.phone }),
      ...(body.address !== undefined && { address: body.address }),
      ...(body.bloodGroup !== undefined && { bloodGroup: body.bloodGroup }),
      ...(body.allergies && { allergies: body.allergies }),
      ...(body.hmo !== undefined && { hmo: body.hmo }),
    },
  })

  return Response.json(patient)
}

export async function DELETE(request, { params }) {
  const { id } = await params

  await prisma.patient.delete({ where: { patientNo: id } })
  return Response.json({ success: true })
}
