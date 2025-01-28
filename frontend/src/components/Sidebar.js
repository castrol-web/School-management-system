import React, { forwardRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; //using React Router for navigation
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import { URL } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Sidebar = forwardRef(({ isOpen, toggleSidebar, data, role }, ref) => {
    const navigate = useNavigate();

    //handling logout functionality
    async function handleLogout() {
        const token = localStorage.getItem('token');
        // Check if the token is missing or invalid
        if (!token || typeof token !== 'string') {
            toast.error("Invalid or missing token. Please log in again.");
            localStorage.removeItem('token'); // Clear any invalid token
            navigate('/login'); // Redirect to login
            return;
        }
        try {
            const response = await axios.post(`${URL}/api/users/logout`, {}, {
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json',
                }
            })
            if (response.status === 200) {
                localStorage.removeItem('token') //clear token
                toast.success("Logout successful!");
                navigate('/login')
            } else {
                const data = await response.data;
                toast.error(data.message || "Failed to logout")
                console.error('Failed to logout')
            }

        } catch (error) {
            // Handle specific token errors
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else if (error.message.includes("Invalid token")) {
                toast.error("Invalid token. Please log in again.");
                localStorage.removeItem('token'); // Clear invalid token
                navigate('/login');
            } else {
                toast.error("An error occurred during logout. Please try again.");
            }
            console.error('Error logging out:', error);
        }

    }

    return (
        <div
            ref={ref}
            className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white p-5 flex flex-col transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform lg:translate-x-0 duration-200 ease-in-out`}
        >
            {/* Close Button on Mobile */}
            <button
                className="lg:hidden mb-4 text-gray-300 hover:text-white"
                onClick={toggleSidebar}
            >
                <IoMdClose className='text-center justify-center mx-auto font-extrabold' />
            </button>

            {/* Sidebar Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold">EDU MANAGE</h2>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-4">
                {data.map((item, index) => {
                    return <NavLink
                        key={index}
                        to={`/${role}/${item.name}`}
                        className={({ isActive }) =>
                            `flex items-center p-2 rounded-md hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''
                            }`
                        }
                        onClick={toggleSidebar}
                    >
                        <i>{item.icon}</i>
                        <span>{item.name}</span>
                    </NavLink>
                })}
            </nav>
            <div className='mt-8'>
                <button className='btn btn-outline btn-info btn-sm px-5' onClick={handleLogout}>Logout</button>
            </div>
            <div className='absolute justify-center bottom-0 items-center mx-auto text-center right-0.5'>
                <hr className='bg-gray-700 w-72'></hr>
                <p className='items-center mx-auto justify-center text-xs text-center text-gray-600'>By RichKid Solutions</p>
            </div>
            <ToastContainer />
        </div>
    );
});

export default Sidebar;
