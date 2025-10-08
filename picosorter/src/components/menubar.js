// components/MenuBar.js
import React from 'react';

const MenuBar = ({ pageTitle, user, handleLogoutClick }) => {
    return (
        <div className="bg-gray-200 text-black px-6 py-3 shadow flex items-center">
            <ul className="flex items-center w-full">
                <div className="mr-8">
                    <li>
                        <h3 className="text-lg font-semibold">{pageTitle} - picosorter</h3>
                    </li>
                </div>
                <div className="flex items-center ml-auto">
                    <li className="mr-4">
                        <a href="/" className="text-white hover:underline">Hello</a>
                    </li>
                    <li className="mr-4">
                        <a href="/dashboard" className="text-white hover:underline">Dashboard</a>
                    </li>
                    <li className="mr-4">
                        <a href="/inventory" className="text-white hover:underline">Inventory</a>
                    </li>
                    <li className="mr-4">
                        <p className="mr-2">Welcome, {user}</p>
                    </li>
                    <li>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                            onClick={handleLogoutClick}
                        >
                            Log out
                        </button>
                    </li>
                </div>
            </ul>
        </div>
    );
};

export default MenuBar;
