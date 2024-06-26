// pages/login.js
import Head from 'next/head';
import styles from '../css/page.module.css';
import { useState, useEffect } from 'react';
import MyBarcode from '../components/barcode';
import QRCodeComponent from '../scanserver/qrcode';
import io from 'socket.io-client';

export default function Dashboard(ipAddress) {
    const [barcodeValue, setBarcodeValue] = useState('00000000');
    const [serverUrl, setServerUrl] = useState('');

    const handleGenerateClick = () => {
        setBarcodeValue(Math.floor(Math.random() * 100000000).toString());
    };

    const handlePrintClick = () => {
        // Print logic here
    };

    useEffect(() => {
        if (ipAddress) {
            console.log(ipAddress.ipAddress);
            setServerUrl(`ws://${ipAddress.ipAddress}:3000`);
        }


        // set up internal server connection 
        const socket = io(serverUrl);

        socket.on('connect', () => {        
            console.log('Internal connected to server'); 
        });

        socket.on('barcode', (barcode) => {
            console.log('Barcode value received:', barcode);
            setBarcodeValue(barcode);
        });

        return () => {
            socket.disconnect();
        };
    }, [ipAddress, serverUrl]);

    return (
        <div className={styles.container}>
            <Head>
                <title>Dashboard - picosorter</title>
            </Head>
            <main className={styles.main}>
                <h1 className={styles.heading1}>Welcome to the dashboard</h1>
                <div className={styles.dashboard}>
                    <div className={styles.left}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h3 className={styles.heading3}>Input management</h3>
                            <div style={{ marginBottom: 10 }}>
                                <b>Connect to scanner</b>
                                <QRCodeComponent serverUrl={serverUrl} />
                            </div>
                            <form>
                                <div className={styles.formGroup}>
                                    <input type="text" id="barcode" name="barcode" value={barcodeValue} onChange={e => setBarcodeValue(e.target.value)} placeholder='Barcode number' required className={styles.input} />
                                </div>
                                <div className={styles.formGroup}>
                                    <input type="file" id="photo" name="photo" accept="image/*" required className={styles.input} />
                                </div>
                                <button type="submit" className={styles.button}>Submit</button>
                            </form>
                            <h3 className={styles.heading3}>Barcode tools</h3>
                            <div style={{ alignContent: 'center' }}><MyBarcode value={barcodeValue} /></div>
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

// to get ip address of the server computer in the local network.
export async function getServerSideProps(context) {
    const { req } = context;
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    let ipAddress = '';

    Object.keys(networkInterfaces).forEach((key) => {
        networkInterfaces[key].forEach((iface) => {
            if (iface.family === 'IPv4' && !iface.internal) {
                ipAddress = iface.address;
            }
        });
    });

    return {
        props: {
            ipAddress: ipAddress || '',
        },
    };
}
