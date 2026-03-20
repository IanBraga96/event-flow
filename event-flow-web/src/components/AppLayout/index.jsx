import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './AppLayout.module.css';

function LogoIcon() {
  return (
    <svg className={styles.logoIcon} viewBox="0 0 42 42" fill="none">
      <rect width="42" height="42" rx="10" fill="rgba(20,184,166,0.15)" />
      <rect x="7" y="11" width="28" height="22" rx="4" stroke="#14b8a6" strokeWidth="1.8" />
      <line x1="7" y1="18" x2="35" y2="18" stroke="#14b8a6" strokeWidth="1.8" />
      <line x1="14" y1="7" x2="14" y2="13" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="7" x2="28" y2="13" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 25 Q21 21 30 25" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M14 29 Q21 25 28 29" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.45" />
    </svg>
  );
}

const HOME_ICON = <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;

const NAV_MAIN_PARTICIPANT = [
  { to: '/participant/dashboard', label: 'Início', icon: HOME_ICON },
  { to: '/participant/profile', label: 'Meu perfil',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { to: '/events', label: 'Explorar eventos',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  { to: '/participant/events', label: 'Meus eventos',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
];

const NAV_MAIN_ORGANIZER = [
  { to: '/organizer/dashboard', label: 'Início', icon: HOME_ICON },
  { to: '/organizer/profile', label: 'Meu perfil',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { to: '/events', label: 'Explorar eventos',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  { to: '/events/create', label: 'Criar evento',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> },
  { to: '/organizer/events', label: 'Meus eventos',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
];

const NAV_PLATFORM = [
  { to: '/how-it-works', label: 'Como funciona',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  { to: '/about', label: 'Sobre nós',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { to: '/contact', label: 'Contato',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
];

function NavItem({ to, label, icon, location, onClick }) {
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
      onClick={onClick}
    >
      <span className={styles.navIcon}>{icon}</span>
      <span className={styles.navLabel}>{label}</span>
      {active && <span className={styles.navActiveDot} />}
    </Link>
  );
}

export default function AppLayout({ children, onSearch, searchValue = '', searchPlaceholder = 'Buscar eventos...', fixedContent = false }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isOrganizer = user?.type === 'organizer';
  const mainNav = isOrganizer ? NAV_MAIN_ORGANIZER : NAV_MAIN_PARTICIPANT;
  const initials = (user?.name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  function handleLogout() {
    logout();
    navigate('/');
  }

  function closeMenu() { setMenuOpen(false); }

  const sidebarContent = (
    <>
      <div className={styles.sidebarLogo}>
        <Link to="/" className={styles.logoLink} onClick={closeMenu}>
          <LogoIcon />
          <span className={styles.logoText}>Event<span className={styles.logoAccent}>Flow</span></span>
        </Link>
      </div>

      <div className={styles.sidebarType}>
        <span className={`${styles.typePill} ${isOrganizer ? styles.typeOrg : styles.typePart}`}>
          {isOrganizer ? '🎤 Organizador' : '🎟️ Participante'}
        </span>
      </div>

      <nav className={styles.sidebarNav}>
        <span className={styles.navSection}>MENU</span>
        {mainNav.map(item => (
          <NavItem key={item.to} {...item} location={location} onClick={closeMenu} />
        ))}
      </nav>

      <div className={styles.sidebarDivider} />

      <nav className={styles.sidebarNav}>
        <span className={styles.navSection}>PLATAFORMA</span>
        {NAV_PLATFORM.map(item => (
          <NavItem key={item.to} {...item} location={location} onClick={closeMenu} />
        ))}
      </nav>

      <div className={styles.sidebarDivider} />

      <div className={styles.sidebarAccount}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sair da conta
        </button>
        <div className={styles.sidebarUser}>
          <div className={styles.sidebarAvatar}>{initials}</div>
          <div className={styles.sidebarUserInfo}>
            <span className={styles.sidebarUserName}>{user?.name?.split(' ')[0]}</span>
            <span className={`${styles.sidebarUserType} ${isOrganizer ? styles.typeOrg : styles.typePart}`}>
              {isOrganizer ? 'Organizador' : 'Participante'}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className={styles.root}>
      <div className={styles.dots} />
      <div className={styles.orbs} />

      {/* ── Sidebar desktop (fixed) ── */}
      <aside className={styles.sidebar}>
        {sidebarContent}
      </aside>

      {/* ── Overlay mobile ── */}
      {menuOpen && (
        <div className={styles.overlay} onClick={closeMenu} />
      )}

      {/* ── Sidebar mobile (drawer) ── */}
      <aside className={`${styles.sidebarMobile} ${menuOpen ? styles.sidebarMobileOpen : ''}`}>
        {sidebarContent}
      </aside>

      {/* ── Topbar (fixed) ── */}
      <header className={styles.topbar}>
        {/* Botão hamburguer — só aparece no mobile */}
        <button className={styles.hamburger} onClick={() => setMenuOpen(o => !o)}>
          {menuOpen
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>

        <div className={styles.topbarSearch}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={e => onSearch?.(e.target.value)}
          />
        </div>

        <div className={styles.topbarRight}>
          <div className={styles.topbarAvatar}>{initials}</div>
          <div className={styles.topbarUserInfo}>
            <span className={styles.topbarUserName}>{user?.name?.split(' ')[0]}</span>
            <span className={`${styles.topbarUserType} ${isOrganizer ? styles.typeOrg : styles.typePart}`}>
              {isOrganizer ? 'Organizador' : 'Participante'}
            </span>
          </div>
        </div>
      </header>

      {/* ── Conteúdo ── */}
      <main className={fixedContent ? styles.contentFixed : styles.content}>
        {children}
      </main>
    </div>
  );
}