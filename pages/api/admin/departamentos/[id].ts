// pages/api/admin/departamentos/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { prisma } from '../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return res.status(401).json({ message: 'No autorizado' })
  if ((token as any).rol !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' })

  const { id } = req.query
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'ID inválido' })
  }
  const depId = Number(id)
  const actorId = Number(token.sub)

  // Actualizar departamento o sus usuarios
  if (req.method === 'PATCH') {
    const { nombre, descripcion, usuarios } = req.body
    // usuarios: array de user IDs a asignar
    if (!nombre) {
      return res.status(400).json({ message: 'Falta nombre' })
    }
    try {
      const before = await prisma.departamento.findUnique({
        where: { id: depId },
        select: { nombre: true, descripcion: true }
      })

      const data: any = { nombre, descripcion: descripcion || undefined }
      if (Array.isArray(usuarios)) {
        data.usuarios = {
          set: usuarios.map((uid: number) => ({ id: uid })),
        }
      }
      const updated = await prisma.departamento.update({
        where: { id: depId },
        data,
        include: { usuarios: { select: { id: true } } },
      })
      await prisma.auditLog.create({
        data: {
          userId: actorId,
          action: 'EDITAR',
          entity: 'Departamento',
          entityId: depId,
          changes: { antes: before, despues: { nombre, descripcion } }
        }
      })
      return res.status(200).json(updated)
    } catch (e: any) {
      console.error(e)
      return res.status(500).json({ message: 'Error al actualizar departamento' })
    }
  }

  // Eliminar departamento
  if (req.method === 'DELETE') {
    try {
      const before = await prisma.departamento.findUnique({
        where: { id: depId },
        select: { nombre: true }
      })

      await prisma.departamento.delete({ where: { id: depId } })

      await prisma.auditLog.create({
        data: {
          userId: actorId,
          action: 'ELIMINAR',
          entity: 'Departamento',
          entityId: depId,
          changes: before || undefined,
        },
      })

      return res.status(204).end()
    } catch (e: any) {
      console.error(e)
      return res.status(500).json({ message: 'Error al eliminar departamento' })
    }
  }

  res.setHeader('Allow', ['PATCH','DELETE'])
  return res.status(405).end()
}
