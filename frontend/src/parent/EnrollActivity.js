import { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../App';
import { toast } from 'react-toastify';
import useActivityStore from '../zustand/useActivityStore';
import { useNavigate } from 'react-router-dom';

const EnrollActivity = () => {
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    // Fetching activities from Zustand store
    const { activities, fetchActivities } = useActivityStore();

    useEffect(() => {
        if (token) {
            fetchActivities(token);
        }
    }, [fetchActivities, token]);

    const handleEnrollment = async () => {
        if (!id) {
            toast.warn('Please select an activity first!');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.put(
                `${URL}/api/parent/activity/${id}/enroll`,
                {},
                { headers: { 'x-access-token': token } }
            );

            if (response.status === 201) {
                toast.success('Successfully enrolled in the activity');
                setId(''); // Reset selection after successful enrollment
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to enroll');
            console.error('Enrollment error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-lg mt-20">
            <h2 className="text-2xl font-bold mb-4 text-center">Enroll in an Activity</h2>
            <select
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="select select-bordered w-full mb-4"
            >
                <option value="">Select an activity</option>
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <option key={activity._id} value={activity._id}>{activity.name}</option>
                    ))
                ) : (
                    <option disabled>Loading activities...</option>
                )}
            </select>
            <button
                onClick={handleEnrollment}
                disabled={loading}
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            >
                {loading ? 'Enrolling...' : 'Enroll Now'}
            </button>
        </div>
    );
};

export default EnrollActivity;
