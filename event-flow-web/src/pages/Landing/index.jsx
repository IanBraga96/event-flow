import styles from './Landing.module.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

function Landing() {
  return (
    <div className={styles.page}>
      <Navbar />
      <Hero />
    </div>
  );
}

export default Landing;