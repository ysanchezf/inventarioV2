// pages/auth/forgot-password.tsx
import { useState } from 'react'
import Link from 'next/link'
import { FiLogIn } from 'react-icons/fi'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const res = await fetch('/api/auth/reset-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setSubmitting(false)
    if (!res.ok) {
      setError(data.message)
    } else {
      setMessage(data.message)
    }
  }

  if (message) {
    return (
      <main className="register-page">
        <h2>Recuperar contraseña</h2>
        <p className="subheading">{message}</p>
        <Link href="/auth/signin" className="button primary signin-btn">
          <FiLogIn /> Iniciar Sesión
        </Link>
      </main>
    )
  }

  return (
    <main className="register-page">
      <h2>¿Olvidaste tu contraseña?</h2>
      <p className="subheading">Ingresa tu correo para recibir instrucciones</p>
      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <div className="form-group">
          <label>Email o Matrícula</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button primary large full-width" disabled={submitting}>
          {submitting ? 'Enviando...' : 'Enviar'}
        </button>
        <div className="divider">¿Ya recordaste?</div>
        <Link href="/auth/signin" className="button secondary large full-width signin-btn">
          <FiLogIn /> Iniciar Sesión
        </Link>
      </form>
    </main>
  )
}
