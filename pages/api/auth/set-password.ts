import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import bcrypt from 'bcrypt'
import { authOptions } from './[...nextauth]'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ message: 'No autorizado' })

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end()
  }

  const { password, confirmPassword } = req.body as { password?: string; confirmPassword?: string }
  if (!password || !confirmPassword) {
    return res.status(400).json({ message: 'Datos incompletos' })
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' })
  }

  const hash = await bcrypt.hash(password, 10)

  await (prisma.user.update as any)({
    where: { id: Number((session.user as any).id) },
    data: { password: hash, mustCreatePassword: false } as any,
  })

  return res.status(200).json({ message: 'Contraseña actualizada' })
}
