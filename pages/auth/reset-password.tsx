// pages/auth/reset-password.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FiLogIn } from 'react-icons/fi'

export default function ResetPassword() {
  const router = useRouter()
  const { token } = router.query
  const tokenParam = typeof token === 'string' ? token : token?.[0]
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
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenParam, password, confirmPassword: confirm }),
    })
    const data = await res.json()
    setSubmitting(false)
    if (!res.ok) {
      setError(data.message)
    } else {
      setMessage('Contraseña actualizada. Ya puedes iniciar sesión.')
    }
  }

  if (!tokenParam && router.isReady) {
    return (
      <main className="register-page">
        <h2>Cambiar contraseña</h2>
        <p className="subheading">
          El enlace de recuperación no es válido o ha expirado.
        </p>
        <Link href="/auth/forgot-password" className="button primary">
          Solicitar nuevo enlace
        </Link>
      </main>
    )
  }

  if (message) {
    return (
      <main className="register-page">
        <h2>Cambiar contraseña</h2>
        <p className="subheading">{message}</p>
        <Link href="/auth/signin" className="button primary signin-btn">
          <FiLogIn /> Iniciar Sesión
        </Link>
      </main>
    )
  }

  return (
    <main className="register-page">
      <h2>Cambiar contraseña</h2>
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
          {submitting ? 'Actualizando...' : 'Actualizar'}
        </button>
      </form>
    </main>
  )
}
