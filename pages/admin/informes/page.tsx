'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PDFDownloadLink } from '@react-pdf/renderer'
import InformePDF from '@/components/InformePDF'

type Equipo = {
  id: number
  nombre: string
  departamento_nombre: string
  total_solicitudes: number
}

type Usuario = {
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

export default function InformesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPdfLink, setShowPdfLink] = useState(true)

  // Filtros:
  const [periodoTiempo, setPeriodoTiempo] = useState<'24h' | '5d' | '15d' | '1m' | '6m' | '1y'>(
    '24h'
  )
  const [tipoInforme, setTipoInforme] = useState<'equipos' | 'usuarios' | 'completo'>(
    'equipos'
  )

  // 1) Redirigir si no es admin o no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    // Aquí en session.user puede venir tanto .rol como .role
    if (session && (session.user as any).rol !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [session, router, status])

  // 2) Función para consultar /api/informes
  const obtenerDatosFiltrados = async () => {
    try {
      setLoading(true)
      setError('')
      setShowPdfLink(false)

      const res = await fetch(
        `/api/informes?periodo=${periodoTiempo}&tipo=${tipoInforme}`,
        {
          credentials: 'include',
        }
      )
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al generar el informe')
      }

      const data: ReportData = await res.json()
      setReportData(data)
      setSuccess('Datos cargados correctamente')

      // Corto retardo antes de mostrar el enlace a PDF
      setTimeout(() => {
        setShowPdfLink(true)
      }, 100)
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Error al generar el informe. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handlePeriodoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriodoTiempo(e.target.value as any)
    if (reportData) setShowPdfLink(false)
  }

  const handleTipoInformeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoInforme(e.target.value as any)
    if (reportData) setShowPdfLink(false)
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700" />
      </div>
    )
  }

  if (status === 'unauthenticated' || (session && (session.user as any).rol !== 'ADMIN')) {
    return null
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título y botón “Volver a Solicitudes” */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl sm:truncate">
              Generación de Informes
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Crea informes personalizados de solicitudes y equipos
            </p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <a
              href="/admin/requests"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver a Solicitudes
            </a>
          </div>
        </div>

        {/* Mensajes de Error/Éxito */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulario de filtros */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Configuración del Informe
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="periodoTiempo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Periodo de tiempo
              </label>
              <select
                id="periodoTiempo"
                name="periodoTiempo"
                value={periodoTiempo}
                onChange={handlePeriodoChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base text-gray-900"
              >
                <option value="24h">Últimas 24 horas</option>
                <option value="5d">Últimos 5 días</option>
                <option value="15d">Últimos 15 días</option>
                <option value="1m">Último mes</option>
                <option value="6m">Últimos 6 meses</option>
                <option value="1y">Último año</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="tipoInforme"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tipo de informe
              </label>
              <select
                id="tipoInforme"
                name="tipoInforme"
                value={tipoInforme}
                onChange={handleTipoInformeChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base text-gray-900"
              >
                <option value="equipos">Ranking de equipos más solicitados</option>
                <option value="usuarios">Ranking de usuarios con más solicitudes</option>
                <option value="completo">Informe completo (equipos y usuarios)</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={obtenerDatosFiltrados}
              disabled={loading}
              className="inline-flex justify-center items-center py-2.5 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generando informe...
                </>
              ) : (
                <>
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Generar Vista Previa
                </>
              )}
            </button>

            {/* Enlace para descargar el PDF */}
            {reportData && showPdfLink && (
              <div className="mt-4">
                <PDFDownloadLink
                  document={
                    <InformePDF
                      reportData={{
                        equipos: reportData.equipos ?? [],
                        usuarios: reportData.usuarios ?? [],
                        meta: reportData.meta,
                      }}
                      periodo={periodoTiempo}
                      tipoInforme={tipoInforme}
                    />
                  }
                  fileName={`informe-inventario-${new Date()
                    .toISOString()
                    .split('T')[0]}.pdf`}
                  className="ml-4 inline-flex justify-center items-center py-2.5 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {({ blob, url, loading: pdfLoading, error: pdfError }) =>
                    pdfLoading ? (
                      'Preparando documento...'
                    ) : (
                      <>
                        <svg
                          className="mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Descargar PDF
                      </>
                    )
                  }
                </PDFDownloadLink>
              </div>
            )}
          </div>
        </div>

        {/* Vista previa del informe en HTML */}
        {reportData && (
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Vista Previa del Informe
            </h2>

            {/* Tabla de Equipos */}
            {(tipoInforme === 'equipos' || tipoInforme === 'completo') &&
            reportData.equipos &&
            reportData.equipos.length > 0 ? (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Equipos más solicitados
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Posición
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Equipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Departamento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Solicitudes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.equipos.map((item, index) => (
                        <tr
                          key={item.id}
                          className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.departamento_nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.total_solicitudes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : reportData.mensajeEquipos ? (
              <p className="text-gray-600 mb-4">{reportData.mensajeEquipos}</p>
            ) : null}

            {/* Tabla de Usuarios */}
            {(tipoInforme === 'usuarios' || tipoInforme === 'completo') &&
            reportData.usuarios &&
            reportData.usuarios.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Usuarios con más solicitudes
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Posición
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Matrícula
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Solicitudes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.usuarios.map((usuario, index) => (
                        <tr
                          key={usuario.id}
                          className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {`${usuario.nombre} ${usuario.apellido}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {usuario.matricula}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {usuario.total_solicitudes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : reportData.mensajeUsuarios ? (
              <p className="text-gray-600 mb-4">{reportData.mensajeUsuarios}</p>
            ) : null}

            {/* Mensaje general cuando no hay nada */}
            {reportData.mensaje && (
              <p className="text-gray-600 mb-4">{reportData.mensaje}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
