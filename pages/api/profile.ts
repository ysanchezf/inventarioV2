import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import bcrypt from 'bcrypt'
import { prisma } from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return res.status(401).json({ message: 'No autorizado' })

  const userId = Number(token.sub)

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nombre: true, apellido: true, email: true, matricula: true },
    })
    return res.status(200).json(user)
  }

  if (req.method === 'PATCH' || req.method === 'POST') {
    const { nombre, apellido, password, confirmPassword } = req.body as {
      nombre?: string
      apellido?: string
      password?: string
      confirmPassword?: string
    }
    if (!nombre || !apellido) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' })
    }
    const data: any = { nombre, apellido }
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden' })
      }
      data.password = await bcrypt.hash(password!, 10)
    }
    await prisma.user.update({ where: { id: userId }, data })
    return res.status(200).json({ message: 'Perfil actualizado' })
  }

  res.setHeader('Allow', ['GET', 'PATCH'])
  res.status(405).end()
}
