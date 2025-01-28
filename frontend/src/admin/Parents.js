import React, { useEffect, useRef, useState } from 'react';
import { URL } from '../App';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaTrashAlt, FaEye } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { css } from '@emotion/react';
import useParentStore from '../zustand/useParentStore';

function Parents() {
    const formRef = useRef();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [newParent, setNewParent] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        regNo: '',
        role: 'parent',
    });

    const { parents, Loading, fetchParents } = useParentStore();
    const token = localStorage.getItem('token');

    const handleParentChange = (e) =>
        setNewParent({ ...newParent, [e.target.name]: e.target.value });

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
        }
        fetchParents(token);
    }, [token, fetchParents, navigate]);

    const addParent = async (e) => {
        e.preventDefault();
        if (newParent.password !== newParent.confirmPassword) {
            setMessage('Passwords do not match!');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${URL}/api/admin/register-parent`, newParent, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
            });
            if (response.status === 201) {
                toast.success('Parent added successfully!');
                setNewParent({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                    regNo: '',
                    role: 'parent',
                });
                setShowForm(false);
                setMessage('');
                fetchParents(token);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    const deleteParent = async (parentId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this parent?');
        if (!confirmDelete) return;

        try {
            setLoading(true);
            const response = await axios.delete(`${URL}/api/admin/delete-parent/${parentId}`, {
                headers: { 'x-access-token': token },
            });
            if (response.status === 200) {
                toast.success('Parent deleted successfully!');
                fetchParents(token);
            }
        } catch (error) {
            toast.error('Failed to delete parent');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Parent Management</h2>

            {!showForm ? (
                <>
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-300"
                        >
                            + Add Parent
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="py-3 px-6 text-left">No.</th>
                                    <th className="py-3 px-6 text-left">First Name</th>
                                    <th className="py-3 px-6 text-left">Last Name</th>
                                    <th className="py-3 px-6 text-left">Email</th>
                                    <th className="py-3 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            {Loading ? (
                                <tbody>
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <FadeLoader color="#36d7b7" css={override} size={100} />
                                            <p>Loading...</p>
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {parents.length > 0 ? parents.map((parent, index) => (
                                        <tr
                                            key={index}
                                            className={`border-b border-gray-200 hover:bg-gray-100 transition duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                                }`}
                                        >
                                            <td className="py-3 px-6">{index + 1}</td>
                                            <td className="py-3 px-6">{parent.commonDetails.firstName}</td>
                                            <td className="py-3 px-6">{parent.commonDetails.lastName}</td>
                                            <td className="py-3 px-6">{parent.commonDetails.email}</td>
                                            <td className="py-3 px-6 flex justify-center space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700"
                                                    aria-label="View Parent"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => deleteParent(parent._id)}
                                                    aria-label="Delete Parent"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : <tr className='mx-auto items-center justify-center text-center'>
                                        <td className='text-center'></td>
                                        <td className='text-center'></td>
                                        <td className='text-center lg:py-9 py-5'>no parent added yet</td>
                                    </tr>}
                                </tbody>
                            )}
                        </table>
                    </div>
                </>
            ) : (
                <form
                    onSubmit={addParent}
                    ref={formRef}
                    className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto space-y-4"
                >
                    <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">New Parent</h2>

                    <inputField
                        name="firstName"
                        value={newParent.firstName} />
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={newParent.firstName}
                                onChange={handleParentChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={newParent.lastName}
                                onChange={handleParentChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={newParent.email}
                                onChange={handleParentChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={newParent.phone}
                                onChange={handleParentChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={newParent.password}
                                onChange={handleParentChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={newParent.confirmPassword}
                                onChange={handleParentChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Student Registration Number</label>
                            <input
                                required
                                type="text"
                                name="regNo"
                                value={newParent.regNo}
                                onChange={handleParentChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {message && (
                        <p className="text-red-500 text-sm text-center mt-2">{message}</p>
                    )}

                    <div className="flex justify-between mt-4">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600 transition duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
            <ToastContainer />
        </div>
    );
}

// CSS override for loading spinner
const override = css`
  display: block;
  margin: 0 auto;
`;

export default Parents;
