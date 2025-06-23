// pages/api/admin/informes.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { prisma } from '../../../lib/prisma';

interface EquipoItem {
  id: number;
  nombre: string;
  departamento_nombre: string;
  total_solicitudes: number; // convertido de bigint → number
}

interface UsuarioItem {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  total_solicitudes: number; // convertido de bigint → number
}

interface ReportData {
  equipos?: EquipoItem[];
  usuarios?: UsuarioItem[];
  meta: {
    periodo: string;
    fechaInicio: string;
    fechaFin: string;
  };
  mensajeEquipos?: string;
  mensajeUsuarios?: string;
  mensaje?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReportData | { error: string }>
) {
  // 1) Validar token y rol ADMIN
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  if ((token as any).rol !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // 2) Extraer query params
  const { periodo: periodoRaw, tipo: tipoRaw } = req.query;
  const periodo = Array.isArray(periodoRaw) ? periodoRaw[0] : periodoRaw;
  const tipo = Array.isArray(tipoRaw) ? tipoRaw[0] : tipoRaw;
  const tiposPermitidos = ['equipos', 'usuarios', 'completo'];
  const periodosPermitidos = ['24h', '5d', '15d', '1m', '6m', '1y'];
  if (!periodo || !periodosPermitidos.includes(periodo)) {
    return res.status(400).json({ error: 'Periodo inválido' } as any);
  }
  if (!tipo || !tiposPermitidos.includes(tipo)) {
    return res.status(400).json({ error: 'Tipo de informe inválido' } as any);
  }

  try {
    // 3) Calcular fechaLimite según el período solicitado (solo se usará para "equipos")
    const ahora = new Date();
    let fechaLimite = new Date();
    switch (periodo) {
      case '24h':
        fechaLimite.setHours(ahora.getHours() - 24);
        break;
      case '5d':
        fechaLimite.setDate(ahora.getDate() - 5);
        break;
      case '15d':
        fechaLimite.setDate(ahora.getDate() - 15);
        break;
      case '1m':
        fechaLimite.setMonth(ahora.getMonth() - 1);
        break;
      case '6m':
        fechaLimite.setMonth(ahora.getMonth() - 6);
        break;
      case '1y':
        fechaLimite.setFullYear(ahora.getFullYear() - 1);
        break;
      default:
        fechaLimite.setMonth(ahora.getMonth() - 1);
    }
    const fechaLimiteStr = fechaLimite.toISOString();

    // 4) Estructura base del resultado
    const result: ReportData = {
      meta: {
        periodo,
        fechaInicio: fechaLimiteStr,
        fechaFin: ahora.toISOString().slice(0, 19).replace('T', ' '),
      },
    };

    // 5) Si el tipo es 'equipos' o 'completo', generamos el ranking de equipos
    if (tipo === 'equipos' || tipo === 'completo') {
      const rawEquipos = (await prisma.$queryRaw<
        {
          id: number;
          nombre: string;
          departamento_nombre: string;
          total_solicitudes: bigint; // viene como BigInt
        }[]
      >`
        SELECT 
          i.id,
          i.nombre,
          d.nombre AS departamento_nombre,
          COUNT(s.id) AS total_solicitudes
        FROM Solicitud AS s
        INNER JOIN Item AS i 
          ON s.itemId = i.id
        INNER JOIN Departamento AS d 
          ON i.departamentoId = d.id
        WHERE s.fechaSolicitud >= ${fechaLimiteStr}
        GROUP BY i.id, i.nombre, d.nombre
        ORDER BY total_solicitudes DESC
        LIMIT 10;
      `) as {
        id: number;
        nombre: string;
        departamento_nombre: string;
        total_solicitudes: bigint;
      }[];

      // Convertimos BigInt → number para que JSON.stringify no falle
      const equipos: EquipoItem[] = rawEquipos.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        departamento_nombre: item.departamento_nombre,
        total_solicitudes: Number(item.total_solicitudes),
      }));

      if (equipos.length === 0) {
        result.mensajeEquipos = `No hay datos de equipos solicitados en el período seleccionado (${periodo}).`;
      } else {
        result.equipos = equipos;
      }
    }

    // 6) Si el tipo es 'usuarios' o 'completo', generamos el ranking de usuarios SIN FILTRAR POR FECHA
    if (tipo === 'usuarios' || tipo === 'completo') {
      const rawUsuarios = (await prisma.$queryRaw<
        {
          id: number;
          nombre: string;
          apellido: string;
          matricula: string;
          total_solicitudes: bigint; // BigInt aquí también
        }[]
      >`
        SELECT 
          u.id,
          u.nombre,
          u.apellido,
          u.matricula,
          COUNT(s.id) AS total_solicitudes
        FROM Solicitud AS s
        INNER JOIN Usuario AS u 
          ON s.usuarioId = u.id
        GROUP BY 
          u.id, 
          u.nombre, 
          u.apellido, 
          u.matricula
        ORDER BY 
          total_solicitudes DESC
        LIMIT 10;
      `) as {
        id: number;
        nombre: string;
        apellido: string;
        matricula: string;
        total_solicitudes: bigint;
      }[];

      // Convertimos BigInt → number
      const usuarios: UsuarioItem[] = rawUsuarios.map((usr) => ({
        id: usr.id,
        nombre: usr.nombre,
        apellido: usr.apellido,
        matricula: usr.matricula,
        total_solicitudes: Number(usr.total_solicitudes),
      }));

      if (usuarios.length === 0) {
        result.mensajeUsuarios = `No hay datos de usuarios que hayan realizado solicitudes en la base de datos.`;
      } else {
        result.usuarios = usuarios;
      }
    }

    // 7) Si no obtuvimos ni equipos ni usuarios (según el tipo), agregamos un mensaje general
    const faltaEquipos =
      (tipo === 'equipos' || tipo === 'completo') && !result.equipos;
    const faltaUsuarios =
      (tipo === 'usuarios' || tipo === 'completo') && !result.usuarios;
    if (faltaEquipos && faltaUsuarios) {
      result.mensaje = `No hay datos disponibles para el período seleccionado (${periodo}).`;
    }

    // 8) Respondemos con JSON (ya sin BigInt sin serializar)
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error al generar informe:', error);
    return res.status(500).json({
      error: 'Error al generar informe: ' + error.message,
    });
  }
}
