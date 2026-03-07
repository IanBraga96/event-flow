import styles from './EventsHighlight.module.css';
import ev1 from '../../../../assets/images/landing/ev1.jpg'; 
import ev2 from '../../../../assets/images/landing/ev2.jpg'; 
import ev3 from '../../../../assets/images/landing/ev3.jpg'; 
import ev4 from '../../../../assets/images/landing/ev4.jpg'; 
import ev5 from '../../../../assets/images/landing/ev5.jpg';
import ev6 from '../../../../assets/images/landing/ev6.jpg';
import ev7 from '../../../../assets/images/landing/ev7.jpg';
import ev8 from '../../../../assets/images/landing/ev8.jpg';
import ev9 from '../../../../assets/images/landing/ev9.jpg';
import ev10 from '../../../../assets/images/landing/ev10.jpg';
import ev11 from '../../../../assets/images/landing/ev11.jpg'; 
import ev12 from '../../../../assets/images/landing/ev12.jpg';

const events = [
  {
    tag: 'Ao vivo',
    tagColor: 'live',
    title: 'Summit de Inovação 2026',
    meta: '7 Mar 2026 — São Paulo',
    org: 'TechBrasil',
    vagas: '120 vagas',
    img: ev1,
  },
  {
    tag: 'Próximo',
    tagColor: 'upcoming',
    title: 'Workshop de UX Design',
    meta: '22 Mar 2026 — Remoto',
    org: 'DesignHub',
    vagas: '80 vagas',
    img: ev2,
  },
  {
    tag: 'Próximo',
    tagColor: 'upcoming',
    title: 'Hackathon Dev Connect',
    meta: '30 Abr 2026 — BH',
    org: 'DevConnect',
    vagas: '70 vagas',
    img: ev3,
  },
  {
    tag: 'Finalizado',
    tagColor: 'done',
    title: 'Conferência de IA 2024',
    meta: '10 Fev 2026 — São Paulo',
    org: 'AIBrasil',
    vagas: 'Encerrado',
    img: ev4,
  },
  {
    tag: 'Próximo',
    tagColor: 'upcoming',
    title: 'Meetup de Startups',
    meta: '05 Abr 2026 — Rio de Janeiro',
    org: 'StartupRJ',
    vagas: '150 vagas',
    img: ev5,
  },
  {
    tag: 'Finalizado',
    tagColor: 'done',
    title: 'Festival de Engenharia',
    meta: '20 Fev 2026 — Curitiba',
    org: 'EngFest',
    vagas: 'Encerrado',
    img: ev6,
  },
  {
    tag: 'Próximo',
    tagColor: 'upcoming',
    title: 'Workshop de Liderança',
    meta: '18 Abr 2026 — Remoto',
    org: 'LeadAcademy',
    vagas: '60 vagas',
    img: ev7,
  },
  {
    tag: 'Próximo',
    tagColor: 'upcoming',
    title: 'Bootcamp de Python',
    meta: '25 Abr 2026 — Remoto',
    org: 'CodeAcademy',
    vagas: '100 vagas',
    img: ev8,
  },
  {
    tag: 'Finalizado',
    tagColor: 'done',
    title: 'Encontro de Product Managers',
    meta: '01 Fev 2026 — São Paulo',
    org: 'PMHub',
    vagas: 'Encerrado',
    img: ev9,
  },
  {
    tag: 'Próximo',
    tagColor: 'upcoming',
    title: 'Semana de Acessibilidade Digital',
    meta: '10 Mai 2026 — Remoto',
    org: 'A11yBrasil',
    vagas: '240 vagas',
    img: ev10,
  },
  {
    tag: 'Próximo',
    tagColor: 'live',
    title: 'Maratona de Data Science',
    meta: '10 Mai 2026 — Porto Alegre',
    org: 'DataSul',
    vagas: '180 vagas',
    img: ev11,
  },
  {
    tag: 'Próximo',
    tagColor: 'upcoming',
    title: 'Fórum de Cibersegurança',
    meta: '30 Mai 2026 — Brasília',
    org: 'CyberBR',
    vagas: '250 vagas',
    img: ev12,
  },
];

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