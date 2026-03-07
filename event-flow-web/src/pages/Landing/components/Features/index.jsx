import styles from './Features.module.css';
import funcio1 from '../../../../assets/images/landing/funcio1.jpg';
import funcio2 from '../../../../assets/images/landing/funcio2.jpg';
import funcio3 from '../../../../assets/images/landing/funcio3.jpg';
import funcio4 from '../../../../assets/images/landing/funcio4.jpg';

const features = [
  {
    emoji: '📅',
    title: 'Crie eventos em minutos',
    desc: 'Monte seu evento com nome, data, localização e capacidade. Publique e comece a receber inscrições imediatamente.',
    tag: 'Organizador',
    color: 'amber',
    img: funcio1,
  },
  {
    emoji: '🎟️',
    title: 'Inscrições sem complicação',
    desc: 'Participantes se inscrevem com um clique. O sistema valida automaticamente vagas disponíveis e conflitos de horário.',
    tag: 'Participante',
    color: 'teal',
    img: funcio2,
  },
  {
    emoji: '🔒',
    title: 'Autenticação segura',
    desc: 'Login via Bearer Token com separação clara entre perfis de Participante e Organizador. Seus dados protegidos.',
    tag: 'Segurança',
    color: 'teal',
    img: funcio3,
  },
  {
    emoji: '📊',
    title: 'Controle total de vagas',
    desc: 'Defina a capacidade máxima do evento. O sistema bloqueia novas inscrições automaticamente quando o limite é atingido.',
    tag: 'Organizador',
    color: 'amber',
    img: funcio4,
  },
];

function Features() {
  return (
    <section className={styles.section} id="funcionalidades">
      <div className={styles.container}>

        <div className={styles.header}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            Funcionalidades
          </span>
          <h2 className={styles.title}>
            Tudo que você precisa<br />
            em <span className={styles.accent}>um só lugar</span>
          </h2>
          <p className={styles.sub}>
            Uma plataforma pensada para quem organiza e para quem participa.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((f, i) => (
            <div key={i} className={`${styles.card} ${styles[`card${f.color}`]}`}>
              <img src={f.img} alt={f.title} className={styles.cardBg} />
              <div className={styles.cardOverlay} />
              <div className={styles.cardTop}>
                <span className={styles.cardEmoji}>{f.emoji}</span>
                <span className={`${styles.cardTag} ${styles[`tag${f.color}`]}`}>
                  {f.tag}
                </span>
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
              <div className={styles.cardGlow} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;