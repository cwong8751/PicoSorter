import Head from 'next/head';
import { useState, useEffect } from 'react';
import MyBarcode from '../components/barcode';
import QRCodeComponent from '../scanserver/qrcode';
import io from 'socket.io-client';
import Collapsible from 'react-collapsible';
import { MdOutlineSearch } from "react-icons/md";
import verifyUser from '../utils/utils';
import MenuBar from '../components/menubar';

export default function Dashboard({ ipAddress }) {
    const [barcodeValue, setBarcodeValue] = useState('00000000');
    const [serverUrl, setServerUrl] = useState('');
    const [isClient, setIsClient] = useState(false);
    const [searchterm, setSearchterm] = useState('');
    const [user, setUser] = useState('');
    const [title, setTitle] = useState('');

    const handleGenerateClick = () => {
        setBarcodeValue(Math.floor(Math.random() * 100000000).toString());
    };

    const handlePrintClick = () => {
        // Print logic here
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('user');
        console.log('User logged out');
        window.location.href = '/login';
    };

    useEffect(() => {
        setIsClient(true);

        setTitle(document.title);

        var userResult = JSON.parse(verifyUser());
        setUser(userResult.username);

        if (ipAddress) {
            console.log(ipAddress);
            setServerUrl(`ws://${ipAddress}:3000`);
        }

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
        <div className="min-h-screen bg-gray-100">
            <MenuBar pageTitle={title} user={user} handleLogoutClick={handleLogoutClick} />
            <Head>
                <title>Dashboard</title>
            </Head>
            <main className="p-6">
                <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg p-6">
                    <div className="flex-1 pr-6">
                        <div className="flex flex-col">
                            <h3 className="text-xl font-semibold mb-4">Input management</h3>
                            {isClient && (
                                <Collapsible trigger="Connect to server" style={{ marginBottom: 10, color: 'blue' }}>
                                    <QRCodeComponent serverUrl={serverUrl} />
                                </Collapsible>
                            )}
                            <form>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        id="barcode"
                                        name="barcode"
                                        value={barcodeValue}
                                        onChange={e => setBarcodeValue(e.target.value)}
                                        placeholder='Barcode number'
                                        required
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="file"
                                        id="photo"
                                        name="photo"
                                        accept="image/*"
                                        required
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit</button>
                            </form>
                            <h3 className="text-xl font-semibold mt-8 mb-4">Barcode tools</h3>
                            <div className="flex justify-center mb-2">
                                <MyBarcode value={barcodeValue} />
                            </div>
                            <b className="block mb-2">Barcode info: {barcodeValue}</b>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-2"
                                onClick={handleGenerateClick}
                            >
                                Generate new one
                            </button>
                            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={handlePrintClick}>
                                Print
                            </button>
                        </div>
                    </div>
                    <div className="w-px bg-gray-300 mx-6"></div>
                    <div className="flex-1 pl-6">
                        <h3 className="text-xl font-semibold mb-4">Search</h3>
                        <form>
                            <div className="mb-4">
                                <label className="block text-center mb-2" htmlFor="searchterm">
                                    Look for any item using barcode number or product info
                                </label>
                                <div className="flex">
                                    <input
                                        className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 mr-2"
                                        type="text"
                                        id="searchterm"
                                        name="searchterm"
                                        value={searchterm}
                                        onChange={e => setSearchterm(e.target.value)}
                                        placeholder='Search...'
                                        required
                                    />
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center">
                                        <MdOutlineSearch />
                                    </button>
                                </div>
                            </div>
                        </form>
                        <h3 className="text-xl font-semibold mt-8 mb-4">Output management</h3>
                        <div className="bg-cyan-200 p-4 rounded">Output management placeholder</div>
                    </div>
                </div>
                <div className="mt-8 text-center text-gray-600">
                    Welcome to picosorter.
                </div>
            </main>
        </div>
    );
}

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
