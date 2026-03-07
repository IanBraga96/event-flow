import styles from './CTA.module.css';
import call from '../../../../assets/images/landing/CTA.jpg';

function CTA() {
  return (
    <section className={styles.section}>
      {/* glows atrás da caixa */}
      <div className={styles.glowTeal} />
      <div className={styles.glowAmber} />

      <div className={styles.card}>

        {/* ── ESQUERDA: texto ── */}
        <div className={styles.left}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            Comece agora
          </span>

          <h2 className={styles.title}>
            Pronto para<br />
            fazer parte<br />
            de algo <span className={styles.accent}>maior?</span>
          </h2>

          <p className={styles.sub}>
            Crie sua conta gratuitamente e comece a organizar
            ou participar de eventos em minutos.
          </p>

          <div className={styles.actions}>
            <a href="/register" className={styles.btnPrimary}>
              Criar conta grátis →
            </a>
            <a href="#eventos" className={styles.btnGhost}>
              Explorar eventos
            </a>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>+120</span>
              <span className={styles.statLabel}>Eventos criados</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>+3k</span>
              <span className={styles.statLabel}>Participantes</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>100%</span>
              <span className={styles.statLabel}>Gratuito</span>
            </div>
          </div>
        </div>

        {/* ── DIREITA: imagem ── */}
        <div className={styles.right}>
          <img
            src={call}
            alt="Evento"
            className={styles.img}
          />
          <div className={styles.imgOverlay} />

          {/* card flutuante inferior */}
          <div className={styles.floatCard}>
            <span className={styles.floatDot} />
            <div>
              <p className={styles.floatTitle}>Summit de Inovação</p>
              <p className={styles.floatSub}>320 participantes inscritos</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default CTA;