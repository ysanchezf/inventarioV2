import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { FiHome } from 'react-icons/fi'
import Layout from '../components/Layout'

type Props = {
  defaultPassword: string
}

export default function RegistroExitoso({ defaultPassword }: Props) {
  return (
    <Layout>
      <main className="register-page">
        <h2>¡Registro exitoso!</h2>
        <p className="subheading">
          Tu contraseña temporal es <strong>{defaultPassword}</strong>. Cambíala
          desde la página "Mi Perfil" cuando inicies sesión.
        </p>
        <Link href="/" className="button primary signin-btn">
          <FiHome /> Ir al inicio
        </Link>
      </main>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const session = await getSession(ctx)
  if (!session?.user?.email) {
    return { redirect: { destination: '/auth/signin', permanent: false } }
  }
  const matricula = session.user.email.split('@')[0]
  return { props: { defaultPassword: `${matricula}@2020` } }
}
