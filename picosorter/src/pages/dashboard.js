// pages/login.js
import Head from 'next/head';
import styles from '../css/page.module.css';
import { useRouter } from 'next/router';
import { useState } from 'react';
import MyBarcode from '../components/barcode';

export default function Dashboard() {

    const [barcodeValue, setBarcodeValue] = useState('00000000');
    const router = useRouter();

    const handleGenerateClick = () => {
        setBarcodeValue(Math.floor(Math.random() * 100000000).toString()); // set random barcode value
    };

    const handlePrintClick = () => {
        // Empty method for printing
        console.log('Print button clicked');
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Dashboard - picosorter</title>
            </Head>
            <main className={styles.main}>
                <h1 className={styles.heading1}>Welcome to dashboard</h1>
                <div className={styles.dashboard}>
                    <div className={styles.left}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h3 className={styles.heading3}>Input management</h3>
                            <div style={{ background: 'green' }}>Scanner window placeholder</div>
                            <form>
                                <div className={styles.formGroup}>
                                    <input type="text" id="barcode" name="barcode" placeholder='Barcode number' required className={styles.input} />
                                </div>
                                <div className={styles.formGroup}>
                                    <input type="file" id="photo" name="photo" accept="image/*" required className={styles.input} />
                                </div>
                                <button type="submit" className={styles.button}>Submit</button>
                            </form>
                            <h3 className={styles.heading3}>Barcode tools</h3>
                            <div style={{alignContent: 'center'}}><MyBarcode value={barcodeValue}/></div>
                            <b>Barcode info: {barcodeValue}</b>
                            <button className={styles.button} style={{ marginBottom: '5px' }} onClick={handleGenerateClick}>
                                Generate new one
                            </button>
                            <button className={styles.button} onClick={handlePrintClick}>Print</button>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <h3 className={styles.heading3}>Output management</h3>
                    </div>
                </div>
                <div className={styles.bottom}>
                    Welcome to picosorter.
                </div>
            </main>
        </div>
    );
}
