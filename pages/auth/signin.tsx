// pages/auth/signin.tsx
import { useState, FormEvent } from 'react'
import { FiLogIn } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { getCsrfToken, signIn, getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'

type Props = {
  csrfToken: string | null
  confirmed: string | null
}

export default function SignIn({ csrfToken, confirmed }: Props) {
  const router = useRouter()
  const [matricula, setMatricula] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(
    confirmed ? 'Cuenta confirmada, ya puedes iniciar sesión' : null
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMsg(null)

    // Intentamos login sin redirigir
    const res = await signIn('credentials', {
      redirect: false,
      matricula,
      password,
    })

    if (res?.error) {
      setMsg('Matrícula o contraseña incorrecta')
      return
    }

    // Login OK: obtenemos la sesión actual
    const session = await getSession()
    const rol = (session?.user as any)?.rol

    if (rol === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/')
    }
  }

  return (
    <main className="register-page">
      <h2>Iniciar Sesión</h2>
      {msg && <p className="subheading" style={{ color: msg.includes('incorrecta') ? 'red' : undefined }}>{msg}</p>}
      <form className="form-card" onSubmit={handleSubmit}>
        {csrfToken && <input name="csrfToken" type="hidden" defaultValue={csrfToken} />}
        <div className="form-group">
          <label>Matrícula o Email</label>
          <input
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-row">
          <button type="submit" className="button primary signin-btn">
            <FiLogIn /> Iniciar Sesión
          </button>
          <Link href="/register" className="button secondary">
            Registrarse
          </Link>
        </div>
        <Link href="/auth/forgot-password" className="forgot-link">
          Olvidé mi contraseña
        </Link>
        <p className="auth-alt-text">Puedes iniciar sesión con el siguiente servicio:</p>
        <button
          type="button"
          className="google-icon-btn"
          onClick={() =>
            signIn('google', { callbackUrl: '/', prompt: 'select_account' })
          }
        >
          <FcGoogle size={24} />
        </button>
      </form>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const rawToken = await getCsrfToken(ctx)
  return {
    props: {
      csrfToken: typeof rawToken === 'string' ? rawToken : null,
      confirmed: typeof ctx.query.confirmed === 'string' ? ctx.query.confirmed : null,
    },
  }
}
