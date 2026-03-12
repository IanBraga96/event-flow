import { useState, useEffect, useRef } from 'react';
import { listEvents } from '../../../../services/eventService';
import styles from './Hero.module.css';
import presencial from '../../../../assets/images/landing/presencial.jpg';
import online from '../../../../assets/images/landing/online.jpg';
import como from '../../../../assets/images/landing/comofunci.jpg';

const API_URL = process.env.REACT_APP_API_URL;


/**
 * Embaralha array (Fisher-Yates) e retorna os primeiros n
 */
function pickRandom(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

const miniCards = [
  { label: 'Presenciais', emoji: '📍', img: presencial },
  { label: 'Online', emoji: '💻', img: online },
];

function Hero() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);
  const slide = slides[current] || {};
  const [destaques, setDestaques] = useState([]);
  const [gridEvents, setGridEvents] = useState([]);

  const rightColRef = useRef(null);
  const [artworkHeight, setArtworkHeight] = useState('auto');

  useEffect(() => {
    listEvents()
      .then(({ events }) => {
        const now = new Date();
        const upcoming = events
          .filter((ev) => new Date(ev.dateTime) > now)
          .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

        setDestaques(upcoming.slice(0, 2).map((ev) => ev.name));

        setSlides(
          pickRandom(events, 3).map((ev) => ({
            title: ev.name,
            description: ev.description || '',
            img: ev.image ? `${API_URL}${ev.image}` : null,
          }))
        );

        setGridEvents(
          pickRandom(events, 4).map((ev) => ({
            img: ev.image ? `${API_URL}${ev.image}` : null,
            title: ev.name,
            category: ev.location,
          }))
        );
      })
      .catch(() => {
        setSlides([]);
        setDestaques([]);
        setGridEvents([]);
      });
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (rightColRef.current) {
        setArtworkHeight(rightColRef.current.offsetHeight + 'px');
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const prev = () => setCurrent(i => (i - 1 + slides.length) % slides.length);
  const next = () => setCurrent(i => (i + 1) % slides.length);

  return (
    <section className={styles.heroWrap}>
      {/* glows de fundo */}
      <div className={styles.glowTeal} />
      <div className={styles.glowAmber} />

      <div className={styles.container}>

        {/* ── BANNER PRINCIPAL ── */}
        <div className={styles.banner}>
          <div className={styles.bannerBg} />

          {/* badge */}
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            EventFlow
          </div>

          <div className={styles.bannerInner}>
            <button className={styles.arrow} onClick={prev}>‹</button>

            <div className={styles.bannerText}>
              <h1 className={styles.bannerTitle}>{slide.title}</h1>
              <p className={styles.bannerDesc}>{slide.description}</p>
              <a href="/register" className={styles.bannerBtn}>
                Inscrever-se →
              </a>
              <div className={styles.dots}>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                  />
                ))}
              </div>
            </div>

            <div className={styles.bannerImgWrap}>
              <div className={styles.bannerImgGlow} />
              <img
                key={current}
                src={slide.img}
                alt={slide.title}
                className={styles.bannerImg}
              />
            </div>

            <button className={styles.arrow} onClick={next}>›</button>
          </div>
        </div>

        {/* ── GRADE INFERIOR ── */}
        <div className={styles.grid}>

          {/* coluna esquerda */}
          <div className={styles.artworkCard} style={{ height: artworkHeight }}>
            <div className={styles.artworkHeader}>
              <h2 className={styles.artworkTitle}>Eventos em Destaque</h2>
              <span className={styles.artworkArrow}>›</span>
            </div>

            <div className={styles.artworkGrid}>
              {gridEvents.map((ev, i) => (
                <div key={i} className={styles.artworkItem}>
                  <img src={ev.img} alt={ev.title} className={styles.artworkImg} />
                  <div className={styles.artworkOverlay}>
                    <span className={styles.artworkCategory}>{ev.category}</span>
                    <p className={styles.artworkEventTitle}>{ev.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className={styles.viewMore}>Ver todos os eventos</button>
          </div>

          {/* coluna direita */}
          <div className={styles.rightCol} ref={rightColRef}>

            <div className={styles.searchCard}>
              <h2 className={styles.searchTitle}>Próximos Eventos</h2>
              <div className={styles.searchList}>
                {destaques.map((ev, i) => (
                  <button key={i} className={styles.searchItem}>
                    <span className={styles.searchIcon}>📅</span>
                    <span>{ev}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.miniGrid}>
              {miniCards.map((card, i) => (
                <div key={i} className={styles.miniCard}>
                  <img src={card.img} alt={card.label} className={styles.miniCardBg} />
                  <div className={styles.miniCardIcon}>{card.emoji}</div>
                  <h3 className={styles.miniCardLabel}>{card.label}</h3>
                </div>
              ))}
              <div className={`${styles.miniCard} ${styles.miniCardAccent}`}>
                <div className={styles.miniCardIcon}>✦</div>
                <h3 className={styles.miniCardLabel}>Criar evento</h3>
                <p className={styles.miniCardSub}>Comece agora</p>
              </div>
            </div>

            <div className={styles.featuredCard}>
              <img
                src= {como}
                alt="Destaque"
                className={styles.featuredImg}
              />
              <div className={styles.featuredOverlay} />
              <div className={styles.featuredContent}>
                <div className={styles.featuredPlay}>▶</div>
                <h3 className={styles.featuredTitle}>Como funciona o EventFlow</h3>
                <p className={styles.featuredDesc}>Crie sua conta, monte seu evento e gerencie tudo em um só lugar.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;