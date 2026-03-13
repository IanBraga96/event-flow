import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Profile.module.css';

import hero1 from '../../assets/images/landing/hero1.jpg';
import hero2 from '../../assets/images/landing/hero2.jpg';
import hero3 from '../../assets/images/landing/hero3.jpg';

const API_URL = 'http://localhost:3333';

const CTA_SLIDES = [
  { img: hero1, label: 'Summit de Inovação' },
  { img: hero2, label: 'Festival de Design & UX' },
  { img: hero3, label: 'Hackathon Dev Connect' },
];

const RECENT_EVENTS_MOCK = [
  { id: 1, name: 'Summit de Inovação', date: '03 Fev 2026', location: 'São Paulo, SP', status: 'Finalizado' },
  { id: 2, name: 'Hackathon Dev Connect', date: '05 Mar 2026', location: 'Online', status: 'Finalizado' },
  { id: 3, name: 'Festival de Design & UX', date: '20 Mai 2026', location: 'Rio de Janeiro, RJ', status: 'Próximo' },
];

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

export default function Profile() {
  const { user: realUser, token, saveSession, logout } = useAuth();
  const user = realUser || {
    id: '1', name: 'Érika Laiane', email: 'erika@email.com',
    type: 'participant', cpf: '123.456.789-00',
  };

  // Carrossel CTA
  const [ctaSlide, setCtaSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCtaSlide(p => (p + 1) % CTA_SLIDES.length), 3500);
    return () => clearInterval(t);
  }, []);

  const fileRef = useRef(null);
  const [avatar, setAvatar] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    occupation: '',
    bio: '',
    phone: '',
    city: '',
    state: '',
    linkedin: '',
    instagram: '',
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const isOrganizer = user?.type === 'organizer';

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    const endpoint = isOrganizer
      ? `${API_URL}/organizers/${user?.id}`
      : `${API_URL}/participants/${user?.id}`;
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao atualizar perfil');
      saveSession(token, { ...user, ...data.user });
      setFeedback({ type: 'success', msg: 'Perfil atualizado com sucesso!' });
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  const initials = (user?.name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className={styles.page}>
      <div className={styles.dots} />
      <div className={styles.orbs} />

      {/* ── Navbar ── */}
      <nav className={styles.navbar}>
        <Link to="/" className={styles.navLogo}>
          <LogoIcon />
          <span className={styles.navLogoText}>Event<span className={styles.navAccent}>Flow</span></span>
        </Link>

        <ul className={styles.navLinks}>
          <li><Link to="/" className={styles.navLink}>Explorar eventos</Link></li>
          {isOrganizer && <li><Link to="/organizer/events" className={styles.navLink}>Meus eventos</Link></li>}
          {!isOrganizer && <li><Link to="/participant/events" className={styles.navLink}>Minhas inscrições</Link></li>}
          <li><Link to="/participant/profile" className={`${styles.navLink} ${styles.navLinkActive}`}>Perfil</Link></li>
        </ul>

        <div className={styles.navUser}>
          <div className={styles.navAvatarWrap}>
            {avatar
              ? <img src={avatar} alt="avatar" className={styles.navAvatarImg} />
              : <div className={styles.navAvatar}>{initials}</div>
            }
          </div>
          <div className={styles.navUserInfo}>
            <span className={styles.navUserName}>{user?.name?.split(' ')[0]}</span>
            <span className={`${styles.navUserType} ${isOrganizer ? styles.navTypeOrg : styles.navTypePart}`}>
              {isOrganizer ? 'Organizador' : 'Participante'}
            </span>
          </div>
          <button className={styles.navLogout} onClick={logout} title="Sair">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </nav>

      <div className={styles.wrapper}>

        {/* ── CTA Banner com carrossel ── */}
        <div className={styles.ctaBanner}>
          {/* Carrossel de fundo */}
          <div className={styles.ctaCarousel}>
            {CTA_SLIDES.map((s, i) => (
              <div
                key={i}
                className={`${styles.ctaSlide} ${i === ctaSlide ? styles.ctaSlideActive : ''}`}
                style={{ backgroundImage: `url(${s.img})` }}
              />
            ))}
            <div className={styles.ctaOverlay} />
          </div>

          {/* Conteúdo */}
          <div className={styles.ctaContent}>
            <div className={styles.ctaLeft}>
              <p className={styles.ctaEyebrow}>✦ DESCUBRA ALGO NOVO</p>
              <h2 className={styles.ctaTitle}>
                Encontre eventos <span className={styles.ctaHighlight}>feitos para você</span>
              </h2>
              <p className={styles.ctaDesc}>
                Tecnologia, design, negócios e muito mais. Explore centenas de eventos e faça parte de algo maior.
              </p>
              <div className={styles.ctaSlideLabel}>
                📍 {CTA_SLIDES[ctaSlide].label}
              </div>
            </div>

            <div className={styles.ctaRight}>
              <div className={styles.ctaStats}>
                <div className={styles.ctaStat}>
                  <span className={styles.ctaStatNum}>+120</span>
                  <span className={styles.ctaStatLabel}>Eventos</span>
                </div>
                <div className={styles.ctaStatDiv} />
                <div className={styles.ctaStat}>
                  <span className={styles.ctaStatNum}>+3k</span>
                  <span className={styles.ctaStatLabel}>Participantes</span>
                </div>
              </div>
              <Link to="/events" className={styles.ctaBtn}>Explorar eventos →</Link>
              <div className={styles.ctaDots}>
                {CTA_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.ctaDot} ${i === ctaSlide ? styles.ctaDotActive : ''}`}
                    onClick={() => setCtaSlide(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Card principal (fundo claro) ── */}
        <div className={styles.card}>

          {/* Banner do perfil */}
          <div className={styles.profileBanner}>
            <div className={styles.profileBannerGlow} />
            <div className={styles.profileBannerGrid} />
          </div>

          {/* Header */}
          <div className={styles.profileHeader}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatarRing} />
              {avatar
                ? <img src={avatar} alt="avatar" className={styles.avatarImg} />
                : <div className={styles.avatar}>{initials}</div>
              }
              <button className={styles.avatarEditBtn} onClick={() => fileRef.current.click()} title="Trocar foto">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className={styles.fileInput} onChange={handleAvatar} />
            </div>

            <div className={styles.profileMeta}>
              <h1 className={styles.profileName}>{form.name || user?.name}</h1>
              {form.occupation && <p className={styles.profileOccupation}>{form.occupation}</p>}
              <p className={styles.profileEmailText}>{form.email || user?.email}</p>
              {form.city && (
                <p className={styles.profileLocation}>
                  📍 {form.city}{form.state ? `, ${form.state}` : ''}
                </p>
              )}
              <span className={`${styles.typeBadge} ${isOrganizer ? styles.badgeOrg : styles.badgePart}`}>
                {isOrganizer ? '🎤 Organizador' : '🎟️ Participante'}
              </span>
            </div>

            <div className={styles.profileStats}>
              <div className={styles.pStat}>
                <span className={styles.pStatNum}>{RECENT_EVENTS_MOCK.length}</span>
                <span className={styles.pStatLabel}>Eventos</span>
              </div>
              <div className={styles.pStatDiv} />
              <div className={styles.pStat}>
                <span className={styles.pStatNum}>2</span>
                <span className={styles.pStatLabel}>Finalizados</span>
              </div>
              <div className={styles.pStatDiv} />
              <div className={styles.pStat}>
                <span className={styles.pStatNum}>1</span>
                <span className={styles.pStatLabel}>Próximos</span>
              </div>
            </div>
          </div>

          {/* ── Formulário ── */}
          <form onSubmit={handleSubmit} className={styles.formWrap}>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionDot} />
                <span className={styles.sectionLabel}>INFORMAÇÕES BÁSICAS</span>
                <div className={styles.sectionLine} />
              </div>
              <div className={styles.grid2}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Nome completo
                  </label>
                  <input className={styles.input} type="text" name="name" value={form.name} onChange={handleChange} placeholder="Seu nome completo" minLength={2} maxLength={255} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    E-mail
                  </label>
                  <input className={styles.input} type="email" name="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" maxLength={254} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8L6 7h12l-2-4z"/></svg>
                    Ocupação / Profissão
                  </label>
                  <input className={styles.input} type="text" name="occupation" value={form.occupation} onChange={handleChange} placeholder="Ex: Desenvolvedor Front-End" maxLength={120} />
                </div>
                {!isOrganizer && (
                  <div className={styles.field}>
                    <label className={styles.label}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                      CPF <span className={styles.readonlyTag}>não editável</span>
                    </label>
                    <input className={`${styles.input} ${styles.inputDisabled}`} type="text" value={user?.cpf || '—'} disabled />
                  </div>
                )}
                <div className={styles.field}>
                  <label className={styles.label}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Tipo de conta
                  </label>
                  <input className={`${styles.input} ${styles.inputDisabled}`} type="text" value={isOrganizer ? 'Organizador' : 'Participante'} disabled />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionDot} />
                <span className={styles.sectionLabel}>SOBRE MIM</span>
                <div className={styles.sectionLine} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Bio
                </label>
                <textarea className={styles.textarea} name="bio" value={form.bio} onChange={handleChange} placeholder="Conte um pouco sobre você..." maxLength={500} rows={4} />
                <span className={styles.charCount}>{form.bio.length}/500</span>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionDot} />
                <span className={styles.sectionLabel}>CONTATO E LOCALIZAÇÃO</span>
                <div className={styles.sectionLine} />
              </div>
              <div className={styles.grid3}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.07-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    Telefone
                  </label>
                  <input className={styles.input} type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="(11) 99999-9999" maxLength={20} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Cidade
                  </label>
                  <input className={styles.input} type="text" name="city" value={form.city} onChange={handleChange} placeholder="Sua cidade" maxLength={100} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                    Estado
                  </label>
                  <input className={styles.input} type="text" name="state" value={form.state} onChange={handleChange} placeholder="UF" maxLength={2} />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionDot} />
                <span className={styles.sectionLabel}>REDES SOCIAIS</span>
                <div className={styles.sectionLine} />
              </div>
              <div className={styles.grid2}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                    LinkedIn
                  </label>
                  <input className={styles.input} type="url" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/seu-perfil" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    Instagram
                  </label>
                  <input className={styles.input} type="text" name="instagram" value={form.instagram} onChange={handleChange} placeholder="@seu_usuario" />
                </div>
              </div>
            </div>

            {feedback && (
              <div className={`${styles.feedback} ${styles[feedback.type]}`}>
                <span>{feedback.type === 'success' ? '✓' : '✕'}</span>
                {feedback.msg}
              </div>
            )}

            <div className={styles.formFooter}>
              <button type="submit" className={styles.btnSave} disabled={loading}>
                {loading ? <span className={styles.spinner} /> : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Salvar alterações
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ── Participações recentes ── */}
          <div className={styles.eventsSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionDot} />
              <span className={styles.sectionLabel}>PARTICIPAÇÕES RECENTES</span>
              <div className={styles.sectionLine} />
            </div>
            <div className={styles.eventsList}>
              {RECENT_EVENTS_MOCK.map(ev => (
                <div key={ev.id} className={styles.eventItem}>
                  <div className={styles.eventIcon}>📅</div>
                  <div className={styles.eventInfo}>
                    <span className={styles.eventName}>{ev.name}</span>
                    <span className={styles.eventMeta}>{ev.date} · {ev.location}</span>
                  </div>
                  <span className={`${styles.eventStatus} ${ev.status === 'Próximo' ? styles.statusNext : styles.statusDone}`}>
                    {ev.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}