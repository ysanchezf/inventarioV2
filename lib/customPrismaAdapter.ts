import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import type { Adapter, AdapterUser } from 'next-auth/adapters'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

/**
 * Prisma adapter extendido para poblar campos personalizados
 * cuando se crea un usuario via OAuth (ej. Google).
 */
export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  const baseAdapter = PrismaAdapter(prisma)

  return {
    ...baseAdapter,
    async createUser(data: any) {
      const [nombre, ...rest] = data.name?.split(' ') ?? ['']
      const apellido = rest.join(' ')
      const matricula = data.email
        ? data.email.split('@')[0]
        : randomBytes(6).toString('hex')
      const password = await bcrypt.hash(randomBytes(16).toString('hex'), 10)

      const user = await prisma.user.create({
        data: {
          matricula,
          nombre,
          apellido,
          email: data.email!,
          password,
          confirmed: true,
        },
      })

      return {
        id: user.id.toString(),
        name: data.name ?? null,
        email: user.email,
        emailVerified: null,
      } as AdapterUser
    },
  }
}
