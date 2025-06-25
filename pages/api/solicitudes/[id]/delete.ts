// pages/api/solicitudes/[id]/delete.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { prisma } from '../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE'])
    return res.status(405).end()
  }
  // autorización…
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return res.status(401).json({ message: 'No autorizado' })
  const actorId = Number(token.sub)

  const rawId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
  const id     = Number(rawId)
  if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' })

  const before = await prisma.solicitud.findUnique({
    where: { id },
    select: { usuarioId: true, itemId: true }
  })

  await prisma.solicitud.update({
    where: { id },
    data: { deleted: true, deletedAt: new Date() }
  })

  await prisma.auditLog.create({
    data: {
      userId: actorId,
      action: 'ELIMINAR',
      entity: 'Solicitud',
      entityId: id,
      changes: before || undefined,
    },
  })

  return res.status(204).end()
}
