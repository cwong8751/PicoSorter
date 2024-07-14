import Head from 'next/head';
import styles from '../css/page.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import verifyUser from '../utils/utils';

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleDashboardClick = () => {
    router.push('/dashboard');
  }

  useEffect(() => {

    // verify user
    var userResult = JSON.parse(verifyUser());
    
    // if user is already logged in, go to dashboard
    if(userResult.username){
      setIsLogin(true);
    }

  }, []);

    return (
      <div className={styles.container}>
        <Head>
          <title>picosorter</title>
        </Head>
        <main className={styles.main}>
          <h1 className={styles.heading1}>Welcome to picosorter</h1>
          <h3 className={styles.heading3}>Picosorter is an input/output management system.</h3>
          <div style={{ display: 'inline-flex' }}>
            {isLogin ? <button className={styles.button} onClick={handleDashboardClick}>Dashboard</button> : <button className={styles.button} onClick={handleLoginClick}>Log in</button>}
            <div style={{ width: 10 }}></div>
            <button className={styles.button} disabled>Pair with simplescanner</button>
          </div>
        </main>
      </div>
    );
  }