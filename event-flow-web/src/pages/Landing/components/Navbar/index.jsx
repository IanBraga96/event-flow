import { Link } from 'react-router-dom';
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
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <LogoIcon />
        <span className={styles.logoText}>
          Event<span className={styles.logoAccent}>Flow</span>
        </span>
      </Link>

      <ul className={styles.navLinks}>
        <li><a href="#sobre">Sobre</a></li>
        <li><a href="#funcionalidades">Funcionalidades</a></li>
        <li><a href="#como-funciona">Como funciona</a></li>
        <li><a href="#eventos">Eventos</a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>

      <div className={styles.navActions}>
        <Link to="/login" className={styles.btnGhost}>Entrar</Link>
        <Link to="/register" className={styles.btnCta}>
          <span className={styles.btnCtaDot} />
          Criar conta
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;