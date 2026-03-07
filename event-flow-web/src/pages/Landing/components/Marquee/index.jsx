import styles from './Marquee.module.css';

const items = [
  'Eventos',
  'Organização',
  'Inscrições',
  'Networking',
  'Eventos',
  'Organização',
  'Inscrições',
  'Networking',
  'Eventos',
  'Organização',
  'Inscrições',
  'Networking',
];

function Marquee() {
  return (
    <div className={styles.marqueeWrap}>
      <div className={styles.marqueeTrack}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className={styles.marqueeItem}>
            {item}
            <span className={styles.marqueeStar}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;