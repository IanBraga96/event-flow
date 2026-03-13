import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { listMyEvents, updateEvent, deleteEvent } from '../../services/eventService';
import styles from './MyEvents.module.css';

const API_URL = process.env.REACT_APP_API_URL;

function getApiError(err) {
  return err?.response?.data?.message || 'Ocorreu um erro. Tente novamente.';
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function formatDateTimeLocal(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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

/* ── Edit Modal ── */
function EditModal({ event, onClose, onSaved }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    name: event.name,
    description: event.description || '',
    dateTime: formatDateTimeLocal(event.dateTime),
    location: event.location,
    capacity: String(event.capacity),
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    event.image ? `${API_URL}${event.image}` : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
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

      await updateEvent(event.id, formData);
      onSaved();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Editar evento</h2>
          <button className={styles.modalClose} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionDot} />
              <span className={styles.sectionLabel}>INFORMAÇÕES</span>
              <div className={styles.sectionLine} />
            </div>

            <div className={styles.grid2}>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label} htmlFor="edit-name">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                  Nome
                </label>
                <input id="edit-name" className={styles.input} type="text" name="name" value={form.name} onChange={handleChange} maxLength={255} />
              </div>

              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label} htmlFor="edit-desc">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Descrição
                </label>
                <textarea id="edit-desc" className={styles.textarea} name="description" value={form.description} onChange={handleChange} maxLength={1000} rows={3} />
                <span className={styles.charCount}>{form.description.length}/1000</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionDot} />
              <span className={styles.sectionLabel}>IMAGEM</span>
              <div className={styles.sectionLine} />
            </div>

            <div className={styles.field}>
              {imagePreview ? (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="Preview" className={styles.imagePreviewImg} />
                  <button type="button" className={styles.imageRemoveBtn} onClick={removeImage}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ) : (
                <button type="button" className={styles.imageUploadBtn} onClick={() => fileRef.current?.click()}>
                  <span>Enviar imagem</span>
                  <span className={styles.imageUploadHint}>JPG, PNG ou WebP (máx. 5MB)</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} style={{ display: 'none' }} />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionDot} />
              <span className={styles.sectionLabel}>DATA, LOCAL E CAPACIDADE</span>
              <div className={styles.sectionLine} />
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="edit-dt">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Data e hora
                </label>
                <input id="edit-dt" className={styles.input} type="datetime-local" name="dateTime" value={form.dateTime} onChange={handleChange} />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="edit-cap">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  Capacidade
                </label>
                <input id="edit-cap" className={styles.input} type="number" name="capacity" value={form.capacity} onChange={handleChange} min={1} />
              </div>

              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label} htmlFor="edit-loc">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Local
                </label>
                <input id="edit-loc" className={styles.input} type="text" name="location" value={form.location} onChange={handleChange} maxLength={255} />
              </div>
            </div>
          </div>

          {error && (
            <div className={`${styles.feedback} ${styles.error}`}>
              <span>✕</span> {error}
            </div>
          )}

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.btnSave} disabled={loading}>
              {loading ? <span className={styles.spinnerSmall} /> : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Delete Confirm Modal ── */
function DeleteModal({ event, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteEvent(event.id);
      onDeleted();
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Excluir evento</h2>
          <button className={styles.modalClose} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <p className={styles.confirmText}>
          Tem certeza que deseja excluir o evento <strong>{event.name}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className={styles.confirmFooter}>
          <button className={styles.btnCancel} onClick={onClose}>Cancelar</button>
          <button className={styles.btnDanger} onClick={handleDelete} disabled={loading}>
            {loading ? <span className={styles.spinnerSmall} /> : 'Excluir evento'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function MyEvents() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'organizer') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);

  const fetchEvents = useCallback(() => {
    setLoading(true);
    listMyEvents()
      .then(({ events: data }) => setEvents(data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  function handleEditSaved() {
    setEditingEvent(null);
    fetchEvents();
  }

  function handleDeleted() {
    setDeletingEvent(null);
    fetchEvents();
  }

  if (!isAuthenticated || user?.type !== 'organizer') return null;

  const initials = (user?.name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const now = new Date();

  return (
    <div className={styles.page}>
      <div className={styles.dots} />
      <div className={styles.orbs} />

      {/* ── Navbar ── */}
      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.navLogo}>
            <LogoIcon />
            <span className={styles.navLogoText}>Event<span className={styles.navAccent}>Flow</span></span>
          </Link>

          <div className={styles.navLinks}>
            <Link to="/" className={styles.navLink}>Explorar eventos</Link>
            <Link to="/events/create" className={styles.navLink}>Criar evento</Link>
            <Link to="/organizer/events" className={`${styles.navLink} ${styles.navLinkActive}`}>Meus eventos</Link>
          </div>

          <div className={styles.navUser}>
            <div className={styles.navAvatar}>{initials}</div>
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
        </div>
      </nav>

      <div className={styles.wrapper}>

        {/* ── Header ── */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <Link to="/" className={styles.backBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <div className={styles.pageHeaderText}>
              <h1 className={styles.pageTitle}>Meus eventos</h1>
              <p className={styles.pageSubtitle}>
                {loading ? 'Carregando...' : `${events.length} evento${events.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <Link to="/events/create" className={styles.btnCreate}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Novo evento
          </Link>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className={styles.loading}>
            <span className={styles.spinner} />
            Carregando eventos...
          </div>
        ) : events.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <h3 className={styles.emptyTitle}>Nenhum evento ainda</h3>
            <p className={styles.emptyDesc}>Crie seu primeiro evento e comece a receber inscrições.</p>
            <Link to="/events/create" className={styles.btnCreate}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Criar evento
            </Link>
          </div>
        ) : (
          <div className={styles.eventsList}>
            {events.map((ev) => {
              const isPast = new Date(ev.dateTime) < now;
              return (
                <div key={ev.id} className={styles.eventCard}>
                  <div className={styles.eventCardInner}>
                    <div className={styles.eventImgWrap}>
                      {ev.image ? (
                        <img src={`${API_URL}${ev.image}`} alt={ev.name} className={styles.eventImg} />
                      ) : (
                        <div className={styles.eventImgPlaceholder}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </div>
                      )}
                    </div>

                    <div className={styles.eventInfo}>
                      <h3 className={styles.eventName}>{ev.name}</h3>
                      <div className={styles.eventMeta}>
                        <span className={styles.eventMetaItem}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          {formatDate(ev.dateTime)}
                        </span>
                        <span className={styles.eventMetaItem}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {ev.location}
                        </span>
                        <span className={styles.eventMetaItem}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                          {ev.capacity} vagas
                        </span>
                      </div>
                      {ev.description && <p className={styles.eventDesc}>{ev.description}</p>}
                      <span className={`${styles.eventTag} ${isPast ? styles.tagPast : styles.tagUpcoming}`}>
                        {isPast ? 'Finalizado' : 'Ativo'}
                      </span>
                    </div>

                    <div className={styles.eventActions}>
                      <button className={styles.btnEdit} onClick={() => setEditingEvent(ev)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Editar
                      </button>
                      <button className={styles.btnDelete} onClick={() => setDeletingEvent(ev)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {editingEvent && (
        <EditModal event={editingEvent} onClose={() => setEditingEvent(null)} onSaved={handleEditSaved} />
      )}
      {deletingEvent && (
        <DeleteModal event={deletingEvent} onClose={() => setDeletingEvent(null)} onDeleted={handleDeleted} />
      )}
    </div>
  );
}
