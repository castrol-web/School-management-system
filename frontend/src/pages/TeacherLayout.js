import React, { useState, useEffect, useRef, } from 'react';
import Navbar from '../components/Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { MdDashboard } from "react-icons/md";
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserGraduate, FaBook } from 'react-icons/fa';

function TeacherLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [role, setRole] = useState();
    const navigate = useNavigate();

    //opening/closing sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const SidebarRef = useRef();
    //handles clicking outside of the sidebar
    useEffect(() => {
        function handleClickOutside(event) {
            if (SidebarRef.current && !SidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])
    useEffect(() => {
        //checking user role for the route 
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Token is not available or invalid')
            navigate('/teacher/login')
        }
        try {
            const decoded = jwtDecode(token);
            setRole(decoded.role);
        } catch (error) {
            console.error('error decoding token:', error)
            navigate('/teacher/login')
        }
    }, [navigate])



    //sidebar data 
    const data = [{ name: "dashboard", icon: <MdDashboard className="mr-3" /> },
    { name: 'assignments', icon: <FaBook className="mr-3" /> },
    { name: 'marks', icon: <FaUserGraduate className="mr-3" /> },
    { name: 'analysis', icon: <FaBook className="mr-3" /> },
    { name: 'entries', icon: <FaBook className="mr-3" /> },
    { name: 'activities', icon: <FaBook className="mr-3" /> }
    ]
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar - Hidden on small screens, toggled via Navbar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} ref={SidebarRef} data={data} role={role} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                <Navbar toggleSidebar={toggleSidebar} role={role} />

                {/* Main Content */}
                <main className="flex-1 p-4 overflow-y-auto">
                    <Outlet /> {/* Renders the nested routes (pages) here */}
                </main>
                <Footer />
            </div>
            <ToastContainer />
        </div>
    )
}

export default TeacherLayout