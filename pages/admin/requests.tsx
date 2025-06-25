// pages/admin/requests.tsx
import { useSession } from 'next-auth/react'
import Layout from '../../components/Layout'
import { useState, useEffect } from 'react'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'

type Solicitud = {
  id: number
  motivo: string
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'FINALIZADA'
  fechaSolicitud: string
  usuario: { nombre: string }
  item: { nombre: string }
  comentarios?: string | null
}

export default function AdminRequestsPage() {
  const { data: session } = useSession()
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [fecha, setFecha] = useState('')
  const [usuario, setUsuario] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()

    if (fecha) params.set('fecha', fecha)
    if (usuario) params.set('usuario', usuario)
    if (search) params.set('q', search)

    fetch(`/api/admin/requests?${params.toString()}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json()
      })
      .then((data: Solicitud[]) => setSolicitudes(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [fecha, usuario, search])

  const handleUpdate = async (
    id: number,
    newEstado: 'APROBADA' | 'RECHAZADA'
  ) => {
    const comentario = prompt(
      'Indica el nombre del estudiante o responsable del retiro:',
      ''
    )
    if (comentario === null) return

    const res = await fetch(`/api/admin/requests/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: newEstado, comentario }),
    })
    if (!res.ok) {
      alert(`Error ${res.status}`)
    } else {
      setSolicitudes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: newEstado } : r))
      )
    }
  }

  const handleDeliver = async (id: number) => {
    const res = await fetch(`/api/solicitudes/${id}/return`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!res.ok) {
      alert(`Error al marcar entrega: ${res.status}`)
    } else {
      setSolicitudes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: 'FINALIZADA' } : r))
      )
    }
  }

  if (loading) return <Layout><p>Cargando…</p></Layout>
  if (error) return <Layout><p style={{ color: 'red' }}>Error: {error}</p></Layout>
  if (!session || (session.user as any).rol !== 'ADMIN') {
    return <Layout><p>No tienes permiso para ver esta página.</p></Layout>
  }

  return (
    <Layout>
      <section className="app-container">
        <h2>Revisión de Solicitudes</h2>

        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
          <input type="text" placeholder="Usuario" value={usuario} onChange={e => setUsuario(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
          <input type="text" placeholder="Buscar equipo…" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
          <button className="btn btn-small btn-primary" onClick={() => setSearch(searchInput)}>
            Filtrar
          </button>
        </div>

        <table className="table-minimal">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Equipo</th>
              <th>Estado</th>
              <th>Motivo</th>
              <th>Comentarios</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s) => (
              <tr key={s.id}>
                <td>{new Date(s.fechaSolicitud).toLocaleDateString()}</td>
                <td>{s.usuario.nombre}</td>
                <td>{s.item.nombre}</td>
                <td>{s.estado}</td>
                <td>{s.motivo}</td>
                <td>{s.comentarios ?? '—'}</td>
                <td>
                  {s.estado === 'PENDIENTE' && (
                    <>
                      <button className="btn btn-primary btn-small" onClick={() => handleUpdate(s.id, 'APROBADA')}>
                        <FiCheckCircle size={14} /> Aprobar
                      </button>{' '}
                      <button className="btn btn-secondary btn-small" onClick={() => handleUpdate(s.id, 'RECHAZADA')}>
                        <FiXCircle size={14} /> Rechazar
                      </button>
                    </>
                  )}
                  {s.estado === 'APROBADA' && (
                    <button className="btn btn-primary btn-small" onClick={() => handleDeliver(s.id)}>
                      Marcar entregado
                    </button>
                  )}
                  {s.estado === 'FINALIZADA' && <span>Finalizada</span>}
                  {s.estado === 'RECHAZADA' && <span>Rechazada</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  )
}
