// pages/api/admin/items/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { prisma } from '../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    return res.status(401).json({ message: 'No autorizado' })
  }
  if ((token as any).rol !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const { id } = req.query
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'ID inválido' })
  }
  const itemId = Number(id)
  const actorId = Number(token.sub)

  if (req.method === 'PATCH') {
    const { nombre, descripcion, cantidadTotal, departamentoId } = req.body
    if (!nombre || !cantidadTotal || !departamentoId) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' })
    }
    try {
      const before = await prisma.item.findUnique({
        where: { id: itemId },
        select: {
          nombre: true,
          descripcion: true,
          cantidadTotal: true,
          departamentoId: true
        }
      })

      const updated = await prisma.item.update({
        where: { id: itemId },
        data: {
          nombre,
          descripcion: descripcion || undefined,
          cantidadTotal: Number(cantidadTotal),
          cantidadDisponible: Number(cantidadTotal), // o ajusta si quieres conservar disponible
          departamento: { connect: { id: Number(departamentoId) } },
        },
      })

      await prisma.auditLog.create({
        data: {
          userId: actorId,
          action: 'EDITAR',
          entity: 'Item',
          entityId: itemId,
          changes: { antes: before, despues: { nombre, descripcion, cantidadTotal: Number(cantidadTotal), departamentoId: Number(departamentoId) } }
        }
      })

      return res.status(200).json(updated)
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({ message: 'Error interno al actualizar equipo' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const before = await prisma.item.findUnique({
        where: { id: itemId },
        select: { nombre: true }
      })

      await prisma.item.delete({ where: { id: itemId } })

      await prisma.auditLog.create({
        data: {
          userId: actorId,
          action: 'ELIMINAR',
          entity: 'Item',
          entityId: itemId,
          changes: before
        }
      })

      return res.status(204).end()
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({ message: 'Error interno al eliminar equipo' })
    }
  }

  res.setHeader('Allow', ['PATCH', 'DELETE'])
  return res.status(405).end()
}
