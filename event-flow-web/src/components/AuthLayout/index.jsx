import { Link, useLocation } from 'react-router-dom';
import styles from './AuthLayout.module.css';

function LogoIcon() {
  return (
    <svg className={styles.logoIcon} viewBox="0 0 42 42" fill="none">
      <rect width="42" height="42" rx="10" fill="rgba(20,184,166,0.12)" />
      <rect x="7" y="11" width="28" height="22" rx="4" stroke="#14b8a6" strokeWidth="1.8" />
      <line x1="7" y1="18" x2="35" y2="18" stroke="#14b8a6" strokeWidth="1.8" />
      <line x1="14" y1="7" x2="14" y2="13" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="7" x2="28" y2="13" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 25 Q21 21 30 25" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M14 29 Q21 25 28 29" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.45" />
    </svg>
  );
}

function AuthLayout({ brandContent, children }) {
  const { pathname } = useLocation();
  const isLogin = pathname === '/login';

  return (
    <div className={styles.split}>
      <div className={styles.bigCard}>

        {/* ── PAINEL ESQUERDO — DARK ── */}
        <div className={styles.brandPanel}>
          <div className={styles.brandContent}>
            <div className={styles.logo}>
              <LogoIcon />
              <span className={styles.logoText}>
                Event<span>Flow</span>
              </span>
            </div>
            {brandContent}
          </div>

          {/* Card de imagem com badge LIVE */}
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

          <div className={styles.brandFooter}>
            <p className={styles.brandFooterText}>
              Plataforma de Gestão de Eventos · ADS 2026
            </p>
          </div>
        </div>

        {/* ── LINHA DIVISÓRIA ── */}
        <div className={styles.divider} />

        {/* ── PAINEL DIREITO — LIGHT ── */}
        <div className={styles.formPanel}>



          {/* Avatar decorativo */}
          <div className={styles.avatarWrap}>
            <div className={styles.avatarRing} />
            <div className={styles.avatarCircle}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>

          <div className={styles.authTabs}>
            <Link
              to="/login"
              className={`${styles.authTab} ${isLogin ? styles.authTabActive : ''}`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`${styles.authTab} ${!isLogin ? styles.authTabActive : ''}`}
            >
              Cadastro
            </Link>
          </div>

          <div className={styles.formContainer}>{children}</div>
        </div>

      </div>
    </div>
  );
}

export default AuthLayout;