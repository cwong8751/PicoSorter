// pages/login.js
import Head from 'next/head';
import styles from '../css/page.module.css';
import { hashPassword } from '../utils/password.js';

export default function Login() {

    // handle login 
    const handleLogin = async (e) => {
        e.preventDefault();

        // get user and password 
        const username = e.target.username.value;
        const password = e.target.password.value;

        // hash and salt password
        //const hashedPassword = await hashPassword(password);

        // authenticate user
        const response = await fetch('http://localhost:3030/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }) // use plaintext password just for now 
        });
        
        const data =  await response.json();
        console.log(data);

        // do auth 
        if(response.status == 200){
            // save user information to localStorage
            localStorage.setItem('user', JSON.stringify(data.user));

            // redirect to dashboard 
            window.location.href = '/dashboard';
        }
        else if(response.status == 401){
            alert('Invalid username or password');
        }
        else{
            alert('Error logging in');
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Login - picosorter</title>
            </Head>
            <main className={styles.main}>
                <h1 className={styles.heading1}>Login to picosorter</h1>
                <form className={styles.form} onSubmit={handleLogin}>
                    <div className={styles.formGroup}>
                        <input type="text" id="username" name="username" placeholder='Username' required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <input type="password" id="password" name="password" placeholder='Password' required className={styles.input} />
                    </div>
                    <button type="submit" className={styles.button}>Login</button>
                </form>
            </main>
        </div>
    );
}
