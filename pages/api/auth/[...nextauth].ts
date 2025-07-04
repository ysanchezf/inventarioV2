// pages/api/auth/[...nextauth].ts
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcrypt'
import { prisma } from '../../../lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: { signIn: '/auth/signin' },
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        matricula: { label: 'Matrícula o Email', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(creds) {
        if (!creds?.matricula || !creds.password) return null

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { matricula: creds.matricula },
              { email: creds.matricula },
            ],
          },
        })
        if (!user || !user.confirmed) return null

        const isValid = await bcrypt.compare(creds.password, user.password)
        if (!isValid) return null

        // 👉 Devuelve el campo "rol" (no "role")
        return {
          id: user.id.toString(),
          name: `${user.nombre} ${user.apellido}`,
          email: user.email,
          rol: user.rol,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email?.endsWith('@unphu.edu.do')) return false
      }
      return true
    },
    // Guardamos el rol en el token
    async jwt({ token, user }) {
      if (user) {
        token.rol = (user as any).rol
      }
      return token
    },
    // Lo exponemos en session.user.rol
    async session({ session, token }) {
      ;(session.user as any).rol = token.rol
      return session
    },
  },
  // Asegúrate de tener esto en tu .env.local:
  // NEXTAUTH_URL=http://localhost:3000
  // NEXTAUTH_SECRET=<una cadena larga de tu elección>
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
