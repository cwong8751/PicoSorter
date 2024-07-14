// components/MenuBar.js
import React from 'react';
import styles from '../css/page.module.css';

const MenuBar = ({pageTitle ,user, handleLogoutClick }) => {
    return (
        <div className={styles.menuBar}>
            <ul>
                <div className={styles.logo}><li><h3>{pageTitle} - picosorter</h3></li></div>
                <li><a href='/'>Hello</a></li>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/inventory">Inventory</a></li>
                <li><p style={{ marginRight: '10px' }}>Welcome, {user}</p></li>
                <li><button className={styles.button} onClick={handleLogoutClick}>Log out</button></li>
            </ul>
        </div>
    );
};

export default MenuBar;
