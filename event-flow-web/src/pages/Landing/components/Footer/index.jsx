import styles from './Footer.module.css';

const links = [
  {
    title: 'Participante',
    items: [
      { label: 'Login', href: '/login' },
      { label: 'Cadastro', href: '/register' },
      { label: 'Meus Eventos', href: '/participant/events' },
      { label: 'Editar Perfil', href: '/participant/profile' },
    ],
  },
  {
    title: 'Organizador',
    items: [
      { label: 'Cadastro', href: '/register' },
      { label: 'Criar Evento', href: '/events/create' },
      { label: 'Meus Eventos', href: '/organizer/events' },
      { label: 'Participantes', href: '/organizer/participants' },
    ],
  },
  {
    title: 'Plataforma',
    items: [
      { label: 'Explorar Eventos', href: '#eventos' },
      { label: 'Como Funciona', href: '#como-funciona' },
      { label: 'Funcionalidades', href: '#funcionalidades' },
      { label: 'Detalhes do Evento', href: '/events' },
    ],
  },
  {
    title: 'Projeto',
    items: [
      { label: 'GitHub', href: 'https://github.com/IanBraga96/event-flow', target: '_blank' },
      { label: 'ADS', href: '#' },
      { label: 'Trabalho Acadêmico', href: '#' },
    ],
  },
];

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topLine} />

      <div className={styles.container}>

        {/* ── LOGO + DESCRIÇÃO ── */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="28" height="26" rx="4" stroke="#14b8a6" strokeWidth="2.2" fill="none"/>
              <rect x="9" y="2" width="3" height="6" rx="1.5" fill="#14b8a6"/>
              <rect x="20" y="2" width="3" height="6" rx="1.5" fill="#14b8a6"/>
              <line x1="2" y1="12" x2="30" y2="12" stroke="#14b8a6" strokeWidth="2"/>
              <path d="M9 19 L14 19 M14 19 L22 19 M14 19 L14 24" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
            <span className={styles.logoText}>
              <span className={styles.logoEvent}>Event</span>
              <span className={styles.logoFlow}>Flow</span>
            </span>
          </div>
          <p className={styles.brandDesc}>
            Plataforma de gestão de eventos presenciais e online. Conecte pessoas através de experiências.
          </p>
          <div className={styles.brandTags}>
            <span className={styles.brandTag}>ADS 2026</span>
            <span className={styles.brandTag}>Trabalho Acadêmico</span>
          </div>
        </div>

        {/* ── COLUNAS DE LINKS ── */}
        {links.map((col, i) => (
          <div key={i} className={styles.col}>
            <h4 className={styles.colTitle}>{col.title}</h4>
            <ul className={styles.colList}>
              {col.items.map((item, j) => (
                <li key={j}>
                  <a
                    href={item.href}
                    target={item.target || '_self'}
                    rel={item.target === '_blank' ? 'noreferrer' : undefined}
                    className={styles.colLink}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      {/* ── BOTTOM BAR ── */}
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <span className={styles.bottomText}>
            © 2026 EventFlow — Projeto Acadêmico ADS
          </span>
          <div className={styles.bottomLinks}>
           <a href="/privacy" className={styles.bottomLink}>Política de Privacidade</a>
            <span className={styles.bottomDot}>·</span>
            <a href="/terms" className={styles.bottomLink}>Termos de Uso</a>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;