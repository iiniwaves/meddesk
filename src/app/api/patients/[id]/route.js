import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const patient = await prisma.patient.findUnique({
    where: { patientNo: params.id }
  })

  if (!patient) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(patient)
}