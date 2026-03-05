import { useState } from 'react';
import styles from './Hero.module.css';

const slides = [
  {
    title: 'Summit de Inovação 2025',
    description: 'O maior encontro de tecnologia e inovação do Brasil. Palestras, workshops e networking com os maiores nomes do setor.',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80',
  },
  {
    title: 'Festival de Design & UX',
    description: 'Três dias imersivos em design thinking, pesquisa de usuário e tendências de interface para os próximos anos.',
    img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900&q=80',
  },
  {
    title: 'Hackathon Dev Connect',
    description: 'Quarenta e oito horas para construir soluções reais. Forme seu time e mostre do que é capaz.',
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80',
  },
];

const gridEvents = [
  { img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80' },
  { img: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&q=80' },
  { img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80' },
  { img: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&q=80' },
  ];

const destaques = [
  'Hackathon Dev Connect',
  'Conferência de Inteligência Artificial',
];

const miniCards = [
  { label: 'Presenciais', emoji: '📍', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80' },
  { label: 'Online', emoji: '💻', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80' },
];

function Hero() {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

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
            {/* seta esquerda */}
            <button className={styles.arrow} onClick={prev}>‹</button>

            {/* texto */}
            <div className={styles.bannerText}>
              <h1 className={styles.bannerTitle}>{slide.title}</h1>
              <p className={styles.bannerDesc}>{slide.description}</p>
              <a href="/register" className={styles.bannerBtn}>
                Inscrever-se →
              </a>
              {/* dots */}
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

            {/* imagem */}
            <div className={styles.bannerImgWrap}>
              <div className={styles.bannerImgGlow} />
              <img
                key={current}
                src={slide.img}
                alt={slide.title}
                className={styles.bannerImg}
              />
            </div>

            {/* seta direita */}
            <button className={styles.arrow} onClick={next}>›</button>
          </div>
        </div>

        {/* ── GRADE INFERIOR ── */}
        <div className={styles.grid}>

          {/* coluna esquerda: grid de fotos */}
          <div className={styles.artworkCard}>
            <div className={styles.artworkHeader}>
              <h2 className={styles.artworkTitle}>Eventos em Destaque</h2>
              <span className={styles.artworkArrow}>›</span>
            </div>

            <div className={styles.artworkGrid}>
              {gridEvents.map((ev, i) => (
                <div key={i} className={styles.artworkItem}>
                  <img src={ev.img} alt={`Evento ${i + 1}`} className={styles.artworkImg} />
                </div>
              ))}
            </div>

            <button className={styles.viewMore}>Ver todos os eventos</button>
          </div>

          {/* coluna direita */}
          <div className={styles.rightCol}>

            {/* lista de destaques */}
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

            {/* mini cards */}
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

            {/* card featured */}
            <div className={styles.featuredCard}>
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"
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