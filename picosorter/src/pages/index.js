import Head from 'next/head';
import styles from '../css/page.module.css';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();

    const handleLoginClick = () => {
      router.push('/login');
    };

    return (
      <div className={styles.container}>
        <Head>
          <title>picosorter</title>
        </Head>
        <main className={styles.main}>
          <h1 className={styles.heading1}>Welcome to picosorter</h1>
          <h3 className={styles.heading3}>Picosorter is an input/output management system.</h3>
          <div style={{ display: 'inline-block' }}>
            <button className={styles.button} style={{ marginRight: '10px' }} onClick={handleLoginClick}>
              Login
            </button>
            <button className={styles.button} disabled>Pair with simplescanner</button>
          </div>
        </main>
      </div>
    );
}