// pages/api/admin/users/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { prisma } from '../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1) Autorización
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return res.status(401).json({ message: 'No autorizado' })
  if ((token as any).rol !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const { id } = req.query
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'ID inválido' })
  }
  const userId = Number(id)
  const actorId = Number(token.sub)

  // 2) PATCH /api/admin/users/:id → editar usuario
  if (req.method === 'PATCH') {
    const { nombre, apellido, email, rol, password } = req.body
    if (!nombre || !apellido || !email || !rol) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' })
    }
    try {
      const before = await prisma.usuario.findUnique({
        where: { id: userId },
        select: { nombre: true, apellido: true, email: true, rol: true }
      })

      const data: any = { nombre, apellido, email, rol }
      if (password) {
        data.password = await bcrypt.hash(password, 10)
      }
      const updated = await prisma.usuario.update({
        where: { id: userId },
        data,
        select: {
          id: true,
          matricula: true,
          nombre: true,
          apellido: true,
          email: true,
          rol: true,
        },
      })
      await prisma.auditLog.create({
        data: {
          userId: actorId,
          action: 'EDITAR',
          entity: 'Usuario',
          entityId: userId,
          changes: { antes: before, despues: { nombre, apellido, email, rol } }
        }
      })

      return res.status(200).json(updated)
    } catch (e: any) {
      console.error(e)
      return res.status(500).json({ message: 'Error al actualizar usuario' })
    }
  }

  // 3) DELETE /api/admin/users/:id → eliminar usuario
  if (req.method === 'DELETE') {
    try {
      const before = await prisma.usuario.findUnique({
        where: { id: userId },
        select: { nombre: true, apellido: true, email: true }
      })

      await prisma.$transaction([
        prisma.solicitud.deleteMany({ where: { usuarioId: userId } }),
        prisma.auditLog.deleteMany({ where: { userId } }),
        prisma.usuario.delete({ where: { id: userId } }),
      ])

      await prisma.auditLog.create({
        data: {
          userId: actorId,
          action: 'ELIMINAR',
          entity: 'Usuario',
          entityId: userId,
          changes: before
        }
      })

      return res.status(204).end()
    } catch (e: any) {
      console.error(e)
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return res
          .status(409)
          .json({ message: 'Error al eliminar usuario' })
      }
      return res.status(500).json({ message: 'Error al eliminar usuario' })
    }
  }

  // 4) Métodos no permitidos
  res.setHeader('Allow', ['PATCH', 'DELETE'])
  return res.status(405).end()
}
