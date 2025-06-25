// pages/api/auth/reset-request.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { sendPasswordResetEmail } from '../../../lib/mailer'
import { randomBytes } from 'crypto'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end()
  }

  const { email } = req.body
  if (!email) return res.status(400).json({ message: 'Email requerido' })

  const user = await prisma.usuario.findFirst({
    where: {
      OR: [{ email }, { matricula: email }],
    },
  })

  if (user) {
    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 1000 * 60 * 60)

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expires,
      },
    })

    try {
      await sendPasswordResetEmail(user.email, token)
    } catch (err) {
      console.error('Error al enviar correo:', err)
    }
  }

  return res.status(200).json({
    message: 'Si la cuenta existe, recibirás un correo con instrucciones.',
  })
}
