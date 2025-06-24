// app/api/informes/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { query } from '@/lib/db'

// Función para convertir periodo a fecha límite
function obtenerFechaLimite(periodo: string): string {
  const ahora = new Date()

  switch (periodo) {
    case '24h':
      ahora.setHours(ahora.getHours() - 24)
      break
    case '5d':
      ahora.setDate(ahora.getDate() - 5)
      break
    case '15d':
      ahora.setDate(ahora.getDate() - 15)
      break
    case '1m':
      ahora.setMonth(ahora.getMonth() - 1)
      break
    case '6m':
      ahora.setMonth(ahora.getMonth() - 6)
      break
    case '1y':
      ahora.setFullYear(ahora.getFullYear() - 1)
      break
    default:
      ahora.setHours(ahora.getHours() - 24)
  }

  // Devolver formato compatible con MySQL DATETIME (YYYY-MM-DD HH:mm:ss)
  return ahora.toISOString().slice(0, 19).replace('T', ' ')
}

// GET /api/informes?periodo=24h&tipo=completo
export async function GET(request: Request) {
  try {
    // 1) Validar sesión de NextAuth y rol de ADMIN
    const session = await getServerSession(authOptions)

    if (
      !session ||
      ((session.user as any).rol !== 'ADMIN' &&
        (session.user as any).role !== 'admin' &&
        session.user?.email !== 'superadmin@unphu.edu.do')
    ) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // 2) Leer query params
    const url = new URL(request.url)
    const periodo = url.searchParams.get('periodo') ?? '24h'
    const tipo = url.searchParams.get('tipo') ?? 'completo'

    const fechaLimite = obtenerFechaLimite(periodo)
    const result: {
      equipos?: any[]
      usuarios?: any[]
      mensajeEquipos?: string
      mensajeUsuarios?: string
      mensaje?: string
      meta: {
        periodo: string
        fechaInicio: string
        fechaFin: string
      }
    } = {
      meta: {
        periodo,
        fechaInicio: fechaLimite,
        fechaFin: new Date().toISOString().slice(0, 19).replace('T', ' '),
      },
    }

    // 3) Ranking de Equipos (si corresponde)
    if (tipo === 'equipos' || tipo === 'completo') {
      const equiposQuery = `
        SELECT i.id, i.nombre, d.nombre AS departamento_nombre, COUNT(s.id) AS total_solicitudes
        FROM solicitudes s
        INNER JOIN items i ON s.item_id = i.id
        INNER JOIN departamentos d ON i.departamento_id = d.id
        WHERE s.fecha_solicitud >= ?
        GROUP BY i.id, i.nombre, d.nombre
        ORDER BY total_solicitudes DESC
        LIMIT 10
      `
      const equipos = await query(equiposQuery, [fechaLimite])
      result.equipos = equipos

      if (!equipos || equipos.length === 0) {
        result.mensajeEquipos = `No hay datos de equipos solicitados en el período seleccionado (${periodo})`
      }
    }

    // 4) Ranking de Usuarios (si corresponde)
    if (tipo === 'usuarios' || tipo === 'completo') {
      const usuariosQuery = `
        SELECT u.id, u.nombre, u.apellido, u.matricula, COUNT(s.id) AS total_solicitudes
        FROM solicitudes s
        INNER JOIN usuarios u ON s.usuario_id = u.id
        WHERE s.fecha_solicitud >= ?
        GROUP BY u.id, u.nombre, u.apellido, u.matricula
        ORDER BY total_solicitudes DESC
        LIMIT 10
      `
      const usuarios = await query(usuariosQuery, [fechaLimite])
      result.usuarios = usuarios

      if (!usuarios || usuarios.length === 0) {
        result.mensajeUsuarios = `No hay datos de usuarios que hayan realizado solicitudes en el período seleccionado (${periodo})`
      }
    }

    // 5) Si no hay datos (caso tipo 'completo' o individual)
    const equiposVacios =
      (result.equipos === undefined || result.equipos.length === 0) &&
      (tipo === 'equipos' || tipo === 'completo')
    const usuariosVacios =
      (result.usuarios === undefined || result.usuarios.length === 0) &&
      (tipo === 'usuarios' || tipo === 'completo')

    if (
      (tipo === 'completo' && equiposVacios && usuariosVacios) ||
      (tipo === 'equipos' && equiposVacios) ||
      (tipo === 'usuarios' && usuariosVacios)
    ) {
      result.mensaje = `No hay datos disponibles para el período seleccionado (${periodo})`
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error al generar informe:', error)
    return NextResponse.json(
      { error: 'Error al generar informe: ' + error.message },
      { status: 500 }
    )
  }
}
