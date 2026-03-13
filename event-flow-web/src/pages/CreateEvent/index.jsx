import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { createEvent } from '../../services/eventService';
import styles from './CreateEvent.module.css';

function getApiError(err) {
  if (err?.response?.status === 403) return 'Apenas organizadores podem criar eventos.';
  return err?.response?.data?.message || 'Ocorreu um erro. Tente novamente.';
}

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

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'organizer') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    dateTime: '',
    location: '',
    capacity: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || form.name.length < 2) {
      setError('O nome do evento deve ter pelo menos 2 caracteres.');
      return;
    }
    if (!form.dateTime) {
      setError('Selecione a data e hora do evento.');
      return;
    }
    if (!form.location || form.location.length < 2) {
      setError('O local deve ter pelo menos 2 caracteres.');
      return;
    }
    if (!form.capacity || Number(form.capacity) < 1) {
      setError('A capacidade deve ser pelo menos 1.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('dateTime', new Date(form.dateTime).toISOString());
      formData.append('location', form.location);
      formData.append('capacity', Number(form.capacity));
      if (form.description.trim()) {
        formData.append('description', form.description.trim());
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await createEvent(formData);
      setSuccess(true);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  function handleCreateAnother() {
    setForm({ name: '', description: '', dateTime: '', location: '', capacity: '' });
    removeImage();
    setSuccess(false);
    setError('');
  }

  if (!isAuthenticated || user?.type !== 'organizer') return null;

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
          <li><Link to="/events/create" className={`${styles.navLink} ${styles.navLinkActive}`}>Criar evento</Link></li>
          <li><Link to="/organizer/events" className={styles.navLink}>Meus eventos</Link></li>
        </ul>

        <div className={styles.navUser}>
          <Link to="/organizer/events" className={styles.navAvatar}>{initials}</Link>
          <div className={styles.navUserInfo}>
            <span className={styles.navUserName}>{user?.name?.split(' ')[0]}</span>
            <span className={styles.navUserType}>Organizador</span>
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

        {/* ── Page Header ── */}
        <div className={styles.pageHeader}>
          <Link to="/" className={styles.backBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <div className={styles.pageHeaderText}>
            <h1 className={styles.pageTitle}>Criar novo evento</h1>
            <p className={styles.pageSubtitle}>Preencha as informações do seu evento</p>
          </div>
        </div>

        {/* ── Card ── */}
        <div className={styles.card}>

          {/* Banner decorativo */}
          <div className={styles.cardBanner}>
            <div className={styles.cardBannerGlow} />
            <div className={styles.cardBannerGrid} />
          </div>

          {success ? (
            /* ── Estado de sucesso ── */
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className={styles.successTitle}>Evento criado com sucesso!</h2>
              <p className={styles.successDesc}>
                Seu evento foi publicado e já está disponível para os participantes.
              </p>
              <div className={styles.successActions}>
                <button className={styles.btnSubmit} onClick={handleCreateAnother}>
                  Criar outro evento
                </button>
                <Link to="/" className={styles.btnSecondary}>
                  Voltar ao início
                </Link>
              </div>
            </div>
          ) : (
            /* ── Formulário ── */
            <form onSubmit={handleSubmit} className={styles.formWrap}>

              {/* Informações básicas */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionDot} />
                  <span className={styles.sectionLabel}>INFORMAÇÕES DO EVENTO</span>
                  <div className={styles.sectionLine} />
                </div>

                <div className={styles.grid2}>
                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label className={styles.label} htmlFor="ce-name">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                      Nome do evento <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="ce-name"
                      className={styles.input}
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ex: Summit de Inovação 2026"
                      minLength={2}
                      maxLength={255}
                    />
                  </div>

                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label className={styles.label} htmlFor="ce-desc">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      Descrição
                    </label>
                    <textarea
                      id="ce-desc"
                      className={styles.textarea}
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Descreva seu evento, o que os participantes podem esperar..."
                      maxLength={1000}
                      rows={4}
                    />
                    <span className={styles.charCount}>{form.description.length}/1000</span>
                  </div>
                </div>
              </div>

              {/* Imagem */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionDot} />
                  <span className={styles.sectionLabel}>IMAGEM DO EVENTO</span>
                  <div className={styles.sectionLine} />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    Imagem de capa
                  </label>

                  {imagePreview ? (
                    <div className={styles.imagePreview}>
                      <img src={imagePreview} alt="Preview" className={styles.imagePreviewImg} />
                      <button type="button" className={styles.imageRemoveBtn} onClick={removeImage}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ) : (
                    <button type="button" className={styles.imageUploadBtn} onClick={() => fileRef.current?.click()}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span>Clique para enviar uma imagem</span>
                      <span className={styles.imageUploadHint}>JPG, PNG ou WebP (máx. 5MB)</span>
                    </button>
                  )}

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImage}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              {/* Data, local e capacidade */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionDot} />
                  <span className={styles.sectionLabel}>DATA, LOCAL E CAPACIDADE</span>
                  <div className={styles.sectionLine} />
                </div>

                <div className={styles.grid2}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="ce-datetime">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Data e hora <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="ce-datetime"
                      className={styles.input}
                      type="datetime-local"
                      name="dateTime"
                      value={form.dateTime}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="ce-capacity">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      Capacidade <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="ce-capacity"
                      className={styles.input}
                      type="number"
                      name="capacity"
                      value={form.capacity}
                      onChange={handleChange}
                      placeholder="Ex: 100"
                      min={1}
                    />
                  </div>

                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label className={styles.label} htmlFor="ce-location">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      Local <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="ce-location"
                      className={styles.input}
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Ex: São Paulo, Remoto, etc."
                      minLength={2}
                      maxLength={255}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className={`${styles.feedback} ${styles.error}`}>
                  <span>✕</span>
                  {error}
                </div>
              )}

              <div className={styles.formFooter}>
                <button type="submit" className={styles.btnSubmit} disabled={loading}>
                  {loading ? <span className={styles.spinner} /> : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Criar evento
                    </>
                  )}
                </button>
                <Link to="/" className={styles.btnSecondary}>Cancelar</Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
