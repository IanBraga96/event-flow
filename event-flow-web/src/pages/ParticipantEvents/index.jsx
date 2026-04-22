import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { listMyRegistrations, cancelRegistration } from '../../services/eventService';
import AppLayout from '../../components/AppLayout';
import styles from './ParticipantEvents.module.css';

const API_URL = process.env.REACT_APP_API_URL || '';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit',
  });
}

function getStatus(iso) {
  const diff = (new Date(iso) - new Date()) / (1000 * 60 * 60);
  if (diff < 0)   return { label: 'Finalizado', key: 'done' };
  if (diff <= 24) return { label: 'Ao vivo',    key: 'live' };
  return           { label: 'Próximo',           key: 'upcoming' };
}

/* ── Modal de cancelamento ── */
function CancelModal({ eventName, onClose, onConfirm, loading }) {
  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Cancelar inscrição</h2>
          <button className={styles.modalClose} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <p className={styles.confirmText}>
          Tem certeza que deseja cancelar sua inscrição em <strong>{eventName}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className={styles.confirmFooter}>
          <button className={styles.btnKeep} onClick={onClose}>Manter inscrição</button>
          <button className={styles.btnCancel} onClick={onConfirm} disabled={loading}>
            {loading ? <span className={styles.spinnerSmall} /> : 'Cancelar inscrição'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ParticipantEvents() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'participant') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [canceling, setCanceling] = useState(null); // { id, name }
  const [cancelLoading, setCancelLoading] = useState(false);
  const [filter, setFilter]       = useState('all');

  useEffect(() => {
    if (!user?.id) return;
    listMyRegistrations(user.id)
      .then(data => {
          const list = data.events || data.data || data || [];
          const normalized = (Array.isArray(list) ? list : []).map(item => ({
            ...item.event,
            registrationId: item.registrationId,
            registeredAt: item.registeredAt,
          }));
          setEvents(normalized);
        })
      .catch(() => setError('Não foi possível carregar suas inscrições.'))
      .finally(() => setLoading(false));
  }, [user]);

  async function handleCancel() {
    if (!canceling) return;
    setCancelLoading(true);
    try {
      // usa registrationId se disponível, senão usa o id do evento
      const id = canceling.registrationId || canceling.id;
      await cancelRegistration(id);
      setEvents(prev => prev.filter(ev => ev.id !== canceling.id));
      setCanceling(null);
    } catch {
      // endpoint ainda não disponível — placeholder
    } finally {
      setCancelLoading(false);
    }
  }

  const filtered = events.filter(ev => {
    if (filter === 'all') return true;
    return getStatus(ev.dateTime).key === filter;
  });

  const counts = {
    all:      events.length,
    upcoming: events.filter(e => getStatus(e.dateTime).key === 'upcoming').length,
    live:     events.filter(e => getStatus(e.dateTime).key === 'live').length,
    done:     events.filter(e => getStatus(e.dateTime).key === 'done').length,
  };

  if (!isAuthenticated || user?.type !== 'participant') return null;

  return (
    <AppLayout searchPlaceholder="Buscar eventos...">

      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Minhas inscrições</h1>
          <p className={styles.pageSubtitle}>
            {loading ? 'Carregando...' : `${events.length} evento${events.length !== 1 ? 's' : ''} inscrito${events.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link to="/events" className={styles.btnExplore}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Explorar eventos
        </Link>
      </div>

      {/* ── Filtros ── */}
      {!loading && !error && events.length > 0 && (
        <div className={styles.filters}>
          {[
            { key: 'all',      label: 'Todos' },
            { key: 'upcoming', label: 'Próximos' },
            { key: 'live',     label: 'Ao vivo' },
            { key: 'done',     label: 'Finalizados' },
          ].map(f => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${filter === f.key ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className={styles.filterCount}>{counts[f.key]}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Estados ── */}
      {loading && (
        <div className={styles.center}>
          <div className={styles.spinner} />
          <p>Carregando suas inscrições...</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.center}>
          <span className={styles.stateIcon}>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>Nenhuma inscrição ainda</h3>
          <p className={styles.emptyDesc}>Explore os eventos disponíveis e garanta sua vaga!</p>
          <Link to="/events" className={styles.btnExplore}>
            Explorar eventos →
          </Link>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && events.length > 0 && (
        <div className={styles.center}>
          <span className={styles.stateIcon}>🔍</span>
          <p>Nenhum evento neste filtro</p>
        </div>
      )}

      {/* ── Lista de eventos ── */}
      {!loading && !error && filtered.length > 0 && (
        <div className={styles.eventsList}>
          {filtered.map(ev => {
            const status = getStatus(ev.dateTime);
            const img    = ev.image ? `${API_URL}${ev.image}` : null;
            const isPast = status.key === 'done';

            return (
              <div key={ev.id} className={styles.eventCard}>
                <div className={styles.eventImgWrap} onClick={() => navigate(`/events/${ev.id}`)}>
                  {img
                    ? <img src={img} alt={ev.name} className={styles.eventImg} />
                    : (
                      <div className={styles.eventImgFallback}>
                        <svg width="32" height="32" viewBox="0 0 42 42" fill="none">
                          <rect x="7" y="11" width="28" height="22" rx="4" stroke="#14b8a6" strokeWidth="1.8" />
                          <line x1="7" y1="18" x2="35" y2="18" stroke="#14b8a6" strokeWidth="1.8" />
                          <line x1="14" y1="7" x2="14" y2="13" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" />
                          <line x1="28" y1="7" x2="28" y2="13" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" />
                          <path d="M12 25 Q21 21 30 25" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                          <path d="M14 29 Q21 25 28 29" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.45" />
                        </svg>
                      </div>
                    )
                  }
                  <span className={`${styles.badge} ${styles[`badge_${status.key}`]}`}>
                    {status.label}
                  </span>
                </div>

                <div className={styles.eventInfo}>
                  <h3 className={styles.eventName}
                    onClick={() => navigate(`/events/${ev.id}`)}
                  >{ev.name}</h3>

                  <div className={styles.eventMeta}>
                    <span className={styles.metaItem}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {formatDate(ev.dateTime)} · {formatTime(ev.dateTime)}
                    </span>
                    <span className={styles.metaItem}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {ev.location}
                    </span>
                  </div>

                  {ev.description && (
                    <p className={styles.eventDesc}>{ev.description}</p>
                  )}
                </div>

                <div className={styles.eventActions}>
                  <button
                    className={styles.btnDetails}
                    onClick={() => navigate(`/events/${ev.id}`)}
                  >
                    Ver detalhes →
                  </button>
                  {!isPast && (
                    <button
                      className={styles.btnCancel}
                      onClick={() => setCanceling({ id: ev.id, registrationId: ev.registrationId, name: ev.name })}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Cancelar inscrição
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal cancelar ── */}
      {canceling && (
        <CancelModal
          eventName={canceling.name}
          onClose={() => setCanceling(null)}
          onConfirm={handleCancel}
          loading={cancelLoading}
        />
      )}
    </AppLayout>
  );
}