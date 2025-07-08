import { useState } from 'react'
import Layout from '../components/Layout'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../lib/prisma'

type Props = {
  nombre: string
  apellido: string
}

export default function Perfil({ nombre, apellido }: Props) {
  const [form, setForm] = useState({
    nombre,
    apellido,
    password: '',
    confirm: '',
  })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (form.password && form.password !== form.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: form.nombre,
        apellido: form.apellido,
        password: form.password,
        confirmPassword: form.confirm,
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.message || 'Error al actualizar')
    } else {
      setMessage('Perfil actualizado correctamente')
      setForm(f => ({ ...f, password: '', confirm: '' }))
    }
  }

  return (
    <Layout>
      <section className="page-center">
        <div className="form-card">
          <h2>Mi Perfil</h2>
          {message && (
            <p className="subheading" style={{ color: '#2ecc71' }}>{message}</p>
          )}
          <form onSubmit={handleSubmit} className="form-grid">
            {error && <p className="error-text">{error}</p>}
            <label>Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            <label>Apellido</label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              required
            />
            <label>Nueva contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <label>Confirmar contraseña</label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
            />
            <button type="submit" className="button primary" disabled={loading}>
              {loading ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const session = await getSession(ctx)
  if (!session?.user?.email) {
    return { redirect: { destination: '/auth/signin', permanent: false } }
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { nombre: true, apellido: true },
  })
  if (!user) {
    return { redirect: { destination: '/auth/signin', permanent: false } }
  }
  return { props: { nombre: user.nombre, apellido: user.apellido } }
}
