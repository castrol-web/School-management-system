import React from 'react';
import { FaBell, FaMoon, FaSun, FaUserCircle } from 'react-icons/fa';
import { FaRegMessage } from "react-icons/fa6";
import { HiOutlineSearch } from 'react-icons/hi';
import { useState } from 'react';
import { Link} from 'react-router-dom';

const Navbar = ({ toggleSidebar, role }) => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between shadow-md">
            {/* Hamburger Menu for Mobile */}
            <button
                className="lg:hidden text-gray-600 dark:text-gray-300"
                onClick={toggleSidebar}
            >
                ☰
            </button>
            {/* Company Logo */}
            <div className="flex items-center">
                <span className="text-xl font-semibold dark:text-white">{role}</span>
            </div>

            {/* Search Bar */}
            <div className="relative text-gray-600 dark:text-gray-300 w-1/2">
                <input
                    type="text"
                    className="bg-gray-200 dark:bg-gray-800 h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full"
                    placeholder="Search..."
                />
                <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
                    <HiOutlineSearch className="text-gray-600 dark:text-gray-300" />
                </button>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
                <Link className="text-gray-600 dark:text-gray-300 hover:text-blue-500" to='messages'>
                    <FaRegMessage size={20} />
                </Link>
                <button className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
                    <FaBell size={20} />
                </button>
                <button
                    onClick={toggleTheme}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
                >
                    {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                </button>
                <button className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
                    <FaUserCircle size={24} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
