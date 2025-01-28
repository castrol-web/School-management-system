import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import { FadeLoader } from 'react-spinners';
import { css } from '@emotion/react';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Entries() {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState();
    const [examType, setExamType] = useState();
    const [term, setTerm] = useState();
    const [markData, setMarkData] = useState([]);
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //getting all classes in the school for choosing
    useEffect(() => {
        async function fetchClasses() {
            try {
                const response = await axios.get(`${URL}/api/teacher/get-classes`, {
                    headers: { "x-access-token": token },
                });
                setClasses(response.data);
            } catch (error) {
                console.error('Failed to fetch classes', error);
                toast.error('Failed to load classes. Please try again');
            }
        }
        fetchClasses();
    }, [token]);

    //showing entries for the selected criteria
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClass || !examType || !term) {
            toast.warn('Oops!,Please select all fields before Generating.');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`${URL}/api/teacher/get-marks/${selectedClass}`, {
                params: {
                    examType: examType,
                    term: term
                },
                headers: { "x-access-token": token },
            });
            if (response.status === 200) {
                setMarkData(response.data);
                toast.success('Marks fetched successfully');
            }

        } catch (error) {
            console.error('Failed to fetch marks', error);
            toast.error('Failed to fetch marks. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const studentMarks = markData.reduce((item, mark) => {
        const studentId = mark.student._id;
        const subjectCode = mark.subject.code;
        if (!item[studentId]) {
            item[studentId] = {
                student: mark.student,
                marks: {},
            };
        }
        item[studentId].marks[subjectCode] = mark.marks;
        return item;
    }, {});

    const subjectCodes = [...new Set(markData.map(mark => mark.subject.code))];

    //generating report function
    const GenerateReport = async (id, examType, term) => {
        try {
            const response = await axios.get(`${URL}/api/teacher/generate-report/${id}/${term}/${examType}/${selectedClass}`, {
                headers: { "x-access-token": token },
            })
            //if response is successfull navigate to reportForm component with reportData state
            if (response.status === 200) {
                navigate('/teacher/reports', { state: { reportData: response.data} })
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);  // Display the error message from the backend
            } else {
                toast.error('Failed to generate report. Please try again later.');
            }
            console.error('Failed to fetch report', error);
        }
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Select Term and Exam Type</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Select Term:</label>
                        <select
                            value={term}
                            onChange={e => setTerm(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select Term</option>
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Choose Exam Type:</label>
                        <select
                            value={examType}
                            onChange={e => setExamType(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Choose Exam Type</option>
                            <option value="Final">Final</option>
                            <option value="Midterm">Midterm</option>
                            <option value="Quiz">Quiz</option>
                            <option value="Assignment">Assignment</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Choose Class:</label>
                        <select
                            value={selectedClass}
                            onChange={e => setSelectedClass(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Choose Class</option>
                            {classes.map(cls => (
                                <option key={cls._id} value={cls._id}>{cls.className}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type='submit'
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : 'Generate'}
                    </button>
                </form>
                {loading ? (
                    <div className="flex justify-center py-5">
                        <FadeLoader
                            color={'#36d7b7'}
                            css={override}
                            size={100}
                        />
                    </div>
                ) : (
                    <table className="min-w-full bg-white shadow-md rounded-lg mt-6">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="py-3 text-left px-3">No.</th>
                                <th className="py-3 px-6 text-left">First Name</th>
                                <th className="py-3 px-6 text-left">Last Name</th>
                                {subjectCodes.map((subjectCode) => (
                                    <th key={subjectCode} className="py-3 px-6 text-left">{subjectCode}</th>
                                ))}
                                <th className="py-3 px-6 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(studentMarks).length > 0 ? Object.values(studentMarks).map((item, index) => (
                                <tr
                                    key={item.student._id}
                                    className={`border-b border-gray-200 hover:bg-gray-100 transition duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                        }`}
                                >
                                    <td className="py-3 px-6">{index + 1}</td>
                                    <td className="py-3 px-6">{item.student.firstName}</td>
                                    <td className="py-3 px-6">{item.student.lastName}</td>
                                    {subjectCodes.map((subjectCode) => (
                                        <td key={`${item.student._id}-${subjectCode}`} className="py-3 px-6">{item.marks[subjectCode] || '-'}</td>
                                    ))}
                                    <td className="py-3 px-6 flex justify-center space-x-2">
                                        <button className="text-blue-500 hover:text-blue-700">
                                            <FaEye />
                                        </button>
                                        <button className="text-green-500 hover:text-green-700">
                                            <FaEdit />
                                        </button>
                                        <button className="text-red-500 hover:text-red-700" type='button'>
                                            <FaTrashAlt />
                                        </button>
                                        <button type='button' onClick={() => GenerateReport(item.student._id, examType, term, selectedClass)} className="text-green-500 hover:text-green-700">
                                            Generate report
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={subjectCodes.length + 4} className="text-center py-5">No Entries found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            <ToastContainer />
        </div>
    )
}

// CSS override for the loading spinner
const override = css`
  display: block;
  margin: 0 auto;
`;

export default Entries;
