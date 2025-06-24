import { GetServerSideProps } from 'next'
import React from 'react'

interface Equipo {
  id: number
  nombre: string
  departamento_nombre: string
  total_solicitudes: number
}

interface Usuario {
  id: number
  nombre: string
  apellido: string
  matricula: string
  total_solicitudes: number
}

interface ReportData {
  equipos?: Equipo[]
  usuarios?: Usuario[]
  mensajeEquipos?: string
  mensajeUsuarios?: string
  mensaje?: string
  meta: {
    periodo: string
    fechaInicio: string
    fechaFin: string
  }
}

interface Props {
  reportData: ReportData
  periodo: string
  tipo: string
}

const ReportTemplate: React.FC<Props> = ({ reportData, periodo, tipo }) => {
  return (
    <div className="app-container" style={{ padding: '2rem' }}>
      <h1 className="text-2xl font-bold mb-4">Informe de Solicitudes</h1>
      <p className="text-sm text-gray-600 mb-6">
        Periodo: {periodo} (de {reportData.meta.fechaInicio} a {reportData.meta.fechaFin})
      </p>

      {(tipo === 'equipos' || tipo === 'completo') && reportData.equipos && reportData.equipos.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Equipos más solicitados</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Solicitudes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.equipos.map((eq, idx) => (
                <tr key={eq.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{eq.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{eq.departamento_nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{eq.total_solicitudes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : reportData.mensajeEquipos ? (
        <p className="text-gray-600 mb-4">{reportData.mensajeEquipos}</p>
      ) : null}

      {(tipo === 'usuarios' || tipo === 'completo') && reportData.usuarios && reportData.usuarios.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Usuarios con más solicitudes</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Solicitudes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.usuarios.map((usr, idx) => (
                <tr key={usr.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${usr.nombre} ${usr.apellido}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usr.matricula}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usr.total_solicitudes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : reportData.mensajeUsuarios ? (
        <p className="text-gray-600 mb-4">{reportData.mensajeUsuarios}</p>
      ) : null}

      {reportData.mensaje && <p className="text-gray-600">{reportData.mensaje}</p>}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, query }) => {
  const base = process.env.NEXTAUTH_URL?.replace(/\/+$/, '') || `http://${req.headers.host}`
  const periodo = (query.periodo as string) || '24h'
  const tipo = (query.tipo as string) || 'completo'

  const res = await fetch(`${base}/api/informes?periodo=${periodo}&tipo=${tipo}`, {
    headers: { cookie: req.headers.cookie || '' },
  })

  if (!res.ok) {
    return { notFound: true }
  }

  const reportData: ReportData = await res.json()

  return { props: { reportData, periodo, tipo } }
}

export default ReportTemplate

