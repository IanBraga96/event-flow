import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getEvent, deleteEvent, registerForEvent, listEvents } from '../../services/eventService';
import AppLayout from '../../components/AppLayout';
import styles from './EventDetails.module.css';

const API_URL = process.env.REACT_APP_API_URL || '';

/* ── Contador regressivo ── */
function Countdown({ dateTime }) {
  const [time, setTime] = useState(getTimeLeft(dateTime));

  function getTimeLeft(iso) {
    const diff = new Date(iso) - new Date();
    if (diff <= 0) return null;
    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft(dateTime)), 1000);
    return () => clearInterval(t);
  }, [dateTime]);

  if (!time) return null;

  const units = [
    { label: 'dias',  value: time.days },
    { label: 'horas', value: time.hours },
    { label: 'min',   value: time.minutes },
    { label: 'seg',   value: time.seconds },
  ];

  return (
    <div className={styles.countdown}>
      <span className={styles.countdownLabel}>⏱ Faltam</span>
      <div className={styles.countdownUnits}>
        {units.map((u, i) => (
          <div key={i} className={styles.countdownUnit}>
            <span className={styles.countdownNum}>{String(u.value).padStart(2, '0')}</span>
            <span className={styles.countdownUnitLabel}>{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Delete Modal ── */
function DeleteModal({ eventName, onClose, onConfirm, loading }) {
  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Excluir evento</h2>
          <button className={styles.modalClose} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <p className={styles.confirmText}>
          Tem certeza que deseja excluir <strong>{eventName}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className={styles.confirmFooter}>
          <button className={styles.btnCancel} onClick={onClose}>Cancelar</button>
          <button className={styles.btnDanger} onClick={onConfirm} disabled={loading}>
            {loading ? <span className={styles.spinnerSmall} /> : 'Excluir evento'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Enroll Modal ── */
function EnrollModal({ event, onClose, onConfirm, loading }) {
  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  }
  function formatTime(iso) {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Confirmar inscrição</h2>
          <button className={styles.modalClose} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className={styles.enrollModalBody}>
          <div className={styles.enrollEventName}>{event.name}</div>
          <div className={styles.enrollDetails}>
            {[
              { icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>, text: formatDate(event.dateTime) },
              { icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>, text: formatTime(event.dateTime) },
              { icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>, text: event.location },
              { icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></>, text: `${event.capacity} vagas disponíveis` },
            ].map((d, i) => (
              <div key={i} className={styles.enrollDetail}>
                <div className={styles.enrollDetailIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">{d.icon}</svg>
                </div>
                <span>{d.text}</span>
              </div>
            ))}
          </div>
          <p className={styles.enrollModalHint}>
            Ao confirmar, sua inscrição será registrada e você poderá acompanhá-la em <strong>Minhas inscrições</strong>.
          </p>
        </div>
        <div className={styles.confirmFooter}>
          <button className={styles.btnCancel} onClick={onClose} disabled={loading}>Cancelar</button>
          <button className={styles.btnEnrollConfirm} onClick={onConfirm} disabled={loading}>
            {loading ? <span className={styles.spinnerSmallTeal} /> : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            )}
            Confirmar inscrição
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Página principal ── */
export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [deleting, setDeleting]     = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEnroll, setShowEnroll] = useState(false);
  const [enrolling, setEnrolling]   = useState(false);
  const [enrolled, setEnrolled]     = useState(false);
  const [enrollMsg, setEnrollMsg]   = useState(null);
  const [related, setRelated]       = useState([]);
  const [copied, setCopied]         = useState(false);

  useEffect(() => {
    getEvent(id)
      .then(({ event: data }) => setEvent(data))
      .catch(() => setError('Evento não encontrado.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    listEvents()
      .then(({ events }) => {
        const others = events
          .filter(ev => String(ev.id) !== String(id) && new Date(ev.dateTime) > new Date())
          .slice(0, 3);
        setRelated(others);
      })
      .catch(() => {});
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteEvent(id);
      navigate('/organizer/events', { replace: true });
    } catch {
      setDeleting(false);
      setShowDelete(false);
    }
  }

  async function handleEnroll() {
    if (!user) return navigate('/login');
    setEnrolling(true);
    setEnrollMsg(null);
    try {
      await registerForEvent(id);
      setEnrolled(true);
      setEnrollMsg('Inscrição realizada com sucesso!');
      setShowEnroll(false);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || '';
      setShowEnroll(false);
      if (status === 409) {
        if (msg.toLowerCase().includes('capacidade') || msg.toLowerCase().includes('capacity'))
          setEnrollMsg('Evento sem vagas disponíveis.');
        else if (msg.toLowerCase().includes('conflito') || msg.toLowerCase().includes('conflict'))
          setEnrollMsg('Você já tem outro evento neste horário.');
        else
          setEnrollMsg('Você já está inscrito neste evento.');
      } else if (status === 403) {
        setEnrollMsg('Apenas participantes podem se inscrever em eventos.');
      } else if (status === 401) {
        setEnrollMsg('Faça login para se inscrever.');
      } else {
        setEnrollMsg('Erro ao realizar inscrição. Tente novamente.');
      }
    } finally {
      setEnrolling(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShareWhatsApp() {
    const text = encodeURIComponent(`Confira este evento: ${event?.name} — ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  if (loading) return (
    <AppLayout>
      <div className={styles.center}>
        <div className={styles.spinner} />
        <p>Carregando evento...</p>
      </div>
    </AppLayout>
  );

  if (error || !event) return (
    <AppLayout>
      <div className={styles.center}>
        <span className={styles.stateIcon}>😕</span>
        <p>{error || 'Evento não encontrado.'}</p>
        <button className={styles.btnBack} onClick={() => navigate('/events')}>← Voltar aos eventos</button>
      </div>
    </AppLayout>
  );

  const isOrganizer = user?.type === 'organizer';
  const isCreator   = isOrganizer && String(event.userId) === String(user?.id);
  const isPast      = new Date(event.dateTime) < new Date();
  const img         = event.image ? `${API_URL}${event.image}` : null;
  const statusKey   = isPast ? 'done' : 'upcoming';
  const statusLabel = isPast ? 'Finalizado' : 'Próximo';

  // Calcula ocupação para barra de progresso (mock: 60% ocupado)
  const ocupados   = Math.round(event.capacity * 0.6);
  const livres     = event.capacity - ocupados;
  const pctOcupado = Math.round((ocupados / event.capacity) * 100);

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  }
  function formatTime(iso) {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  function formatDateShort(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  }

  return (
    <AppLayout searchPlaceholder="Buscar eventos...">

      <button className={styles.btnBack} onClick={() => navigate(-1)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Voltar
      </button>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroImgCol}>
          {img
            ? <img src={img} alt={event.name} className={styles.heroImg} />
            : (
              <div className={styles.heroImgFallback}>
                <svg width="52" height="52" viewBox="0 0 42 42" fill="none">
                  <rect x="7" y="11" width="28" height="22" rx="4" stroke="#14b8a6" strokeWidth="1.8"/>
                  <line x1="7" y1="18" x2="35" y2="18" stroke="#14b8a6" strokeWidth="1.8"/>
                  <line x1="14" y1="7" x2="14" y2="13" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="28" y1="7" x2="28" y2="13" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 25 Q21 21 30 25" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  <path d="M14 29 Q21 25 28 29" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.45"/>
                </svg>
              </div>
            )
          }
        </div>

        <div className={styles.heroInfoCol}>
          <div className={styles.heroTopRow}>
            <span className={`${styles.heroBadge} ${styles[`badge_${statusKey}`]}`}>{statusLabel}</span>
            {event.user?.name && (
              <span className={styles.heroOrgChip}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                {event.user.name}
              </span>
            )}
          </div>

          <h1 className={styles.heroTitle}>{event.name}</h1>

          <div className={styles.heroDateRow}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>{formatDate(event.dateTime)}</span>
            <span className={styles.heroDot}>·</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>{formatTime(event.dateTime)}</span>
            <span className={styles.heroDot}>·</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span>{event.location}</span>
          </div>

          <div className={styles.heroDivider} />

          {isPast ? (
            <div className={styles.heroPastNote}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Este evento já foi encerrado.
            </div>
          ) : (
            <Countdown dateTime={event.dateTime} />
          )}

          <div className={styles.heroVagasPill}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {event.capacity} vagas disponíveis
          </div>
        </div>
      </div>

      {/* ── Grid principal ── */}
      <div className={styles.grid}>

        {/* ── Coluna esquerda ── */}
        <div className={styles.infoCol}>

          {event.description && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardDot}/>
                <span className={styles.cardLabel}>SOBRE O EVENTO</span>
              </div>
              <p className={styles.description}>{event.description}</p>
            </div>
          )}

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardDot}/>
              <span className={styles.cardLabel}>DETALHES</span>
            </div>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div className={styles.detailText}>
                  <span className={styles.detailLabel}>Data</span>
                  <span className={styles.detailValue}>{formatDate(event.dateTime)}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className={styles.detailText}>
                  <span className={styles.detailLabel}>Horário</span>
                  <span className={styles.detailValue}>{formatTime(event.dateTime)}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className={styles.detailText}>
                  <span className={styles.detailLabel}>Local</span>
                  <span className={styles.detailValue}>{event.location}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div className={styles.detailText}>
                  <span className={styles.detailLabel}>Capacidade</span>
                  <span className={styles.detailValue}>{event.capacity} vagas</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Eventos relacionados ── */}
          {related.length > 0 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardDot}/>
                <span className={styles.cardLabel}>OUTROS EVENTOS</span>
              </div>
              <div className={styles.relatedList}>
                {related.map(ev => (
                  <div
                    key={ev.id}
                    className={styles.relatedItem}
                    onClick={() => navigate(`/events/${ev.id}`)}
                  >
                    <div className={styles.relatedImg}>
                      {ev.image
                        ? <img src={`${API_URL}${ev.image}`} alt={ev.name} />
                        : (
                          <div className={styles.relatedImgFallback}>
                            <svg width="18" height="18" viewBox="0 0 42 42" fill="none">
                              <rect x="7" y="11" width="28" height="22" rx="4" stroke="#14b8a6" strokeWidth="1.8"/>
                              <line x1="7" y1="18" x2="35" y2="18" stroke="#14b8a6" strokeWidth="1.8"/>
                              <line x1="14" y1="7" x2="14" y2="13" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round"/>
                              <line x1="28" y1="7" x2="28" y2="13" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </div>
                        )
                      }
                    </div>
                    <div className={styles.relatedInfo}>
                      <span className={styles.relatedName}>{ev.name}</span>
                      <span className={styles.relatedMeta}>
                        {formatDateShort(ev.dateTime)} · {ev.location}
                      </span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={styles.relatedArrow}>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Coluna direita ── */}
        <div className={styles.actionCol}>

          {/* Card participar */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardDot}/>
              <span className={styles.cardLabel}>
                {isCreator ? 'GERENCIAR EVENTO' : 'PARTICIPAR'}
              </span>
            </div>

            {isCreator ? (
              <div className={styles.actionsWrap}>
                <p className={styles.actionHint}>Você é o organizador deste evento.</p>
                <button className={styles.btnParticipants} disabled>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  Ver participantes
                  <span className={styles.comingSoon}>em breve</span>
                </button>
                <button className={styles.btnEdit} onClick={() => navigate('/organizer/events')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Editar evento
                </button>
                <button className={styles.btnDelete} onClick={() => setShowDelete(true)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  Excluir evento
                </button>
              </div>
            ) : isPast ? (
              <div className={styles.actionsWrap}>
                <p className={styles.actionHint}>Este evento já foi encerrado.</p>
                <button className={styles.btnDisabled} disabled>Inscrições encerradas</button>
              </div>
            ) : (
              <div className={styles.actionsWrap}>
                <p className={styles.actionHint}>Garanta sua vaga neste evento!</p>
                {enrollMsg && (
                  <p className={`${styles.enrollMsg} ${enrolled ? styles.enrollSuccess : styles.enrollError}`}>
                    {enrollMsg}
                  </p>
                )}
                <button
                  className={enrolled ? styles.btnEnrolled : styles.btnEnroll}
                  onClick={() => !enrolled && setShowEnroll(true)}
                  disabled={enrolling || enrolled}
                >
                  {enrolling ? <span className={styles.spinnerSmall} /> : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  )}
                  {enrolled ? 'Inscrito! ✓' : enrolling ? 'Inscrevendo...' : 'Inscrever-se'}
                </button>
                <p className={styles.vagasInfo}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  </svg>
                  {event.capacity} vagas disponíveis
                </p>
              </div>
            )}
          </div>

          {/* ── Card vagas com barra de progresso ── */}
          {!isCreator && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardDot}/>
                <span className={styles.cardLabel}>DISPONIBILIDADE</span>
              </div>
              <div className={styles.vagasWrap}>
                <div className={styles.vagasNumbers}>
                  <div className={styles.vagasNum}>
                    <span className={styles.vagasNumVal}>{livres}</span>
                    <span className={styles.vagasNumLabel}>vagas livres</span>
                  </div>
                  <div className={styles.vagasDivider} />
                  <div className={styles.vagasNum}>
                    <span className={styles.vagasNumVal}>{ocupados}</span>
                    <span className={styles.vagasNumLabel}>inscritos</span>
                  </div>
                  <div className={styles.vagasDivider} />
                  <div className={styles.vagasNum}>
                    <span className={styles.vagasNumVal}>{event.capacity}</span>
                    <span className={styles.vagasNumLabel}>total</span>
                  </div>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${pctOcupado}%` }}
                  />
                </div>
                <p className={styles.progressLabel}>{pctOcupado}% das vagas preenchidas</p>
              </div>
            </div>
          )}

          {/* ── Card organizador ── */}
          {event.user?.name && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardDot}/>
                <span className={styles.cardLabel}>ORGANIZADOR</span>
              </div>
              <div className={styles.orgWrap}>
                <div className={styles.orgAvatar}>
                  {event.user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div className={styles.orgInfo}>
                  <span className={styles.orgName}>{event.user.name}</span>
                  <span className={styles.orgRole}>Organizador do evento</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Card compartilhar ── */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardDot}/>
              <span className={styles.cardLabel}>COMPARTILHAR</span>
            </div>
            <div className={styles.shareWrap}>
              <button className={styles.shareBtn} onClick={handleCopy}>
                {copied ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
                {copied ? 'Link copiado!' : 'Copiar link'}
              </button>
              <button className={styles.shareBtnWhatsApp} onClick={handleShareWhatsApp}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                WhatsApp
              </button>
            </div>
          </div>

        </div>
      </div>

      {showDelete && (
        <DeleteModal
          eventName={event.name}
          onClose={() => setShowDelete(false)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
      {showEnroll && (
        <EnrollModal
          event={event}
          onClose={() => setShowEnroll(false)}
          onConfirm={handleEnroll}
          loading={enrolling}
        />
      )}
    </AppLayout>
  );
}