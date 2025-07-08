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
      const allowedDomain = '@unphu.edu.do'
      if (!data.email?.endsWith(allowedDomain)) {
        throw new Error('Solo se permiten correos ' + allowedDomain)
      }

      const [nombre, ...rest] = data.name?.split(' ') ?? ['']
      const apellido = rest.join(' ')
      const matricula = data.email
        ? data.email.split('@')[0]
        : randomBytes(6).toString('hex')
      // Establecemos la contraseña por defecto con el formato "{matricula}@2020"
      const defaultPassword = `${matricula}@2020`
      const password = await bcrypt.hash(defaultPassword, 10)

      const user = await prisma.user.create({
        data: {
          matricula,
          nombre,
          apellido,
          email: data.email!,
          password,
          confirmed: true,
          // El usuario ya tiene una contraseña asignada, por lo que no
          // requerimos que cree una al iniciar sesión
          mustCreatePassword: false,
        },
      })

      return {
        // Return the numeric id directly instead of casting to a string.
        // The object is later cast to `AdapterUser`, which expects `id` to be
        // a string, but keeping it as a number avoids issues when other
        // adapter methods (e.g. linkAccount) expect an integer.
        id: user.id,
        name: data.name ?? null,
        email: user.email,
        emailVerified: null,
      } as unknown as AdapterUser
    },
    /**
     * The default Prisma adapter expects string IDs, but our schema uses
     * integers. Convert incoming values to numbers before delegating to
     * Prisma.
     */
    async getUser(id: string) {
      const parsed = Number(id)
      if (!Number.isSafeInteger(parsed)) return null
      return prisma.user.findUnique({
        where: { id: parsed },
      }) as unknown as AdapterUser | null
    },
    async updateUser({ id, ...data }: Partial<AdapterUser> & Pick<AdapterUser, 'id'>) {
      return prisma.user.update({ where: { id: Number(id) }, data }) as unknown as
        AdapterUser
    },
    async deleteUser(id: string) {
      return prisma.user.delete({ where: { id: Number(id) } }) as unknown as
        AdapterUser
    },
    async linkAccount(data: any) {
      return baseAdapter.linkAccount!({
        ...data,
        userId: Number(data.userId),
      })
    },
    async createSession(data: any) {
      return baseAdapter.createSession!({
        ...data,
        userId: Number(data.userId),
      })
    },
  }
}
