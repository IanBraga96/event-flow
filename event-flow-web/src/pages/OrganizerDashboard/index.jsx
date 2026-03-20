import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { listMyEvents, listEvents } from '../../services/eventService';
import AppLayout from '../../components/AppLayout';
import styles from './OrganizerDashboard.module.css';

const API_URL = process.env.REACT_APP_API_URL || '';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function getStatus(iso) {
  const diff = (new Date(iso) - new Date()) / (1000 * 60 * 60);
  if (diff < 0)   return 'done';
  if (diff <= 24) return 'live';
  return           'upcoming';
}

function getTagInfo(iso) {
  const s = getStatus(iso);
  if (s === 'done')     return { tag: 'Finalizado', tagColor: 'done' };
  if (s === 'live')     return { tag: 'Ao vivo',    tagColor: 'live' };
  return                       { tag: 'Próximo',     tagColor: 'upcoming' };
}

/* ── Contador regressivo ── */
function Countdown({ dateTime }) {
  const [time, setTime] = useState(getTimeLeft(dateTime));

  function getTimeLeft(iso) {
    const diff = new Date(iso) - new Date();
    if (diff <= 0) return null;
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft(dateTime)), 1000);
    return () => clearInterval(t);
  }, [dateTime]);

  if (!time) return <span className={styles.countdownDone}>Encerrado</span>;

  return (
    <div className={styles.countdown}>
      {[
        { v: time.days,    l: 'dias' },
        { v: time.hours,   l: 'horas' },
        { v: time.minutes, l: 'min' },
        { v: time.seconds, l: 'seg' },
      ].map((u, i) => (
        <div key={i} className={styles.countdownUnit}>
          <span className={styles.countdownNum}>{String(u.v).padStart(2, '0')}</span>
          <span className={styles.countdownLabel}>{u.l}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Gráfico de rosca ── */
function DonutChart({ done, upcoming, live }) {
  const total = done + upcoming + live || 1;
  const r = 40;
  const circ = 2 * Math.PI * r;

  const segments = [
    { value: upcoming, color: '#f59e0b', label: 'Ativos' },
    { value: live,     color: '#ef4444', label: 'Ao vivo' },
    { value: done,     color: '#334155', label: 'Finalizados' },
  ];

  let offset = 0;
  const paths = segments.map((seg, i) => {
    const dash = (seg.value / total) * circ;
    const gap  = circ - dash;
    const el = (
      <circle key={i} cx="50" cy="50" r={r}
        fill="none" stroke={seg.color} strokeWidth="14"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    );
    offset += dash;
    return el;
  });

  return (
    <div className={styles.donutWrap}>
      <div className={styles.donutSvgWrap}>
        <svg viewBox="0 0 100 100" className={styles.donutSvg} style={{ transform: 'rotate(-90deg)' }}>
          {paths}
        </svg>
        <div className={styles.donutCenter}>
          <span className={styles.donutTotal}>{done + upcoming + live}</span>
          <span className={styles.donutLabel}>eventos</span>
        </div>
      </div>
      <div className={styles.donutLegend}>
        {segments.map((s, i) => (
          <div key={i} className={styles.donutLegendItem}>
            <span className={styles.donutDot} style={{ background: s.color }} />
            <span>{s.label}</span>
            <span className={styles.donutLegendNum}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Mini calendário ── */
function MiniCalendar({ events }) {
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventDays = {};
  events.forEach(ev => {
    const d = new Date(ev.dateTime);
    if (d.getFullYear() === year && d.getMonth() === month) {
      eventDays[d.getDate()] = getStatus(ev.dateTime);
    }
  });

  const monthName = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const weeks = [];
  let week = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <span className={styles.calendarMonth}>{monthName}</span>
      </div>
      <div className={styles.calendarGrid}>
        {['D','S','T','Q','Q','S','S'].map((d, i) => (
          <span key={i} className={styles.calendarDayName}>{d}</span>
        ))}
        {weeks.flat().map((day, i) => (
          <span key={i} className={[
            styles.calendarDay,
            !day                                 ? styles.calendarEmpty    : '',
            day === now.getDate()                ? styles.calendarToday    : '',
            day && eventDays[day] === 'upcoming' ? styles.calendarUpcoming : '',
            day && eventDays[day] === 'live'     ? styles.calendarLive     : '',
            day && eventDays[day] === 'done'     ? styles.calendarDone     : '',
          ].join(' ')}>
            {day || ''}
          </span>
        ))}
      </div>
      <div className={styles.calendarLegend}>
        <span><span className={styles.dot} style={{background:'#f59e0b'}}/> Ativo</span>
        <span><span className={styles.dot} style={{background:'#ef4444'}}/> Ao vivo</span>
        <span><span className={styles.dot} style={{background:'#334155'}}/> Finalizado</span>
      </div>
    </div>
  );
}

/* ── Card sugestão ── */
function SugCard({ ev }) {
  const navigate = useNavigate();
  const { tag, tagColor } = getTagInfo(ev.dateTime);
  const isDone = tagColor === 'done';
  const img = ev.image ? `${API_URL}${ev.image}` : null;

  return (
    <div className={styles.sugCard} onClick={() => navigate(`/events/${ev.id}`)}>
      <div className={styles.cardImgWrap}>
        {img
          ? <img src={img} alt={ev.name} className={styles.cardImg} />
          : <div className={styles.cardImgFallback}>📅</div>
        }
        <div className={styles.cardImgOverlay} />
        <span className={`${styles.cardTag} ${styles[`tag${tagColor}`]}`}>{tag}</span>
      </div>
      <div className={styles.cardInfo}>
        <div className={styles.cardInfoTop}>
          <h3 className={styles.cardTitle}>{ev.name}</h3>
          <span className={styles.cardArrow}>→</span>
        </div>
        <p className={styles.cardMeta}>{formatDate(ev.dateTime)} — {ev.location}</p>
        <div className={styles.cardBottom}>
          <span className={styles.cardOrg}>{ev.user?.name ?? ''}</span>
          <span className={`${styles.cardVagas} ${isDone ? styles.vagasDone : ''}`}>
            {isDone ? 'Encerrado' : `${ev.capacity} vagas`}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Página principal ── */
export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'organizer') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [myEvents,    setMyEvents]    = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    listMyEvents()
      .then(({ events: data }) => setMyEvents(data || []))
      .catch(() => setMyEvents([]))
      .finally(() => setLoading(false));

    listEvents()
      .then(({ events }) => {
        const sugg = events
          .filter(ev => String(ev.userId) !== String(user.id))
          .filter(ev => getStatus(ev.dateTime) !== 'done')
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
        setSuggestions(sugg);
      })
      .catch(() => setSuggestions([]));
  }, [user]);

  if (!isAuthenticated || user?.type !== 'organizer') return null;

  const upcoming  = myEvents.filter(e => getStatus(e.dateTime) === 'upcoming');
  const live      = myEvents.filter(e => getStatus(e.dateTime) === 'live');
  const done      = myEvents.filter(e => getStatus(e.dateTime) === 'done');
  const nextEvent = [...live, ...upcoming][0] || null;
  const firstName = user?.name?.split(' ')[0] || 'você';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <AppLayout searchPlaceholder="Buscar eventos...">

      {/* ── Saudação ── */}
      <div className={styles.greeting}>
        <div>
          <h1 className={styles.greetingTitle}>
            {greeting}, <span className={styles.greetingName}>{firstName}</span>! 🎤
          </h1>
          <p className={styles.greetingSub}>
            {loading ? 'Carregando seus eventos...'
              : myEvents.length === 0
                ? 'Você ainda não criou nenhum evento. Que tal começar agora?'
                : `Você tem ${upcoming.length + live.length} evento${upcoming.length + live.length !== 1 ? 's' : ''} ativo${upcoming.length + live.length !== 1 ? 's' : ''}.`
            }
          </p>
        </div>
        <Link to="/events/create" className={styles.btnCreate}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Criar evento
        </Link>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        {[
          { label: 'Total de eventos', num: myEvents.length, cls: 'statAmber',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
          { label: 'Eventos ativos',   num: upcoming.length, cls: 'statTeal',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
          { label: 'Finalizados',      num: done.length,     cls: 'statPurple',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
          { label: 'Ao vivo agora',    num: live.length,     cls: 'statRed',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
        ].map((s, i) => (
          <div key={i} className={`${styles.statCard} ${styles[s.cls]}`}>
            <div className={styles.statIcon}>{s.icon}</div>
            <div>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Grid principal ── */}
      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>

          {/* Próximo evento destaque */}
          {nextEvent && (
            <div className={styles.featuredCard} onClick={() => navigate(`/events/${nextEvent.id}`)}>
              {nextEvent.image && <img src={`${API_URL}${nextEvent.image}`} alt={nextEvent.name} className={styles.featuredImg} />}
              <div className={styles.featuredOverlay} />
              <div className={styles.featuredContent}>
                <span className={styles.featuredEyebrow}>
                  {live.length > 0 ? '🔴 Ao vivo agora' : '⏰ Próximo evento'}
                </span>
                <h2 className={styles.featuredTitle}>{nextEvent.name}</h2>
                <p className={styles.featuredDate}>📍 {nextEvent.location} · {formatDate(nextEvent.dateTime)}</p>
                <Countdown dateTime={nextEvent.dateTime} />
              </div>
            </div>
          )}

          {/* Lista de eventos recentes */}
          {myEvents.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionDot} />
                <h3 className={styles.sectionTitle}>Seus eventos recentes</h3>
                <Link to="/organizer/events" className={styles.sectionLink}>Ver todos →</Link>
              </div>
              <div className={styles.eventsList}>
                {myEvents.slice(0, 3).map(ev => {
                  const status = getStatus(ev.dateTime);
                  return (
                    <div key={ev.id} className={styles.eventItem}>
                      <div className={styles.eventItemImg} onClick={() => navigate(`/events/${ev.id}`)}>
                        {ev.image ? <img src={`${API_URL}${ev.image}`} alt={ev.name} /> : <span>📅</span>}
                      </div>
                      <div className={styles.eventItemInfo} onClick={() => navigate(`/events/${ev.id}`)}>
                        <span className={styles.eventItemName}>{ev.name}</span>
                        <span className={styles.eventItemMeta}>{formatDate(ev.dateTime)} · {ev.location}</span>
                      </div>
                      <span className={`${styles.eventItemTag} ${styles[`tag_${status}`]}`}>
                        {status === 'upcoming' ? 'Ativo' : status === 'live' ? 'Ao vivo' : 'Finalizado'}
                      </span>
                    </div>
                  );
                })}
              </div>
              <Link to="/organizer/events" className={styles.btnVerTodos}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Gerenciar todos os eventos
              </Link>
            </div>
            )}


          {/* Empty state */}
          {!loading && myEvents.length === 0 && (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🎤</span>
              <h3 className={styles.emptyTitle}>Nenhum evento criado ainda</h3>
              <p className={styles.emptyDesc}>Crie seu primeiro evento e comece a receber inscrições!</p>
              <Link to="/events/create" className={styles.btnCreate}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Criar primeiro evento
              </Link>
            </div>
          )}
        </div>

        <div className={styles.rightCol}>
          {/* Gráfico */}
          {myEvents.length > 0 && (
            <div className={styles.card}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionDot} />
                <h3 className={styles.sectionTitle}>Seus eventos</h3>
              </div>
              <DonutChart done={done.length} upcoming={upcoming.length} live={live.length} />
            </div>
          )}

          {/* Calendário */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionDot} />
              <h3 className={styles.sectionTitle}>Calendário</h3>
            </div>
            <MiniCalendar events={myEvents} />
          </div>
        </div>
      </div>

      {/* ── Explore outros eventos ── */}
      {suggestions.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionDot} />
            <h3 className={styles.sectionTitle}>Outros eventos na plataforma</h3>
            <Link to="/events" className={styles.sectionLink}>Ver todos →</Link>
          </div>
          <div className={styles.sugGrid}>
            {suggestions.map(ev => <SugCard key={ev.id} ev={ev} />)}
          </div>
        </div>
      )}

    </AppLayout>
  );
}