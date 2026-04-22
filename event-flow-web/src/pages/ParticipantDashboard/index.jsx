import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { listMyRegistrations, listEvents } from '../../services/eventService';
import AppLayout from '../../components/AppLayout';
import styles from './ParticipantDashboard.module.css';

const API_URL = process.env.REACT_APP_API_URL || '';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function getTagInfo(iso) {
  const diff = (new Date(iso) - new Date()) / (1000 * 60 * 60);
  if (diff < 0)   return { tag: 'Finalizado', tagColor: 'done' };
  if (diff <= 24) return { tag: 'Ao vivo',    tagColor: 'live' };
  return           { tag: 'Próximo',           tagColor: 'upcoming' };
}

function getStatus(iso) {
  const diff = (new Date(iso) - new Date()) / (1000 * 60 * 60);
  if (diff < 0)   return 'done';
  if (diff <= 24) return 'live';
  return           'upcoming';
}

/* ── Card no padrão EventsHighlight ── */
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
        <span className={`${styles.cardTag} ${styles[`tag${tagColor}`]}`}>
          {tag}
        </span>
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
    { value: upcoming, color: '#14b8a6', label: 'Próximos' },
    { value: live,     color: '#f59e0b', label: 'Ao vivo' },
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
            !day                              ? styles.calendarEmpty    : '',
            day === now.getDate()             ? styles.calendarToday   : '',
            day && eventDays[day] === 'upcoming' ? styles.calendarUpcoming : '',
            day && eventDays[day] === 'live'     ? styles.calendarLive     : '',
            day && eventDays[day] === 'done'     ? styles.calendarDone     : '',
          ].join(' ')}>
            {day || ''}
          </span>
        ))}
      </div>
      <div className={styles.calendarLegend}>
        <span><span className={styles.dot} style={{background:'#14b8a6'}}/> Próximo</span>
        <span><span className={styles.dot} style={{background:'#f59e0b'}}/> Ao vivo</span>
        <span><span className={styles.dot} style={{background:'#334155'}}/> Finalizado</span>
      </div>
    </div>
  );
}

/* ── Página principal ── */
export default function ParticipantDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'participant') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [myEvents,    setMyEvents]    = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading,     setLoading]     = useState(true);

useEffect(() => {
  if (!user?.id) return;

  Promise.all([
    listMyRegistrations(user.id),
    listEvents(),
  ])
    .then(([regData, evData]) => {
      const registrations = regData.events || regData.data || regData || [];
      const allEvents     = evData.events || [];

      const eventsMap = Object.fromEntries(allEvents.map(ev => [ev.id, ev]));

      const normalized = Array.isArray(registrations)
        ? registrations.map(item => {
            const base = item.event ?? item;
            const full = eventsMap[base.id] ?? {};
            return { ...base, ...full };
          })
        : [];

      setMyEvents(normalized);
    })
    .catch(() => setMyEvents([]))
    .finally(() => setLoading(false));

  listEvents()
    .then(({ events }) => {
      const sugg = events
        .filter(ev => getStatus(ev.dateTime) !== 'done')
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
      setSuggestions(sugg);
    })
    .catch(() => setSuggestions([]));
}, [user]);

  if (!isAuthenticated || user?.type !== 'participant') return null;

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
            {greeting}, <span className={styles.greetingName}>{firstName}</span>! 👋
          </h1>
          <p className={styles.greetingSub}>
            {loading ? 'Carregando seus eventos...'
              : myEvents.length === 0
                ? 'Você ainda não tem inscrições. Que tal explorar os eventos?'
                : `Você tem ${upcoming.length + live.length} evento${upcoming.length + live.length !== 1 ? 's' : ''} por vir.`
            }
          </p>
        </div>
        <Link to="/events" className={styles.btnExplore}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Explorar eventos
        </Link>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        {[
          { label: 'Total de inscrições', num: myEvents.length, cls: 'statTeal',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
          { label: 'Próximos eventos',    num: upcoming.length, cls: 'statAmber',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
          { label: 'Eventos finalizados', num: done.length,     cls: 'statPurple',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
          { label: 'Ao vivo agora',       num: live.length,     cls: 'statRed',
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

          {/* Lista próximos */}
          {upcoming.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionDot} />
                <h3 className={styles.sectionTitle}>Seus próximos eventos</h3>
                <Link to="/participant/events" className={styles.sectionLink}>Ver todos →</Link>
              </div>
              <div className={styles.eventsList}>
                {upcoming.slice(0, 3).map(ev => (
                  <div key={ev.id} className={styles.eventItem} onClick={() => navigate(`/events/${ev.id}`)}>
                    <div className={styles.eventItemImg}>
                      {ev.image ? <img src={`${API_URL}${ev.image}`} alt={ev.name} /> : <span>📅</span>}
                    </div>
                    <div className={styles.eventItemInfo}>
                      <span className={styles.eventItemName}>{ev.name}</span>
                      <span className={styles.eventItemMeta}>{formatDate(ev.dateTime)} · {ev.location}</span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading && myEvents.length === 0 && (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🎟️</span>
              <h3 className={styles.emptyTitle}>Nenhuma inscrição ainda</h3>
              <p className={styles.emptyDesc}>Explore os eventos e garanta sua vaga!</p>
              <Link to="/events" className={styles.btnExplore}>Explorar eventos →</Link>
            </div>
          )}
        </div>

        <div className={styles.rightCol}>
          {myEvents.length > 0 && (
            <div className={styles.card}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionDot} />
                <h3 className={styles.sectionTitle}>Suas inscrições</h3>
              </div>
              <DonutChart done={done.length} upcoming={upcoming.length} live={live.length} />
            </div>
          )}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionDot} />
              <h3 className={styles.sectionTitle}>Calendário</h3>
            </div>
            <MiniCalendar events={myEvents} />
          </div>
        </div>
      </div>

      {/* ── Sugestões no padrão EventsHighlight ── */}
      {suggestions.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionDot} />
            <h3 className={styles.sectionTitle}>Descubra novos eventos</h3>
            <Link to="/events" className={styles.sectionLink}>Ver todos →</Link>
          </div>
          <div className={styles.sugGrid}>
            {suggestions.map(ev => (
              <SugCard key={ev.id} ev={ev} />
            ))}
          </div>
        </div>
      )}

    </AppLayout>
  );
}