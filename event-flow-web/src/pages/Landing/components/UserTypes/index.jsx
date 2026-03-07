import styles from './UserTypes.module.css';
import participante from '../../../../assets/images/landing/participante.jpg';
import organizador from '../../../../assets/images/landing/organizador.jpg';


const types = [
  {
    type: 'Participante',
    tag: 'Para quem quer participar',
    emoji: '🎟️',
    img: participante,
    color: '#14b8a6',
    features: [
      { icon: '🔍', text: 'Inscrever-se em eventos' },
      { icon: '📅', text: 'Ver agenda personalizada' },
      { icon: '🏅', text: 'Emitir certificados' },
    ],
    cta: 'Quero participar',
    href: '/register',
  },
  {
    type: 'Organizador',
    tag: 'Para quem quer criar',
    emoji: '🎯',
    img: organizador,
    color: '#f59e0b',
    features: [
      { icon: '✦', text: 'Criar e publicar eventos' },
      { icon: '👥', text: 'Controle de capacidade' },
      { icon: '📋', text: 'Gerenciar inscrições' },
    ],
    cta: 'Quero organizar',
    href: '/register',
  },
];

function UserTypes() {
  return (
    <section className={styles.section} id="sobre">
      <div className={styles.container}>

        <div className={styles.header}>
          <span className={styles.label}>✦ Para quem é o EventFlow?</span>
          <h2 className={styles.title}>
            Escolha seu <span className={styles.titleAccent}>perfil</span>
          </h2>
          <p className={styles.subtitle}>
            Uma plataforma feita para conectar quem organiza e quem participa.
          </p>
        </div>

        <div className={styles.cards}>
          {types.map((t, i) => (
            <div key={i} className={styles.card}>

              {/* imagem ocupa metade de cima */}
              <div className={styles.cardImgWrap}>
                <img src={t.img} alt={t.type} className={styles.cardImg} />
                <div className={styles.cardImgOverlay} />
                <span className={styles.cardTag}>{t.tag}</span>
              </div>

              {/* painel de infos embaixo */}
              <div className={styles.cardBody}>
                <div className={styles.cardHead}>
                  <span className={styles.cardEmoji}>{t.emoji}</span>
                  <h3 className={styles.cardType}>{t.type}</h3>
                  <div className={styles.cardDivider} style={{ background: t.color }} />
                </div>

                <ul className={styles.featureList}>
                  {t.features.map((f, j) => (
                    <li key={j} className={styles.featureItem}>
                      <span className={styles.featureIcon} style={{ color: t.color }}>{f.icon}</span>
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={t.href}
                  className={styles.cardBtn}
                  style={{ '--btn-color': t.color }}
                >
                  {t.cta} →
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default UserTypes;