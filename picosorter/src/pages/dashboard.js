import Head from 'next/head';
import styles from '../css/page.module.css';
import { useState, useEffect } from 'react';
import MyBarcode from '../components/barcode';
import QRCodeComponent from '../scanserver/qrcode';
import io from 'socket.io-client';
import Collapsible from 'react-collapsible';
import { MdOutlineSearch } from "react-icons/md";
import verifyUser from '../utils/utils';

export default function Dashboard({ ipAddress }) {
    const [barcodeValue, setBarcodeValue] = useState('00000000');
    const [serverUrl, setServerUrl] = useState('');
    const [isClient, setIsClient] = useState(false);
    const [searchterm, setSearchterm] = useState('');
    const [user, setUser] = useState('');

    const handleGenerateClick = () => {
        setBarcodeValue(Math.floor(Math.random() * 100000000).toString());
    };

    const handlePrintClick = () => {
        // Print logic here
    };

    // handles log out
    const handleLogoutClick = () => {
        localStorage.removeItem('user');
        console.log('User logged out');
        window.location.href = '/login';
    };

    useEffect(() => {
        setIsClient(true); // We are on the client now

        // set the username of the user
        var userResult = JSON.parse(verifyUser());
        setUser(userResult.username);

        // Set up server URL
        if (ipAddress) {
            console.log(ipAddress);
            setServerUrl(`ws://${ipAddress}:3000`);
        }

        // Set up internal server connection
        const socket = io(serverUrl);

        // Socket listeners
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
                <div style={{ display: 'inline-flex', flexDirection: 'row' }}>
                    <p style={{ marginRight: '10px' }} >Welcome, {user}</p>
                    <button className={styles.button} onClick={handleLogoutClick}>Log out</button>
                </div>
                <h1 className={styles.heading1}>Dashboard</h1>
                <div className={styles.dashboard}>
                    <div className={styles.left}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h3 className={styles.heading3}>Input management</h3>
                            {isClient && (
                                <Collapsible trigger="Connect to server" style={{ marginBottom: 10, color: 'blue' }}>
                                    <QRCodeComponent serverUrl={serverUrl} />
                                </Collapsible>
                            )}
                            <form>
                                <div className={styles.formGroup}>
                                    <input
                                        type="text"
                                        id="barcode"
                                        name="barcode"
                                        value={barcodeValue}
                                        onChange={e => setBarcodeValue(e.target.value)}
                                        placeholder='Barcode number'
                                        required
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <input
                                        type="file"
                                        id="photo"
                                        name="photo"
                                        accept="image/*"
                                        required
                                        className={styles.input}
                                    />
                                </div>
                                <button type="submit" className={styles.button}>Submit</button>
                            </form>
                            <h3 className={styles.heading3}>Barcode tools</h3>
                            <div style={{ alignContent: 'center' }}>
                                <MyBarcode value={barcodeValue} />
                            </div>
                            <b>Barcode info: {barcodeValue}</b>
                            <button
                                className={styles.button}
                                style={{ marginBottom: '5px' }}
                                onClick={handleGenerateClick}
                            >
                                Generate new one
                            </button>
                            <button className={styles.button} onClick={handlePrintClick}>
                                Print
                            </button>
                        </div>
                    </div>
                    <div className={styles.vertical_hr}></div>
                    <div className={styles.right}>
                        <h3 className={styles.heading3}>Search</h3>
                        <form>
                            <div style={{ display: 'block' }} className={styles.formGroup}>
                                <label style={{ textAlign: 'center' }} htmlFor="searchterm">Look for any item using barcode number or product info</label>
                                <div style={{ display: 'inline-flex' }}>
                                    <input
                                        style={{ marginRight: '10px' }}
                                        type="text"
                                        id="searchterm"
                                        name="searchterm"
                                        value={searchterm}
                                        onChange={e => setSearchterm(e.target.value)}
                                        placeholder='Search...'
                                        required
                                        className={styles.input}
                                    />
                                    <button type="submit" className={styles.button}><MdOutlineSearch /></button>
                                </div>
                            </div>
                        </form>

                        <h3 className={styles.heading3}>Output management</h3>
                        <div style={{ background: 'aqua' }}>Output management placeholder</div>
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
