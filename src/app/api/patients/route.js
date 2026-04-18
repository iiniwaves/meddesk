import { prisma } from '@/lib/prisma'

export async function GET() {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return Response.json(patients)
}