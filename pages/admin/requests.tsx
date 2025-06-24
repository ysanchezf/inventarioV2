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
  const [entidadId, setEntidadId] = useState('')
  const [fecha, setFecha] = useState('')
  const [usuario, setUsuario] = useState('')
  const [item, setItem] = useState('')

  // filtros por item y estado
  const [search, setSearch] = useState('')      // filtros aplicados
  const [estado, setEstado] = useState('')
  const [searchInput, setSearchInput] = useState('') // valores del formulario
  const [estadoInput, setEstadoInput] = useState('')


  // 1) Carga con filtros
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()

    if (entidadId) params.set('entidadId', entidadId)
    if (fecha)     params.set('fecha', fecha)
    if (usuario)   params.set('usuario', usuario)
    if (item)      params.set('item', item)

    if (search) params.set('q', search)
    if (estado) params.set('estado', estado)

    fetch(`/api/admin/requests?${params.toString()}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json()
      })
      .then((data: Solicitud[]) => setSolicitudes(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))

  }, [entidadId, fecha, usuario, item])

  }, [search, estado])


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
            type="number"
            placeholder="Entidad ID"
            value={entidadId}
            onChange={e => setEntidadId(e.target.value)}
          />
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
          <select
            value={estadoInput}
            onChange={e => setEstadoInput(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="APROBADA">Aprobada</option>
            <option value="RECHAZADA">Rechazada</option>
            <option value="FINALIZADA">Finalizada</option>
          </select>
          <button
            className="btn btn-small btn-primary"
            onClick={() => { setSearch(searchInput); setEstado(estadoInput); }}
          >
            Filtrar
          </button>

        </div>
        <table className="table-minimal">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Equipo</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s) => (
              <tr key={s.id}>
                <td>{new Date(s.fechaSolicitud).toLocaleDateString()}</td>
                <td>{s.usuario.nombre}</td>
                <td>{s.item.nombre}</td>
                <td>{s.motivo}</td>
                <td>{s.estado}</td>
                <td>
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
                      style={{ marginLeft: '0.5rem' }}
                      onClick={() => handleDeliver(s.id)}
                    >
                      Marcar entregado
                    </button>
                  )}
                  {s.estado === 'FINALIZADA' && <span>Finalizada</span>}
                  {s.estado === 'RECHAZADA'  && <span>Rechazada</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  )
}
