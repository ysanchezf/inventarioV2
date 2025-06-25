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
}

export default function AdminRequestsPage() {
  const { data: session } = useSession()
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

  // criterios de filtrado
  const [fecha, setFecha] = useState('')
  const [usuario, setUsuario] = useState('')
  const [item, setItem] = useState('')

  // filtro por equipo
  const [search, setSearch] = useState('')      // filtros aplicados
  const [searchInput, setSearchInput] = useState('') // valor del formulario


  // 1) Carga con filtros
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()

    if (fecha)     params.set('fecha', fecha)
    if (usuario)   params.set('usuario', usuario)
    if (item)      params.set('item', item)

    if (search) params.set('q', search)


    fetch(`/api/admin/requests?${params.toString()}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json()
      })
      .then((data: Solicitud[]) => setSolicitudes(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))

  }, [fecha, usuario, item, search])


  // 2) Aprobar/Rechazar con comentario
  const handleUpdate = async (
    id: number,
    newEstado: 'APROBADA' | 'RECHAZADA'
  ) => {
    // pedimos el comentario al admin
    const comentario = prompt(
      'Indica el nombre del estudiante o responsable del retiro:',
      ''
    )
    if (comentario === null) return  // canceló

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
        prev.map((r) =>
          r.id === id ? { ...r, estado: newEstado } : r
        )
      )
    }
  }

  // 3) Marcar “Entregado” (devolución)
  const handleDeliver = async (id: number) => {
    const res = await fetch(`/api/solicitudes/${id}/return`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!res.ok) {
      alert(`Error al marcar entrega: ${res.status}`)
    } else {
      setSolicitudes((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, estado: 'FINALIZADA' } : r
        )
      )
    }
  }

  if (loading) return <Layout><p>Cargando…</p></Layout>
  if (error)   return <Layout><p style={{color:'red'}}>Error: {error}</p></Layout>
  if (!session || (session.user as any).rol !== 'ADMIN') {
    return <Layout><p>No tienes permiso para ver esta página.</p></Layout>
  }

  return (
    <Layout>
      <section className="app-container">
        <h2>Revisión de Solicitudes</h2>

        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
          />
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
          />
          <input
            type="text"
            placeholder="Equipo"
            value={item}
            onChange={e => setItem(e.target.value)}
          />

        {/* —————— FILTROS —————— */}
        <div style={{ display:'flex', gap:'.5rem', marginBottom:'1rem' }}>
          <input
            type="text"
            placeholder="Buscar equipo…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          <button
            className="btn btn-small btn-primary"
            onClick={() => setSearch(searchInput)}
          >
            Filtrar
          </button>

        </div>
        <div className="requests-grid">
          {solicitudes.map((s) => (
            <div key={s.id} className="request-card">
              <div className="request-card-header">
                <span className={`status-badge ${s.estado.toLowerCase()}`}>{s.estado}</span>
                <span>{new Date(s.fechaSolicitud).toLocaleDateString()}</span>
              </div>
              <h4>{s.item.nombre}</h4>
              <p className="request-user">{s.usuario.nombre}</p>
              <p>{s.motivo}</p>
              <div className="actions">
                {s.estado === 'PENDIENTE' && (
                  <>
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => handleUpdate(s.id, 'APROBADA')}
                    >
                      <FiCheckCircle size={14} /> Aprobar
                    </button>
                    {' '}
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => handleUpdate(s.id, 'RECHAZADA')}
                    >
                      <FiXCircle size={14} /> Rechazar
                    </button>
                  </>
                )}
                {s.estado === 'APROBADA' && (
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => handleDeliver(s.id)}
                  >
                    Marcar entregado
                  </button>
                )}
                {s.estado === 'FINALIZADA' && <span>Finalizada</span>}
                {s.estado === 'RECHAZADA' && <span>Rechazada</span>}
              </div>
            </div>
          ))}
        </div>
        {/* close filtros container */}
        </div>
      </section>
    </Layout>
  )
}
