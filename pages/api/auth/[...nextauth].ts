// pages/api/auth/[...nextauth].ts
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { CustomPrismaAdapter } from '../../../lib/customPrismaAdapter'
import bcrypt from 'bcrypt'
import { prisma } from '../../../lib/prisma'

// Ensure Google OAuth scopes are defined before initializing NextAuth.
if (!process.env.GOOGLE_OAUTH_SCOPES || process.env.GOOGLE_OAUTH_SCOPES.trim() === '') {
  console.warn(
    'GOOGLE_OAUTH_SCOPES is not set or empty. Using default "openid profile email". Check your .env file.'
  )
  process.env.GOOGLE_OAUTH_SCOPES = 'openid profile email'
}

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(prisma),
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
          // Keep the numeric id so other adapter methods receive a number
          // instead of a string.
          id: user.id,
          name: `${user.nombre} ${user.apellido}`,
          email: user.email,
          rol: user.rol,
          mustCreatePassword: user.mustCreatePassword,
        } as any
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { scope: process.env.GOOGLE_OAUTH_SCOPES } },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const allowedDomain = '@unphu.edu.do'
        if (!user.email?.endsWith(allowedDomain)) {
          return false
        }
      }

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })
      if (dbUser?.mustCreatePassword) {
        return '/auth/set-password'
      }
      return true
    },
    // Guardamos el rol en el token
    async jwt({ token, user }) {
      if (user) {
        token.rol = (user as any).rol
        token.mustCreatePassword = (user as any).mustCreatePassword
      }
      return token
    },
    // Lo exponemos en session.user.rol
    async session({ session, token }) {
      ;(session.user as any).rol = token.rol
      ;(session.user as any).mustCreatePassword = token.mustCreatePassword
      return session
    },
  },
  // Asegúrate de tener esto en tu .env.local:
  // NEXTAUTH_URL=http://localhost:3000
  // NEXTAUTH_SECRET=<una cadena larga de tu elección>
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
