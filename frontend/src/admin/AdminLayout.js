import React, { useEffect, useState, useRef } from 'react';
import { Outlet} from 'react-router-dom'; // For rendering nested routes
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MdDashboard } from "react-icons/md";
import { jwtDecode } from 'jwt-decode';
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaUsers, } from 'react-icons/fa';


const AdminLayout = () => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token)
    const role = decoded.role;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    //sidebar data 
    const data = [{ name: "dashboard", icon: <MdDashboard className="mr-3" /> },
    { name: 'students', icon: <FaUserGraduate className="mr-3" /> },
    { name: 'teachers', icon: <FaChalkboardTeacher className="mr-3" /> },
    { name: 'parents', icon: <FaChalkboardTeacher className="mr-3" /> },
    { name: 'subjects', icon: <FaBook className="mr-3" /> },
    { name: 'classes', icon: <FaUsers className="mr-3" /> },
    { name: 'invoices', icon: <FaUsers className="mr-3" /> },
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
        </div>
    );
};

export default AdminLayout;
