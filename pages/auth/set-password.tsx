import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { FiLogIn } from 'react-icons/fi'
import Layout from '../../components/Layout'

export default function SetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setSubmitting(true)
    const res = await fetch('/api/auth/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, confirmPassword: confirm }),
    })
    const data = await res.json()
    setSubmitting(false)
    if (!res.ok) {
      setError(data.message)
    } else {
      setMessage('Contraseña actualizada correctamente.')
    }
  }

  if (message) {
    return (
      <Layout>
        <main className="register-page">
          <h2>Crear contraseña</h2>
          <p className="subheading">{message}</p>
          <Link href="/auth/signin" className="button primary signin-btn">
            <FiLogIn /> Iniciar Sesión
          </Link>
        </main>
      </Layout>
    )
  }

  return (
    <Layout>
      <main className="register-page">
      <h2>Crear contraseña</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <div className="form-group">
          <label>Nueva contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={6}
            required
          />
        </div>
        <button type="submit" className="button primary large full-width" disabled={submitting}>
          {submitting ? 'Actualizando...' : 'Guardar'}
        </button>
      </form>
    </main>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  if (!session?.user) {
    return { redirect: { destination: '/auth/signin', permanent: false } }
  }
  return { props: {} }
}
