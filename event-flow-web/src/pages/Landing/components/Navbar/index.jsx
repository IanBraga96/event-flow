import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import styles from './Navbar.module.css';

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

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const initials = isAuthenticated
    ? (user?.name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '';
  const roleLabel = user?.type === 'organizer' ? 'Organizador' : 'Participante';
  const profileLink = user?.type === 'organizer' ? '/organizer/events' : '/participant/profile';

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <LogoIcon />
        <span className={styles.logoText}>
          Event<span className={styles.logoAccent}>Flow</span>
        </span>
      </Link>

      {/* Links — desktop */}
      <ul className={styles.navLinks}>
        <li><a href="#sobre">Sobre</a></li>
        <li><a href="#funcionalidades">Funcionalidades</a></li>
        <li><a href="#como-funciona">Como funciona</a></li>
        <li><a href="#eventos">Eventos</a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>

      {/* Ações — desktop */}
      <div className={styles.navActions}>
        {isAuthenticated ? (
          <div className={styles.navUser}>
            <Link to={profileLink} className={styles.navAvatar}>{initials}</Link>
            <div className={styles.navUserInfo}>
              <span className={styles.navUserName}>{user?.name?.split(' ')[0]}</span>
              <span className={styles.navUserType}>{roleLabel}</span>
            </div>
            <button className={styles.navLogout} onClick={logout} title="Sair">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className={styles.btnGhost}>Entrar</Link>
            <Link to="/register" className={styles.btnCta}>
              <span className={styles.btnCtaDot} />
              Criar conta
            </Link>
          </>
        )}
      </div>

      {/* Hamburguer — mobile */}
      <button
        className={`${styles.hamburger} ${open ? styles.hamburgerOpen : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Menu mobile */}
      <div className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ''}`}>
        <ul className={styles.mobileLinks}>
          <li><a href="#sobre" onClick={() => setOpen(false)}>Sobre</a></li>
          <li><a href="#funcionalidades" onClick={() => setOpen(false)}>Funcionalidades</a></li>
          <li><a href="#como-funciona" onClick={() => setOpen(false)}>Como funciona</a></li>
          <li><a href="#eventos" onClick={() => setOpen(false)}>Eventos</a></li>
          <li><a href="#contato" onClick={() => setOpen(false)}>Contato</a></li>
        </ul>
        <div className={styles.mobileActions}>
          {isAuthenticated ? (
            <div className={styles.mobileUser}>
              <div className={styles.navAvatar}>{initials}</div>
              <div className={styles.navUserInfo}>
                <span className={styles.navUserName}>{user?.name?.split(' ')[0]}</span>
                <span className={styles.navUserType}>{roleLabel}</span>
              </div>
              <button className={styles.navLogout} onClick={() => { logout(); setOpen(false); }} title="Sair">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.btnGhost} onClick={() => setOpen(false)}>
                Entrar
              </Link>
              <Link to="/register" className={styles.btnCta} onClick={() => setOpen(false)}>
                <span className={styles.btnCtaDot} />
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;