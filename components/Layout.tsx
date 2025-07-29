// components/Layout.tsx
import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

type Props = { children: ReactNode; center?: boolean };

export default function Layout({ children, center = false }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => setMenuOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);
  if (status === 'loading') return null;

  const user = session?.user as { rol?: string; name?: string };
  const isAdmin = user?.rol === 'ADMIN';
  const logoHref = isAdmin ? '/admin' : '/';

  return (
    <>
      {session && (
        <header>
          <div className="app-container header-flex">
            <Link href={logoHref} className="logo">
              UNPHU Inventario
            </Link>
            <button
              className="nav-toggle"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menú"
            >
              ☰
            </button>
            <nav>
              <ul className={`nav-list${menuOpen ? ' open' : ''}`}>
                {isAdmin ? (
                  <>
                    <li>
                      <Link href="/admin" className="nav-link">
                        Inicio Admin
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/requests" className="nav-link">
                        Solicitudes
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/users" className="nav-link">
                        Usuarios
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/departments" className="nav-link">
                        Departamentos
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/items" className="nav-link">
                        Equipos
                      </Link>
                    </li>
                    <li>
                      {/* Agregamos Reporte */}
                      <Link href="/admin/report" className="nav-link">
                        Reporte
                      </Link>
                    </li>
                    <li>
                      <Link href="/perfil" className="nav-link">
                        Perfil
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/" className="nav-link">
                        Inicio
                      </Link>
                    </li>
                    <li>
                      <Link href="/mis-solicitudes" className="nav-link">
                        Mis Solicitudes
                      </Link>
                    </li>
                    <li>
                      <Link href="/nueva-solicitud" className="nav-link">
                        Nueva Solicitud
                      </Link>
                    </li>
                    <li>
                      <Link href="/perfil" className="nav-link">
                        Perfil
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq" className="nav-link">
                        FAQ
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
            <div className="session-info">
              <span className="session-user">{user?.name}</span>
              <button
                className="btn-logout"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>
      )}
      <main className={`main-content${center ? ' page-center' : ''}`}>{children}</main>
      <footer>
        <div className="app-container footer-flex">
          <span>© {new Date().getFullYear()} UNPHU – Inventario</span>
          <span>República Dominicana</span>
        </div>
      </footer>
    </>
  );
}
