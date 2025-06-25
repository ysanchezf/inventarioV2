// pages/api/auth/reset-password.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end()
  }

  const { token, password, confirmPassword } = req.body
  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Datos incompletos' })
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' })
  }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } })
  if (!record || record.expires < new Date()) {
    return res.status(400).json({ message: 'Token inválido o expirado' })
  }

  const hash = await bcrypt.hash(password, 10)
  await prisma.usuario.update({
    where: { id: record.userId },
    data: { password: hash },
  })
  await prisma.passwordResetToken.delete({ where: { id: record.id } })

  return res.status(200).json({ message: 'Contraseña actualizada' })
}
