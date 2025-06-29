// pages/api/confirm.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // El correo de confirmación envía la matrícula como "token"
  const { token } = req.query
  if (typeof token !== 'string') {
    return res.status(400).send('Matrícula inválida')
  }
  try {
    await prisma.usuario.update({
      where: { matricula: token },
      data: { confirmed: true },
    });
    return res.redirect('/auth/signin?confirmed=1');
  } catch (err) {
    console.error('Error confirmando usuario:', err);
    return res.status(500).send('No fue posible confirmar tu cuenta');
  }
}
