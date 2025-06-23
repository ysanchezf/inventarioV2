import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import InformePDF from '../../components/InformePDF';

interface EquipoItem {
  id: number;
  nombre: string;
  departamento_nombre: string;
  total_solicitudes: number;
}

interface UsuarioItem {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  total_solicitudes: number;
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

const AdminReportPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estado de filtros (siempre declarados en el mismo orden)
  const [periodo, setPeriodo] = useState<'24h' | '5d' | '15d' | '1m' | '6m' | '1y'>('24h');
  const [tipoInforme, setTipoInforme] = useState<'equipos' | 'usuarios' | 'completo'>('equipos');

  // Estado de datos de informe
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showPdfLink, setShowPdfLink] = useState<boolean>(false);

  // 1) Redirigir si no está autenticado o si no es ADMIN
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    // Cuando status === 'authenticated', session ya está cargado
    if (session && (session.user as any).rol !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  // 2) Si está verificando sesión, no renderizamos nada
  if (status === 'loading') {
    return null;
  }
  // 3) Si no hay sesión o el rol no es ADMIN, devolvemos null (ya se redirigirá en useEffect)
  if (!session || (session.user as any).rol !== 'ADMIN') {
    return null;
  }

  /**
   * 4) Función para llamar a la API y obtener datos de informe en JSON.
   */
  const obtenerDatosFiltrados = async () => {
    try {
      setLoading(true);
      setError('');
      setShowPdfLink(false);
      setReportData(null);

      const resp = await fetch(
        `/api/admin/informes?periodo=${periodo}&tipo=${tipoInforme}`,
        {
          credentials: 'include',
        }
      );
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error((err as any).error || 'Error generando informe');
      }
      const data: ReportData = await resp.json();
      setReportData(data);
      setShowPdfLink(true);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Error al generar el informe.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 5) Handlers para los selects de “periodo” y “tipoInforme”.
   *    Cada vez que cambian, ocultamos el enlace de PDF hasta que se regenere.
   */
  const handlePeriodoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriodo(e.target.value as any);
    if (reportData) {
      setShowPdfLink(false);
    }
  };
  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoInforme(e.target.value as any);
    if (reportData) {
      setShowPdfLink(false);
    }
  };

  return (
    <Layout>
      <div className="app-container" style={{ padding: '2rem 1rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          Generar Informe
        </h2>
        <p style={{ marginBottom: '1rem', color: '#555' }}>
          Selecciona el período y tipo de informe. Luego, haz clic en “Generar Vista Previa”.
        </p>

        {/* ▪︎ Filtros: Periodo y Tipo de Informe ▪︎ */}
        <div
          className="app-container"
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <label htmlFor="periodo" style={{ fontWeight: 500 }}>
              Período:{' '}
            </label>
            <select
              id="periodo"
              name="periodo"
              value={periodo}
              onChange={handlePeriodoChange}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #ccc',
                background: 'white',
                color: '#1f2937',
                fontSize: '0.95rem',
              }}
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
            <label htmlFor="tipoInforme" style={{ fontWeight: 500 }}>
              Tipo de Informe:{' '}
            </label>
            <select
              id="tipoInforme"
              name="tipoInforme"
              value={tipoInforme}
              onChange={handleTipoChange}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #ccc',
                background: 'white',
                color: '#1f2937',
                fontSize: '0.95rem',
              }}
            >
              <option value="equipos">Equipos</option>
              <option value="usuarios">Usuarios</option>
              <option value="completo">Completo</option>
            </select>
          </div>

          <button
            onClick={obtenerDatosFiltrados}
            disabled={loading}
            className="btn btn-primary"
            style={{ marginLeft: 'auto' }}
          >
            {loading ? 'Generando...' : 'Generar Vista Previa'}
          </button>
        </div>

        {/* ▪︎ Mensaje de Error ▪︎ */}
        {error && (
          <div
            className="mb-6"
            style={{
              background: '#ffe6e6',
              border: '1px solid #ffcccc',
              color: '#cc0000',
              padding: '1rem',
              borderRadius: '0.5rem',
            }}
          >
            {error}
          </div>
        )}

        {/* ▪︎ Botón para Descargar PDF ▪︎ */}
        {reportData && showPdfLink && (
          <div style={{ marginBottom: '1.5rem' }}>
            <PDFDownloadLink
              document={
                <InformePDF
                  reportData={reportData}
                  periodo={periodo}
                  tipoInforme={tipoInforme}
                />
              }
              fileName={`informe-${new Date().toISOString().split('T')[0]}.pdf`}
              className="btn btn-primary"
            >
              {({ loading: ld }) =>
                ld ? 'Preparando PDF...' : 'Descargar PDF'
              }
            </PDFDownloadLink>
          </div>
        )}

        {/* ▪︎ Vista Previa del PDF Embebido ▪︎ */}
        {reportData && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Vista Previa del Informe</h3>
            <div
              style={{
                border: '1px solid #ccc',
                height: '800px',
                overflow: 'hidden',
              }}
            >
              <PDFViewer width="100%" height="100%">
                <InformePDF
                  reportData={reportData}
                  periodo={periodo}
                  tipoInforme={tipoInforme}
                />
              </PDFViewer>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminReportPage;
