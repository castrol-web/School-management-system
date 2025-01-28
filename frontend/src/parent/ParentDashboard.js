import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useSingleParentStore from '../zustand/useSingleParentStore';
import { PaystackButton } from 'react-paystack';
import { URL, PAYSTACK } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ParentDashboard() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { parent, fetchParent } = useSingleParentStore();
    const [balance, setBalance] = useState(0);
    const [activity, setActivity] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const decoded = token ? jwtDecode(token) : null;
    const id = decoded ? decoded._id : null;

    const fetchBalance = useCallback(async () => {
        if (!id) return;
        try {
            const response = await axios.get(`${URL}/api/parent/balance/${id}`, {
                headers: { 'x-access-token': token }
            });
            if (response.status === 201) {
                setBalance(response.data.balance);
            }
        } catch (error) {
            toast.error('Failed to fetch balance!');
        }
    }, [id, token]);

    const fetchActivity = useCallback(async () => {
        if (!id) return;
        try {
            const response = await axios.get(`${URL}/api/parent/activities/${id}`, {
                headers: { 'x-access-token': token }
            });
            if (response.status === 201) {
                setActivity(response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching activity');
        }
    }, [id, token]);

    useEffect(() => {
        if (token && id) {
            fetchParent(token, id);
            fetchActivity();
            fetchBalance();
        }
    }, [token, id, fetchParent, fetchBalance, fetchActivity]);

    const paystackConfig = {
        email: parent?.commonDetails?.email || '',
        amount: balance * 100,
        text:"Pay Now",
        currency: "KES",
        publicKey: PAYSTACK,
        onSuccess: async (response) => {
            const reference = response?.reference || '';
            if (reference) {
                try {
                    await axios.post(`${URL}/api/parent/paystack/verify`, { reference }, {
                        headers: { 'x-access-token': token }
                    });
                    toast.success('Payment successful!');
                    fetchBalance();
                } catch (error) {
                    toast.error('Payment verification failed!');
                }
            }
        },
        onClose: () => {
            toast.warning('Payment was closed without completion.');
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl space-y-6">
                <h1 className="text-4xl font-bold text-center text-blue-600">Welcome, {parent?.commonDetails?.firstName}</h1>
                <p className="text-center text-gray-500">Edu Manage values you!</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-blue-50 p-8 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-semibold text-blue-800">Fees Balance</h2>
                        <p className="text-3xl font-bold text-gray-800">Ksh {balance}</p>
                    </div>
                    <div className="bg-green-50 p-8 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-semibold text-green-800">Session Progress</h2>
                        <progress className="progress progress-success w-full" value="50" max="100"></progress>
                        <p className="text-gray-700 text-center mt-2">50% Completed</p>
                    </div>
                </div>

                <div className="flex justify-center">
                    <PaystackButton {...paystackConfig} className="btn btn-primary btn-lg text-white rounded-full" />
                </div>
            </div>

            <div className="mt-8 w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Your Child's Activities</h2>
                <div className="mt-4">
                    {activity.length > 0 ? (
                        activity.map((act) => (
                            <p key={act._id} className="justify-center text-center items-center text-lg text-gray-700 border-b py-2">{act.name}</p>
                        ))
                    ) : (
                        <div className="text-center text-gray-600">
                            <p>No activity found</p>
                            <Link to='/parent/activities' className="text-blue-500 underline">Enroll Now</Link>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ParentDashboard;
