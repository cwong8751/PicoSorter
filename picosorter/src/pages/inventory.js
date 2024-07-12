import { useEffect, useState } from 'react';
import styles from '../css/page.module.css';
import Head from 'next/head';
import verifyUser from '../utils/utils';

export default function Inventory() {
    const [user, setUser] = useState('');
    const [inventory, setInventory] = useState([]);

    useEffect(() => {

        // set the username of the user
        var userResult = JSON.parse(verifyUser());
        setUser(userResult.username);

        // fetch inventory data
        fetchData();
    }, []);

    // handles log out
    const handleLogoutClick = () => {
        localStorage.removeItem('user');
        console.log('User logged out');
        window.location.href = '/login';
    };

    // function to fetch all inventory items
    async function fetchData() {
        // fetch request
        const response = await fetch('http://localhost:3030/api/inventory', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log(data);

        // verify data
        if (response.status !== 200) {
            alert('Error fetching inventory data');
            return;
        }


        // set inventory data 
        if (Array.isArray(data)) {
            setInventory(data);
        } else if (data.inventory && Array.isArray(data.inventory)) {
            setInventory(data.inventory);
        } else {
            console.error('Data is not an array:', data);
            alert('Error: Inventory data is not in the expected format.');
        }
    }

    function handleDelete(id) {
        // do something
    }

    // convert image to displayable format 
    const blobToUrl = (blob) => {
        const arrayBufferView = new Uint8Array(blob.data);
        const blobObject = new Blob([arrayBufferView], { type: 'image/png' });
        return URL.createObjectURL(blobObject);
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Inventory management - picosorter</title>
            </Head>
            <main className={styles.main}>
                <div style={{ display: 'inline-flex', flexDirection: 'row' }}>
                    <p style={{ marginRight: '10px' }}>Welcome, {user}</p>
                    <button className={styles.button} onClick={handleLogoutClick}>Log out</button>
                </div>
                <h1 className={styles.heading1}>Inventory management</h1>
                <div className={styles.inventory}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Color</th>
                                <th>Price</th>
                                <th>Sale</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.color}</td>
                                    <td>{item.price}</td>
                                    <td>{item.sale ? 'Yes' : 'No'}</td>
                                    <td>{item.description}</td>
                                    <td><input
                                        type="number"
                                        value={item.quantity}
                                        min="0"
                                        className={styles.input}
                                    /></td>
                                    <td><img src={blobToUrl(item.image)} alt={item.name} width="100" /></td>
                                    <td><button className={styles.buttonDelete} onClick={handleDelete(item.id)}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles.bottom}>
                    Welcome to picosorter.
                </div>
            </main>
        </div>
    );
}
