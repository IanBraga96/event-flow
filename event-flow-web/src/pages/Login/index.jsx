import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import { login } from '../../services/authService';
import styles from './Login.module.css';

/* Extrai mensagem de erro da resposta da API */
function getApiError(err) {
  return err?.response?.data?.message || 'Ocorreu um erro. Tente novamente.';
}

/* Ícones SVG inline */
function IconEmail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* Conteúdo do painel de marca */
function BrandContent() {
  return (
    <>
      <h1 className={styles.brandHeadline}>
        Gerencie eventos<br />com <em>fluidez</em>
      </h1>
      <p className={styles.brandSub}>
        Uma plataforma para criar, organizar e participar de eventos
        presenciais e online com facilidade.
      </p>

      <ul className={styles.featureList}>
        <li className={styles.featureItem}>
          <span className={styles.featureDot} />
          Crie e gerencie eventos em minutos
        </li>
        <li className={styles.featureItem}>
          <span className={styles.featureDot} />
          Controle de capacidade em tempo real
        </li>
        <li className={styles.featureItem}>
          <span className={styles.featureDot} />
          Inscrições com validação automática
        </li>
      </ul>
      {/* Card de imagem */}
      <div className={styles.imageCard}>
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80"
          alt="Evento"
        />
        <div className={styles.liveBadge}>
          <span className={styles.liveDot} />
          Live
        </div>
        <p className={styles.imageCardCaption}>
          📍 Saiba Mais · Eventos Recentes
        </p>
      </div>
    </>
  );
}

/* Página de Login */
function Login() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { user, token } = await login({
        email: form.email,
        password: form.password,
      });
      saveSession(token.value, user);
      navigate('/dashboard');
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout brandContent={<BrandContent />}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Bem-vindo de volta</h2>
        <p className={styles.formSubtitle}>
          Não tem conta?{' '}
          <Link to="/register" className={styles.link}>
            Cadastre-se
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.fieldGroup}>

          {/* E-mail */}
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="login-email">
              E-mail
            </label>
            <div className={styles.fieldInputWrap}>
              <span className={styles.fieldIcon}><IconEmail /></span>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          {/* Senha */}
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="login-password">
              Senha
            </label>
            <div className={styles.fieldInputWrap}>
              <span className={styles.fieldIcon}><IconLock /></span>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

        </div>

        {error && <p className={styles.errorMsg}>{error}</p>}

        <div className={styles.forgotRow}>
          <Link to="/forgot-password" className={styles.forgotLink}>
            Esqueci minha senha
          </Link>
        </div>

        <button
          type="submit"
          className={styles.btnPrimary}
          disabled={loading}
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>

        <p className={styles.formLinkRow}>
          Novo por aqui?{' '}
          <Link to="/register" className={styles.link}>
            Criar uma conta
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
