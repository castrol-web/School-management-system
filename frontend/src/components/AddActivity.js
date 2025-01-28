import { useState } from 'react';
import axios from 'axios';
import { URL } from '../App';
import { toast } from 'react-toastify';

const AddActivity = () => {
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', category: '', schedule: { day: '', time: '' } });

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const times = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${URL}/api/teacher/activities`,form, {
                headers: { 'x-access-token': token },
            });
            if (response.status === 201) {
                toast.success('Activity created successfully');
                setForm({ name: '', description: '', category: '', schedule: { day: '', time: '' } });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating activity');
            console.error('Error adding activity entry:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Add New Activity</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Activity Name"
                    name='name'
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input input-bordered w-full"
                />
                <textarea
                    placeholder="Description"
                    name='description'
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="textarea textarea-bordered w-full"
                ></textarea>
                <select
                    name='category'
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="select select-bordered w-full"
                >
                    <option value="">Select Category</option>
                    <option value="Sports">Sports</option>
                    <option value="Music">Music</option>
                    <option value="Arts">Arts</option>
                    <option value="Academics">Academics</option>
                </select>
                <div className="flex gap-4">
                    <select
                        name='schedule'
                        value={form.schedule.day}
                        onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, day: e.target.value } })}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Day</option>
                        {daysOfWeek.map((day) => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                    <select
                        name='time'
                        value={form.schedule.time}
                        onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, time: e.target.value } })}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Time</option>
                        {times.map((time) => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full {loading ? 'loading' : ''}"
                >
                    {loading ? 'Adding...' : 'Add Activity'}
                </button>
            </form>
        </div>
    );
};

export default AddActivity;
