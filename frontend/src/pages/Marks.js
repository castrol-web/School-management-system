import React, { useEffect, useState,useCallback } from 'react';
import axios from 'axios';
import { URL } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Marks() {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [students, setStudents] = useState([]);
    const [marksData, setMarksData] = useState([]);
    const [term, setTerm] = useState('');
    const [examType, setExamType] = useState('');
    const [year] = useState(new Date().getFullYear());

    const token = localStorage.getItem('token');

    // Fetch classes for a teacher to choose the classes they are teaching
    useEffect(() => {
        async function fetchClasses() {
            try {
                const response = await axios.get(`${URL}/api/teacher/get-classes`, {
                    headers: { "x-access-token": token },
                });
                setClasses(response.data);
            } catch (error) {
                console.error('Failed to fetch classes', error);
            }
        }
        fetchClasses();
    }, [token]);

    // Fetch and filter students based on the selected criteria
    const fetchAndFilterStudents = useCallback(async () => {
        if (!selectedClass || !selectedSubject || !term || !examType) {
            return;
        }

        try {
            // Fetch students for the selected class
            const studentsResponse = await axios.get(`${URL}/api/teacher/${selectedClass}/students`, {
                headers: { "x-access-token": token },
            });

            // Fetch existing marks for the selected criteria
            const existingMarksResponse = await axios.get(`${URL}/api/teacher/${selectedClass}/marks`, {
                headers: { "x-access-token": token },
                params: {
                    subjectId: selectedSubject,
                    term,
                    year,
                    examType,
                }
            });

            const existingMarks = existingMarksResponse.data;

            // Filter students who do not have marks recorded
            const studentsWithoutMarks = studentsResponse.data.filter(student =>
                !existingMarks.some(mark => mark.student.toString() === student._id)
            );

            // Set the filtered students
            setStudents(studentsWithoutMarks);
            setMarksData(studentsWithoutMarks.map(student => ({ studentId: student._id, marks: '' })));
        } catch (error) {
            console.error('Failed to fetch or filter students', error);
        }
    },[selectedClass, selectedSubject, term, examType,token,year]);

    // Call fetchAndFilterStudents whenever the relevant selection changes
    useEffect(() => {
        fetchAndFilterStudents();
    }, [fetchAndFilterStudents]);

    const handleClassSelect = async (classId) => {
        setSelectedClass(classId);
        try {
            // Fetch subjects for the selected class
            const subjectsResponse = await axios.get(`${URL}/api/teacher/get-class/${classId}/subjects`, {
                headers: { "x-access-token": token },
            });
            setSubjects(subjectsResponse.data);
        } catch (error) {
            console.error('Failed to fetch subjects', error);
        }
    };

    const handleSubjectSelect = (subjectId) => {
        setSelectedSubject(subjectId);
    };

    const handleMarksChange = (studentId, value) => {
        setMarksData(prevData =>
            prevData.map(entry =>
                entry.studentId === studentId ? { ...entry, marks: value } : entry
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${URL}/api/teacher/submit-marks`, {
                classId: selectedClass,
                subjectId: selectedSubject,
                term,
                year,
                examType,
                marksData
            }, {
                headers: { "x-access-token": token }
            });
            if (response.status === 201) {
                toast.success(response.data.message);
                setSelectedClass(null);
                setSelectedSubject('');
                setTerm("");
                setExamType("");
                setStudents([]);
                setMarksData([]);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Display the server error message to the user
                toast.error(error.response.data.message);
            } else {
                // Handle any other errors
                toast.error(`An unexpected error occurred.${error}`);
            }
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-center">Enter Marks Below</h2>

            <div className="shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4"><p className='text-gray text-xs'>Step 1 of 5:</p>Select Class</h3>
                <div className="flex flex-wrap gap-4">
                    {classes.map(cls => (
                        <button
                            key={cls._id}
                            onClick={() => handleClassSelect(cls._id)}
                            className={`py-2 px-4 rounded-lg border transition ${selectedClass === cls._id
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-500 hover:text-white'
                                }`}
                        >
                            {cls.className}
                        </button>
                    ))}
                </div>
            </div>

            {selectedClass && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4"><p className='text-gray text-xs'>Step 2 of 5:</p>Select Subject</h3>
                    <select
                        onChange={e => handleSubjectSelect(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    >
                        <option value="">Select Subject</option>
                        {subjects.map(subject => (
                            <option key={subject._id} value={subject._id}>{subject.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {selectedSubject && (
                <form onSubmit={handleSubmit} className="shadow-md rounded-lg p-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2"><p className='text-gray text-xs'>Step 3 of 5:</p>Select Term:</label>
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

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2"><p className='text-gray text-xs'>Step 4 of 5:</p>Choose Exam Type:</label>
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

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4"><p className='text-gray text-xs'>Step 5 of 5:</p>Enter Marks for Students</h4>
                        {students.length > 0 ? students.map(student => (
                            <div key={student._id} className="mb-3 flex items-center">
                                <label className="w-1/3 text-gray-700">{student.firstName} {student.lastName}:</label>
                                <input
                                    type="number"
                                    value={marksData.find(entry => entry.studentId === student._id)?.marks || ''}
                                    onChange={e => handleMarksChange(student._id, e.target.value)}
                                    placeholder="Enter marks"
                                    min="0"
                                    max="100"
                                    required
                                    className="w-2/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        )) : <div className='items-center justify-center text-center'><p className='mx-auto text-center justify-center'>No students found</p></div>}
                    </div>
                    <div className='flex gap-10 items-center justify-center mx-auto'>
                        <button
                            type="button"
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                            onClick={() => {
                                setSelectedClass(null);
                                setSelectedSubject('');
                                setTerm("");
                                setExamType("");
                                setStudents([]);
                                setMarksData([]);
                            }}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                        >
                            Submit Marks
                        </button>
                    </div>
                </form>
            )}
            <ToastContainer />
        </div>
    );
}

export default Marks;
