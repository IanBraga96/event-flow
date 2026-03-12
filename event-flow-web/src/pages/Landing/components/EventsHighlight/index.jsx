import { useEffect, useState } from 'react';
import { listEvents } from '../../../../services/eventService';
import styles from './EventsHighlight.module.css';

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Formata a data ISO para exibição: "7 Mar 2026"
 */
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Determina tag e cor com base na data do evento
 */
function getTagInfo(isoString) {
  const now = new Date();
  const eventDate = new Date(isoString);
  const diffHours = (eventDate - now) / (1000 * 60 * 60);

  if (diffHours < 0) {
    return { tag: 'Finalizado', tagColor: 'done' };
  }
  if (diffHours <= 24) {
    return { tag: 'Ao vivo', tagColor: 'live' };
  }
  return { tag: 'Próximo', tagColor: 'upcoming' };
}

/**
 * Mapeia evento da API para o formato do Card
 */
function toCardEvent(apiEvent) {
  const { tag, tagColor } = getTagInfo(apiEvent.dateTime);
  const isDone = tagColor === 'done';

  return {
    id: apiEvent.id,
    tag,
    tagColor,
    title: apiEvent.name,
    meta: `${formatDate(apiEvent.dateTime)} — ${apiEvent.location}`,
    org: apiEvent.user?.name ?? '',
    vagas: isDone ? 'Encerrado' : `${apiEvent.capacity} vagas`,
    img: apiEvent.image ? `${API_URL}${apiEvent.image}` : null,
  };
}

function Card({ ev }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardImgWrap}>
        <img src={ev.img} alt={ev.title} className={styles.cardImg} />
        <div className={styles.cardImgOverlay} />
        <span className={`${styles.cardTag} ${styles[`tag${ev.tagColor}`]}`}>
          {ev.tag}
        </span>
      </div>
      <div className={styles.cardInfo}>
        <div className={styles.cardInfoTop}>
          <h3 className={styles.cardTitle}>{ev.title}</h3>
          <span className={styles.cardArrow}>→</span>
        </div>
        <p className={styles.cardMeta}>{ev.meta}</p>
        <div className={styles.cardBottom}>
          <span className={styles.cardOrg}>{ev.org}</span>
          <span className={`${styles.cardVagas} ${ev.tagColor === 'done' ? styles.vagasDone : ''}`}>
            {ev.vagas}
          </span>
        </div>
      </div>
    </div>
  );
}

function EventsHighlight() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listEvents()
      .then(({ events: data }) => setEvents(data.map(toCardEvent)))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || events.length === 0) return null;

  return (
    <section className={styles.section} id="eventos">
      <div className={styles.container}>

        {/* ── HEADER ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              Events
            </span>
            <h2 className={styles.title}>EVENTOS ✦</h2>
            <span className={styles.hint}>Passe o mouse para pausar →</span>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.totalNum}>{events.length}</span>
            <span className={styles.totalLabel}>eventos</span>
          </div>
        </div>

        {/* ── MARQUEE ── */}
        <div className={styles.marqueeWrap}>
          <div className={styles.fadeLeft} />
          <div className={styles.fadeRight} />
          <div className={styles.marqueeTrack}>
            {/* duplica os cards para loop infinito */}
            {[...events, ...events].map((ev, i) => (
              <Card key={i} ev={ev} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default EventsHighlight;
