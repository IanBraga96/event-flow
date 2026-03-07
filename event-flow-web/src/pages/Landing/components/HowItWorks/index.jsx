import styles from './HowItWorks.module.css';

const steps = [
  {
    number: '01',
    tag: 'Cadastro',
    title: 'Crie sua conta',
    desc: 'Cadastre-se como Participante ou Organizador. O processo é rápido e seus dados ficam protegidos com autenticação via Bearer Token.',
    color: 'teal',
  },
  {
    number: '02',
    tag: 'Descoberta',
    title: 'Explore ou crie eventos',
    desc: 'Participantes encontram eventos por data e localização. Organizadores montam seus eventos em minutos com todas as informações.',
    color: 'amber',
  },
  {
    number: '03',
    tag: 'Participação',
    title: 'Inscreva-se e aproveite',
    desc: 'Com um clique você garante sua vaga. O sistema cuida dos conflitos de horário e do controle de capacidade automaticamente.',
    color: 'teal',
  },
];

function HowItWorks() {
  return (
    <section className={styles.section} id="como-funciona">
      <div className={styles.container}>

        {/* ── HEADER ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              Process
            </span>
            <h2 className={styles.title}>COMO FUNCIONA</h2>
          </div>
          <p className={styles.headerRight}>
            Do cadastro à participação —<br />cada etapa com propósito.
          </p>
        </div>

        {/* ── LINHA DE DOTS ── */}
        <div className={styles.dotsRow}>
          <div className={styles.dotsLine} />
          {steps.map((s, i) => (
            <div key={i} className={styles.dotWrap}>
              <div className={`${styles.dot} ${styles[`dot${s.color}`]}`} />
              <span className={styles.dotLabel}>{s.number}</span>
            </div>
          ))}
        </div>

        {/* ── CARDS ── */}
        <div className={styles.grid}>
          {steps.map((s, i) => (
            <div key={i} className={`${styles.card} ${styles[`card${s.color}`]}`}>
              {/* número decorativo gigante atrás */}
              <span className={styles.cardNumBg}>{s.number}</span>

              <div className={styles.cardTop}>
                <span className={`${styles.cardNumber} ${styles[`num${s.color}`]}`}>
                  {s.number}
                </span>
                <span className={`${styles.cardTag} ${styles[`tag${s.color}`]}`}>
                  {s.tag}
                </span>
              </div>

              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardDesc}>{s.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;