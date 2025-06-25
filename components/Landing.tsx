// components/Landing.tsx
import React from 'react';
import Link from 'next/link';
import { FiBox, FiClipboard, FiCheckSquare, FiLogIn } from 'react-icons/fi';

export default function Landing() {
  return (
    <>
      {/* ─── HEADER ALINEADO ─── */}
      <header>
        <div className="app-container header-flex">
          {/* Logo / Título a la izquierda */}
          <h1
            style={{
              color: 'var(--white)',
              fontSize: '1.75rem',
              margin: 0,
            }}
          >
            UNPHU Inventario
          </h1>

          {/* Botones a la derecha */}
          <div>
            {/* <Link> ya genera un <a> internamente, por eso quitamos el <a> extra */}
            <Link href="/auth/signin" className="button primary signin-btn" style={{ marginRight: '0.75rem' }}>
              <FiLogIn /> Iniciar Sesión
            </Link>
            <Link href="/register" className="button secondary">
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="hero">
        <h2>Sistema de Inventario UNPHU</h2>
        <p>
          Gestiona de manera eficiente el inventario de equipos tecnológicos y
          audiovisuales de la universidad.
        </p>
        <div className="hero-buttons">
          <Link href="/auth/signin" className="button primary large signin-btn">
            <FiLogIn /> Iniciar Sesión
          </Link>
          <Link href="/register" className="button secondary large">
            Registrarse
          </Link>
        </div>
      </section>

      {/* ─── SECCIÓN DE CARACTERÍSTICAS ─── */}
      <section>
        <h3>Características del Sistema</h3>
        <div className="features">
          {[
            {
              icon: <FiBox size={32} color="#16A085" />,
              title: 'Gestión de Inventario',
              text:
                'Control completo de los equipos disponibles en los departamentos de Audiovisual y Tecnología.',
            },
            {
              icon: <FiClipboard size={32} color="#16A085" />,
              title: 'Solicitudes de Préstamo',
              text:
                'Solicita equipos de forma fácil y rápida especificando fechas, horas y motivo de uso.',
            },
            {
              icon: <FiCheckSquare size={32} color="#16A085" />,
              title: 'Aprobación de Solicitudes',
              text:
                'Sistema de aprobación para administradores con seguimiento del estado de cada solicitud.',
            },
          ].map(({ icon, title, text }) => (
            <div key={title} className="card-wrapper">
              <h4 className="card-title">{title}</h4>
              <div className="card">
                {icon}
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer>
        <div className="app-container header-flex">
          <span>© {new Date().getFullYear()} UNPHU – Sistema de Inventario</span>
          <span>República Dominicana</span>
        </div>
      </footer>
    </>
  );
}
