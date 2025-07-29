// pages/register.tsx
import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FiLogIn } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Layout from '../components/Layout';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    matricula: '',
    nombre: '',
    apellido: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setSubmitting(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    let data: { message: string };
    try {
      data = await res.json();
    } catch {
      setError('Respuesta inválida del servidor');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    if (!res.ok) {
      setError(data.message);
    } else {
      setSubmittedMessage(data.message);
    }
  };

  if (submittedMessage) {
    return (
      <Layout>
        <main className="register-page">
          <h2>¡Registro exitoso!</h2>
          <p className="subheading">{submittedMessage}</p>
          <Link href="/auth/signin" className="button primary signin-btn">
            <FiLogIn /> Ir a Iniciar Sesión
          </Link>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="register-page">
      <h2>Crear cuenta</h2>
      <p className="subheading">Sistema de Inventario UNPHU</p>
      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <div className="form-group">
          <label htmlFor="matricula">Matrícula</label>
          <div className="input-group">
            <input
              id="matricula"
              name="matricula"
              type="text"
              placeholder="lc22-1392"
              value={form.matricula}
              onChange={handleChange}
              required
            />
            <input readOnly type="text" value="@unphu.edu.do" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input
            id="apellido"
            name="apellido"
            type="text"
            placeholder="Tu apellido"
            value={form.apellido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            value={form.confirmPassword}
            onChange={handleChange}
            minLength={6}
            required
          />
        </div>

        <button
          type="submit"
          className="button primary large full-width"
          disabled={submitting}
        >
          {submitting ? 'Registrando...' : 'Registrarse'}
        </button>
        <p className="auth-alt-text">Puedes registrarte con:</p>
        <button
          type="button"
          className="google-icon-btn"
          onClick={async () => {
            const res = await signIn('google', {
              redirect: false,
              prompt: 'select_account',
              callbackUrl: '/registro-exitoso',
            })
            if (res?.url) router.push(res.url)
          }}
        >
          <FcGoogle size={24} />
        </button>

        <div className="divider">¿Ya tienes cuenta?</div>
        <Link href="/auth/signin" className="button secondary large full-width signin-btn">
          <FiLogIn /> Iniciar Sesión
        </Link>
      </form>
    </main>
    </Layout>
  );
}
