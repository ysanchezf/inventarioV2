// pages/api/confirm.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query
  if (typeof token !== 'string') {
    return res.status(400).send('Token inválido')
  }
  try {
    const record = await prisma.emailVerificationToken.findUnique({
      where: { token },
    })
    if (!record || record.expires < new Date()) {
      return res.status(400).send('Token inválido o expirado')
    }

    await prisma.user.update({
      where: { id: record.userId },
      data: { confirmed: true },
    })
    await prisma.emailVerificationToken.delete({ where: { id: record.id } })
    return res.redirect('/auth/signin?confirmed=1')
  } catch (err) {
    console.error('Error confirmando usuario:', err)
    return res.status(500).send('No fue posible confirmar tu cuenta')
  }
}
