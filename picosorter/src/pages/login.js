// pages/login.js
import Head from 'next/head';
import styles from '../css/page.module.css';

export default function Login() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Login - picosorter</title>
            </Head>
            <main className={styles.main}>
                <h1 className={styles.heading1}>Login to picosorter</h1>
                <form className={styles.form}>
                    <div className={styles.formGroup}>
                        <input type="text" id="username" name="username" placeholder='Username' required className={styles.input}/>
                    </div>
                    <div className={styles.formGroup}>
                        <input type="password" id="password" name="password" placeholder='Password' required className={styles.input}/>
                    </div>
                    <button type="submit" className={styles.button}>Login</button>
                </form>
            </main>
        </div>
    );
}
