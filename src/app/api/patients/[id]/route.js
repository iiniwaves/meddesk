import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  const { id } = await params

  const patient = await prisma.patient.findUnique({
    where: { patientNo: id }
  })

  if (!patient) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(patient)
}