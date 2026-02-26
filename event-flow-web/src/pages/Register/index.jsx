import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import { register } from '../../services/authService';
import styles from './Register.module.css';

/* Extrai mensagem de erro da resposta da API */
function getApiError(err) {
  return err?.response?.data?.message || 'Ocorreu um erro. Tente novamente.';
}

/* Ícones SVG inline */
function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="7" y1="9" x2="17" y2="9" />
      <line x1="7" y1="13" x2="14" y2="13" />
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

/* Máscara de CPF */
function maskCpf(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/* Conteúdo do painel de marca — recebe type como prop */
function BrandContent({ type }) {
  const isParticipant = type === 'participant';

  return (
    <>
      <h1 className={styles.brandHeadline}>
        Comece sua<br />jornada <em>agora</em>
      </h1>
      <p className={styles.brandSub}>
        Participe de eventos incríveis ou crie os seus próprios. Escolha
        como você quer usar a plataforma.
      </p>

      <ul className={styles.featureList}>
        <li className={styles.featureItem}>
          <span className={styles.featureDot} />
          <span>
            <strong>Participante</strong> — explore e se inscreva em eventos
          </span>
        </li>
        <li className={styles.featureItem}>
          <span className={`${styles.featureDot} ${styles.featureDotAmber}`} />
          <span>
            <strong>Organizador</strong> — crie e gerencie seus eventos
          </span>
        </li>
        <li className={styles.featureItem}>
          <span className={styles.featureDot} />
          Controle completo de inscrições e capacidade
        </li>
      </ul>

      {/* Cards de imagem dinâmicos */}
      <div className={styles.imageCards}>

        {/* Card principal — sempre aparece */}
        <div className={styles.imageCard}>
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80"
            alt="Evento"
          />
          <div className={styles.liveBadge}>
            <span className={styles.liveDot} />
            Live
          </div>
          <p className={styles.imageCardCaption}>📍 Saiba Mais · Eventos Recentes</p>
        </div>

        {/* Cards extras — dois para participante, um para organizador */}
        <div className={styles.imageCardsRow}>
          <div className={styles.imageCardSmall}>
            <img
              src={isParticipant
                ? "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&q=80"
                : "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&q=80"
              }
              alt={isParticipant ? "Workshop" : "Organize"}
            />
            <p className={`${styles.imageCardCaption} ${!isParticipant ? styles.imageCardCaptionLarge : ''}`}>
              {isParticipant ? '🎤 Workshops' : 'Meus Eventos'}
            </p>
          </div>

            {isParticipant && (
            <div className={styles.imageCardSmall}>
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80"
                alt="Networking"
              />
              <p className={styles.imageCardCaption}>🤝 Networking</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

/* Página de Cadastro */
function Register() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();

  const [type, setType] = useState('participant');
  const [form, setForm] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'cpf' ? maskCpf(value) : value,
    }));
    setError('');
  }

  function handleTypeChange(newType) {
    setType(newType);
    setForm(prev => ({ ...prev, cpf: '' }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const isParticipant = type === 'participant';

    if (!form.name || !form.email || !form.password) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (isParticipant && !form.cpf) {
      setError('CPF é obrigatório para participantes.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        type,
        name: form.name,
        email: form.email,
        password: form.password,
        ...(isParticipant && { cpf: form.cpf.replace(/\D/g, '') }),
      };

      const { user, token } = await register(payload);
      saveSession(token.value, user);
      navigate('/dashboard');
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  const isParticipant = type === 'participant';

  return (
    /* passa type para BrandContent via prop */
    <AuthLayout brandContent={<BrandContent type={type} />}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Criar conta</h2>
        <p className={styles.formSubtitle}>
          Já tem conta?{' '}
          <Link to="/login" className={styles.link}>
            Faça login
          </Link>
        </p>
      </div>

      {/* Toggle Participante / Organizador */}
      <div className={styles.typeToggle}>
        <button
          type="button"
          className={`${styles.toggleBtn} ${isParticipant ? styles.toggleBtnActive : ''}`}
          onClick={() => handleTypeChange('participant')}
        >
          Participante
        </button>
        <button
          type="button"
          className={`${styles.toggleBtn} ${!isParticipant ? styles.toggleBtnActive : ''}`}
          onClick={() => handleTypeChange('organizer')}
        >
          Organizador
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.fieldGroup}>

          {/* Nome */}
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="reg-name">
              Nome completo
            </label>
            <div className={styles.fieldInputWrap}>
              <span className={styles.fieldIcon}><IconUser /></span>
              <input
                id="reg-name"
                name="name"
                type="text"
                placeholder="João da Silva"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          {/* E-mail */}
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="reg-email">
              E-mail
            </label>
            <div className={styles.fieldInputWrap}>
              <span className={styles.fieldIcon}><IconEmail /></span>
              <input
                id="reg-email"
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

          {/* CPF — somente para participante */}
          <div className={`${styles.field} ${styles.cpfField} ${!isParticipant ? styles.cpfFieldHidden : ''}`}>
            <label className={styles.fieldLabel} htmlFor="reg-cpf">
              CPF
            </label>
            <div className={styles.fieldInputWrap}>
              <span className={styles.fieldIcon}><IconCard /></span>
              <input
                id="reg-cpf"
                name="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={handleChange}
                maxLength={14}
                className={styles.input}
                tabIndex={isParticipant ? 0 : -1}
              />
            </div>
          </div>

          {/* Senha */}
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="reg-password">
              Senha
            </label>
            <div className={styles.fieldInputWrap}>
              <span className={styles.fieldIcon}><IconLock /></span>
              <input
                id="reg-password"
                name="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

        </div>

        {error && <p className={styles.errorMsg}>{error}</p>}

        <button
          type="submit"
          className={styles.btnPrimary}
          disabled={loading}
        >
          {loading ? 'Criando conta…' : 'Criar conta'}
        </button>

        <p className={styles.formLinkRow}>
          Já tem conta?{' '}
          <Link to="/login" className={styles.link}>
            Fazer login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;