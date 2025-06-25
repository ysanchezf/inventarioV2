// pages/api/admin/requests/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { prisma } from '../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return res.status(401).json({ message: 'No autorizado' })
  const userId = Number(token.sub)
  const role   = (token as any).rol

  if (req.method === 'GET') {
    // filtros
    const q      = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q
    const estado = Array.isArray(req.query.estado) ? req.query.estado[0] : req.query.estado
    const entidadIdRaw = Array.isArray(req.query.entidadId) ? req.query.entidadId[0] : req.query.entidadId
    const fechaRaw     = Array.isArray(req.query.fecha)     ? req.query.fecha[0]     : req.query.fecha
    const usuarioRaw   = Array.isArray(req.query.usuario)   ? req.query.usuario[0]   : req.query.usuario
    const itemRaw      = Array.isArray(req.query.item)      ? req.query.item[0]      : req.query.item

    // baseWhere según rol
    const baseWhere = role === 'ADMIN'
      ? {}
      : { item: { departamento: { usuarios: { some: { id: userId } } } } }

    // condiciones extras
    const and: any[] = []
    if (q)      and.push({ item: { nombre: { contains: q } } })
    if (estado) and.push({ estado })
    if (entidadIdRaw) {
      const id = Number(entidadIdRaw)
      if (!isNaN(id)) and.push({ id })
    }
    if (fechaRaw) {
      const date = new Date(fechaRaw)
      if (!isNaN(date.getTime())) {
        const next = new Date(date)
        next.setDate(date.getDate() + 1)
        and.push({ fechaSolicitud: { gte: date, lt: next } })
      }
    }
    if (usuarioRaw) {
      and.push({
        usuario: {
          OR: [

            { nombre: { contains: usuarioRaw, mode: 'insensitive' } },
            { apellido: { contains: usuarioRaw, mode: 'insensitive' } },

            { nombre: { contains: usuarioRaw } },
            { apellido: { contains: usuarioRaw } },

          ]
        }
      })
    }
    if (itemRaw) {

      and.push({ item: { nombre: { contains: itemRaw, mode: 'insensitive' } } })

      and.push({ item: { nombre: { contains: itemRaw } } })

    }

    const where = Object.keys(baseWhere).length
      ? { AND: [ baseWhere, ...and ] }
      : { AND: and }

    const raw = await prisma.solicitud.findMany({
      where,
      include: {
        item: {
          select: {
            nombre: true,
            departamento: { select: { nombre: true } }
          }
        },
        usuario: { select: { nombre: true, apellido: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    const solicitudes = raw.map(s => ({
      id:             s.id,
      motivo:         s.motivo,
      estado:         s.estado,
      fechaSolicitud: s.fechaSolicitud.toISOString(),
      item:           { nombre: s.item.nombre, departamento: s.item.departamento.nombre },
      usuario:        { nombre: s.usuario.nombre, apellido: s.usuario.apellido, email: s.usuario.email },
      comentarios:    s.comentarios,
    }))
    return res.status(200).json(solicitudes)
  }

  res.setHeader('Allow', ['GET'])
  return res.status(405).end()
}
