// pages/admin/departments.tsx
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Layout from '../../components/Layout'
import { prisma } from '../../lib/prisma'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

type Usuario = { id: number; nombre: string; apellido: string }
type Departamento = {
  id: number
  nombre: string
  descripcion: string | null
  usuarios: Usuario[]
}

type Props = {
  departamentos: Departamento[]
  usuarios: Usuario[]
}

export default function AdminDepartments({ departamentos, usuarios }: Props) {
  const [list, setList] = useState<Departamento[]>(departamentos)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Departamento | null>(null)
  const [highlightId, setHighlightId] = useState<number | null>(null)
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    usuarios: [] as number[],
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar departamento?')) return
    try {
      const res = await fetch(`/api/admin/departamentos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Error al eliminar departamento')
      }
      setList(l => l.filter(d => d.id !== id))
      toast.success('Departamento eliminado')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ nombre: '', descripcion: '', usuarios: [] })
    setError(null)
    setShowModal(true)
  }

  const openEdit = (dept: Departamento) => {
    setEditing(dept)
    setForm({
      nombre: dept.nombre,
      descripcion: dept.descripcion || '',
      usuarios: dept.usuarios.map(u => u.id),
    })
    setError(null)
    setShowModal(true)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === 'usuarios') {
      const target = e.target as HTMLSelectElement
      const selected = Array.from(target.options)
        .filter(o => o.selected)
        .map(o => Number(o.value))
      setForm(f => ({ ...f, usuarios: selected }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const url = editing
      ? `/api/admin/departamentos/${editing.id}`
      : '/api/admin/departamentos'
    const method = editing ? 'PATCH' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion || undefined,
          usuarios: form.usuarios,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al guardar departamento')

      if (editing) {
        setList(l => l.map(d => d.id === data.id ? data : d))
      } else {
        setList(l => [...l, data])
      }
      setShowModal(false)
      toast.success('Guardado correctamente')
      setHighlightId(data.id)
      setTimeout(() => setHighlightId(null), 2000)
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <section className="app-container header-flex">
        <h2>Gestión de Departamentos</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          Nuevo Departamento
        </button>
      </section>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <header className="modal-header">
              <h3>{editing ? 'Editar Departamento' : 'Nuevo Departamento'}</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}>×</button>
            </header>
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="form-grid">
                {error && <p className="error-text">{error}</p>}

                <input
                  name="nombre"
                  placeholder="Nombre"
                  className="input"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />

                <textarea
                  name="descripcion"
                  placeholder="Descripción (opcional)"
                  className="input"
                  rows={2}
                  value={form.descripcion}
                  onChange={handleChange}
                />

                <label>Asignar Usuarios</label>
                <select
                  name="usuarios"
                  multiple
                  className="input"
                  value={form.usuarios.map(String)}
                  onChange={handleChange}
                >
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.nombre} {u.apellido}
                    </option>
                  ))}
                </select>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Guardando…' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <section className="app-container">
        <table className="table-minimal">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Usuarios</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {list.map(d => (
              <tr key={d.id} className={highlightId === d.id ? 'row-highlight' : ''}>
                <td>{d.nombre}</td>
                <td>{d.descripcion}</td>
                <td>
                  {d.usuarios.map(u => `${u.nombre} ${u.apellido}`).join(', ')}
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => openEdit(d)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-small btn-secondary"
                    style={{ marginLeft: '.5rem' }}
                    onClick={() => handleDelete(d.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const session = await getSession(ctx)
  if (!session?.user || (session.user as any).rol !== 'ADMIN') {
    return { redirect: { destination: '/', permanent: false } }
  }

  // Seleccionamos sólo los campos serializables
  const departamentos = await prisma.departamento.findMany({
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      usuarios: {
        select: { id: true, nombre: true, apellido: true },
      },
    },
    orderBy: { nombre: 'asc' },
  })

  const usuarios = await prisma.usuario.findMany({
    select: { id: true, nombre: true, apellido: true },
    orderBy: { nombre: 'asc' },
  })

  return {
    props: { departamentos, usuarios },
  }
}

