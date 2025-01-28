import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from "../App";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCalendarAlt, FaChalkboardTeacher, FaClock, FaBook, FaBuilding, FaTasks } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import useSubjectStore from '../zustand/useSubjectStore';
import useTeachersStore from '../zustand/useTeachersStore';
import useClassesStore from '../zustand/useClassesStore';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import '@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css';

function CreateTimetable() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const activities = ['Lesson', 'Break', 'Lunch', 'Games'];
    const term = ['1', '2', '3'];
    const weeks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    const {fetchClasses, classes } = useClassesStore();
    const { Loading, teachers, fetchTeachers } = useTeachersStore();
    const { subjects, fetchSubjects } = useSubjectStore();

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
    }

    const [form, setForm] = useState({
        term: '',
        week: '',
        teacherId: '',
        activityType: '',
        day: '',
        classes: '',
        timeSlot: ["", ""],
        subject: '',
        room: '',
    });

    useEffect(() => {
        fetchTeachers(token);
        fetchClasses(token);
        fetchSubjects(token);
    }, [fetchTeachers, fetchClasses, fetchSubjects, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.term || !form.week || !form.timeSlot[0] || !form.timeSlot[1] || !form.activityType || !form.day) {
            toast.error('Please fill in all required fields.');
            return;
        }

        const [from, to] = form.timeSlot;
        if (!from || !to || from >= to) {
            toast.error('Invalid time range: "From" time must be earlier than "To" time.');
            return;
        }

        const isLesson = form.activityType === "Lesson";

        const data = {
            ...form,
            teacherId: isLesson ? form.teacherId : null,
            subject: isLesson ? form.subject : null,
            classes: isLesson ? form.classes : null,
            room: isLesson ? form.room : null,
        };

        try {
            const response = await axios.post(`${URL}/api/teacher/create`, data, {
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data)
            if (response.status === 201) {
                toast.success('Timetable entry added successfully.');
                setForm({
                    term: '',
                    week: '',
                    teacherId: '',
                    activityType: '',
                    day: '',
                    classes: '',
                    timeSlot: ["", ""],
                    subject: '',
                    room: '',
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding timetable entry');
            console.error('Error adding timetable entry:', error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Timetable Entry</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Term Selection */}
                <div className="form-control">
                    <label className="label font-medium">
                        <FaCalendarAlt className="inline mr-2 text-primary" />
                        Select Term
                    </label>
                    <select
                        className="select select-bordered"
                        value={form.term}
                        onChange={(e) => setForm({ ...form, term: e.target.value })}
                        required
                    >
                        <option value="">Select Term</option>
                        {term.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Week Selection */}
                <div className="form-control">
                    <label className="label font-medium">
                        <FaCalendarAlt className="inline mr-2 text-primary" />
                        Week
                    </label>
                    <select
                        className="select select-bordered"
                        value={form.week}
                        onChange={(e) => setForm({ ...form, week: e.target.value })}
                        required
                    >
                        <option value="">Select Week</option>
                        {weeks.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Activity Type */}
                <div className="form-control">
                    <label className="label font-medium">
                        <FaTasks className="inline mr-2 text-primary" />
                        Activity
                    </label>
                    <select
                        className="select select-bordered"
                        value={form.activityType}
                        onChange={(e) => setForm({ ...form, activityType: e.target.value })}
                        required
                    >
                        <option value="">Select Activity</option>
                        {activities.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Conditional Fields for Lessons */}
                {form.activityType === "Lesson" && (
                    <>
                        {/* Teacher Selection */}
                        <div className="form-control">
                            <label className="label font-medium">
                                <FaChalkboardTeacher className="inline mr-2 text-primary" />
                                Teacher
                            </label>
                            <select
                                className="select select-bordered"
                                value={form.teacherId}
                                onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                                required
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher._id} value={teacher._id}>
                                        {teacher.commonDetails.firstName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Class Selection */}
                        <div className="form-control">
                            <label className="label font-medium">
                                <FaChalkboardTeacher className="inline mr-2 text-primary" />
                                Class
                            </label>
                            <select
                                className="select select-bordered"
                                value={form.classes}
                                onChange={(e) => setForm({ ...form, classes: e.target.value })}
                                required
                            >
                                <option value="">Select Class</option>
                                {classes.map((item, index) => (
                                    <option key={index} value={item._id}>
                                        {item.className}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Subject Selection */}
                        <div className="form-control">
                            <label className="label font-medium">
                                <FaBook className="inline mr-2 text-primary" />
                                Subject
                            </label>
                            <select
                                className="select select-bordered"
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                required
                            >
                                <option value="">Select Subject</option>
                                {subjects.map((item, index) => (
                                    <option key={index} value={item.code}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Room */}
                        <div className="form-control">
                            <label className="label font-medium">
                                <FaBuilding className="inline mr-2 text-primary" />
                                Room
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                placeholder="Enter room name/number"
                                value={form.room}
                                onChange={(e) => setForm({ ...form, room: e.target.value })}
                            />
                        </div>
                    </>
                )}

                {/* Day Selection */}
                <div className="form-control">
                    <label className="label font-medium">
                        <FaCalendarAlt className="inline mr-2 text-primary" />
                        Day
                    </label>
                    <select
                        className="select select-bordered"
                        value={form.day}
                        onChange={(e) => setForm({ ...form, day: e.target.value })}
                        required
                    >
                        <option value="">Select Day</option>
                        {days.map((item, index) => (
                            <option key={index}>{item}</option>
                        ))}
                    </select>
                </div>

                {/* Time Range */}
                <div className="form-control">
                    <label className="label font-medium">
                        <FaClock className="inline mr-2 text-primary" />
                        Time Range
                    </label>
                    <TimeRangePicker
                        onChange={(value) => setForm({ ...form, timeSlot: value })}
                        value={form.timeSlot}
                        disableClock
                    />
                </div>

                {/* Submit Button */}
                <div className="form-control md:col-span-2 lg:mx-32">
                    <button
                        type="submit"
                        disabled={Loading}
                        className="btn btn-primary"
                    >
                        {Loading ? "Adding..." : "Add Entry"}
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default CreateTimetable;
