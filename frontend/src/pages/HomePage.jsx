import React from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaSchool } from "react-icons/fa";
import { FiBook } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    //navigating to login page
    const navigate = useNavigate();
    function login() {
        navigate('/login');
    }
    return (
        <div className="bg-gray-100">
            {/* Hero Section */}
            <section className="hero min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                <div className="hero-content flex flex-col lg:flex-row-reverse items-center justify-between">
                    <img
                        src="https://via.placeholder.com/400"
                        alt="School Management"
                        className="max-w-sm rounded-lg shadow-2xl animate-fadeIn"
                    />
                    <div>
                        <h1 className="text-5xl font-bold animate-fadeIn">Welcome to EduManage</h1>
                        <p className="py-6 text-lg animate-slideUp">
                            Streamline your school operations with our all-in-one management system designed for
                            educators, students, and administrators.
                        </p>
                        <button className="btn btn-primary animate-bounce" onClick={() => login()}>Get Started</button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-6 lg:px-24 bg-white">
                <h2 className="text-4xl font-bold text-center text-blue-600 mb-10">Why Choose Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="card bg-blue-50 shadow-md p-6 text-center animate-slideUp">
                        <FaSchool className="text-4xl text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Efficient Management</h3>
                        <p>Manage your school’s activities, staff, and students effortlessly.</p>
                    </div>
                    <div className="card bg-blue-50 shadow-md p-6 text-center animate-slideUp">
                        <FaChalkboardTeacher className="text-4xl text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">For Teachers</h3>
                        <p>Track attendance, assign homework, and manage student grades easily.</p>
                    </div>
                    <div className="card bg-blue-50 shadow-md p-6 text-center animate-slideUp">
                        <FaUserGraduate className="text-4xl text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">For Students</h3>
                        <p>Access assignments, grades, and schedules anytime, anywhere.</p>
                    </div>
                    <div className="card bg-blue-50 shadow-md p-6 text-center animate-slideUp">
                        <FiBook className="text-4xl text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Resource Library</h3>
                        <p>Get access to a centralized repository of learning materials.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 px-6 lg:px-24 bg-gray-100">
                <h2 className="text-4xl font-bold text-center text-blue-600 mb-10">What Our Users Say</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="card bg-white shadow-lg p-6 animate-fadeIn">
                        <p className="text-gray-700 italic">
                            "This system has made our school operations seamless and efficient. Highly
                            recommend!"
                        </p>
                        <h3 className="text-blue-600 font-bold mt-4">- Principal Smith</h3>
                    </div>
                    <div className="card bg-white shadow-lg p-6 animate-fadeIn">
                        <p className="text-gray-700 italic">
                            "Managing my classes and assignments has never been easier. Great tool!"
                        </p>
                        <h3 className="text-blue-600 font-bold mt-4">- Ms. Johnson</h3>
                    </div>
                    <div className="card bg-white shadow-lg p-6 animate-fadeIn">
                        <p className="text-gray-700 italic">
                            "As a student, I love having all my resources and schedules in one place."
                        </p>
                        <h3 className="text-blue-600 font-bold mt-4">- John Doe</h3>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-blue-700 text-white py-8 px-6 lg:px-24">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold">EduManage</h3>
                        <p>Your trusted school management system.</p>
                    </div>
                    <div className="space-x-4 mt-4 md:mt-0">
                        <a href="/" className="link link-hover text-white">
                            About
                        </a>
                        <a href="/" className="link link-hover text-white">
                            Contact
                        </a>
                        <a href="/" className="link link-hover text-white">
                            Privacy Policy
                        </a>
                    </div>
                </div>
                <p className="text-center mt-4">&copy; 2025 EduManage. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;
