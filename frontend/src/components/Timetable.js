import React, { useEffect, useState } from 'react';
import { URL } from '../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Timetable() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    if (!token) {
        navigate('/login')
    }
    //fetching timetable when component mounts
    useEffect(() => {
        const fetchTimetable = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${URL}/api/teacher/timetable`, {
                    headers: {
                        'x-access-token': token
                    }
                })
                console.log(response.data)
                if (response.status === 201) {
                    setTimetable(response.data)
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchTimetable()
    }, [token])

    //dynamic time ranges 
    const dynamicTimeRanges = timetable.reduce((ranges, entry) => {
        const start = entry.timeSlot[0];
        const end = entry.timeSlot[1];
        if (!ranges.some((range) => range.start === start && range.end === end)) {
            ranges.push({ start, end })
        }
        return ranges;
    }, [])

  // Generate table data grouped by day and time range
    const generateTableData = () => {
        const tableData = {};
        //check to see if the activity corrresponds to the states activity in the day and time range
        days.forEach((day) => {
            tableData[day] = dynamicTimeRanges.map((range) => {
                const activity = timetable.filter(
                    (entry) =>
                        entry.day === day &&
                        entry.timeSlot[0] === range.start &&
                        entry.timeSlot[1] === range.end
                );
                return activity ||null;
            });
        });
        return tableData;
    }
    const tableData = generateTableData();
    return (
        <div className="overflow-x-auto mt-8">
            <h2 className="text-2xl font-bold text-center mb-6">School Timetable</h2>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <table className="table table-zebra w-full text-center">
                    <thead>
                        <tr>
                            <th className="bg-primary text-white">Time Range</th>
                            {days.map((day, index) => (
                                <th key={index} className="bg-primary text-white">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dynamicTimeRanges.map((range, rangeIndex) => (
                            <tr key={rangeIndex}>
                                <td className="font-semibold">
                                    {range.start} - {range.end}
                                </td>
                                {days.map((day, dayIndex) => {
                                    const activities = tableData[day][rangeIndex];
                                    return (
                                        <td key={dayIndex}>
                                            {activities ? (
                                                activities.map((activity, idx) => (
                                                    <div key={idx} className="mb-2">
                                                        <strong>{activity.activityType}</strong>

                                                        {activity.activityType !== "Break" && activity.subject && (
                                                            <div>Subject: {activity.subject}</div>
                                                        )}
                                                        {activity.activityType !== "Break" &&activity.classId && (
                                                            <div>
                                                                Class: {activity.classId.className}
                                                            </div>
                                                        )}
                                                        {activity.activityType !== "Break" &&activity.teacherId && (
                                                            <div>
                                                                Teacher:{" "}
                                                                {`${activity.teacherId.commonDetails?.firstName} ${activity.teacherId.commonDetails?.lastName}`}
                                                            </div>
                                                        )}
                                                        {activity.activityType !== "Break" &&activity.room && (
                                                            <div>Room: {activity.room}</div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-gray-500">---</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default Timetable