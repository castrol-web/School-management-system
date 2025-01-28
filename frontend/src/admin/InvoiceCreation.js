import React, { useEffect, useRef, useState } from 'react';
import { URL } from '../App';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStudentStore from '../zustand/useStudentStore';
import useClassesStore from '../zustand/useClassesStore';

function InvoiceCreation() {
    const formRef = useRef();
    const token = localStorage.getItem('token');
    //getting current year dynamically
    const currentYear = new Date().getFullYear()
    const { students, fetchStudents } = useStudentStore();
    const { classes, fetchClasses } = useClassesStore();
    const [mode, setMode] = useState('individual'); // Mode: 'individual' or 'class'
    const [loading, setLoading] = useState(false);
    const [invoice, setInvoice] = useState({
        studentId: '',
        classId: '',
        term: '',
        totalFees: '',
        year: currentYear, //current year to be default
    })
    //fetch students when component mounts
    useEffect(() => {
        fetchStudents(token)
        fetchClasses(token)
    }, [token, fetchStudents, fetchClasses])
    const terms = ['1', '2', '3'];


    //submit invoice
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'individual') {
                // For Individual Student
                const response = await axios.post(`${URL}/api/admin/generate-invoice`, invoice, {
                    headers: {
                        'x-access-token': token,
                    },
                });
                if (response.status === 201) {
                    toast.success(response.data.message);
                    resetForm();
                }
            } else if (mode === 'class') {
                // For Whole Class
                const response = await axios.post(`${URL}/api/admin/generate-class-invoice`, invoice, {
                    headers: {
                        'x-access-token': token,
                    },
                });
                if (response.status === 201) {
                    toast.success(response.data.message);
                    resetForm();
                }
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An error occurred. Please try again!');
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    }

    //resetting the form after submission
    const resetForm = () => {
        setInvoice({
            studentId: '',
            classId: '',
            term: '',
            totalFees: '',
            year: currentYear,
        });
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg space-y-4 sm:space-y-6"
                action="/generate-invoice"
                method="post"
                ref={formRef}
            >
                <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">New Invoice</h2>

                {/* Toggle Between Modes */}
                <div className="flex justify-center space-x-4 mb-4">
                    <button
                        type="button"
                        className={`py-2 px-4 rounded ${mode === 'individual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setMode('individual')}
                    >
                        Individual Student
                    </button>
                    <button
                        type="button"
                        className={`py-2 px-4 rounded ${mode === 'class' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setMode('class')}
                    >
                        Whole Class
                    </button>
                </div>

                {mode === 'individual' ? (
                    // Individual Invoice Fields
                    <div className="sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold w-full">Student Name</label>
                            <select
                                name="studentId"
                                value={invoice.studentId}
                                onChange={(e) => setInvoice({ ...invoice, studentId: e.target.value })}
                                className="border p-2 rounded w-full"
                            >
                                <option value="">Select Student</option>
                                {students.map((student) => (
                                    <option value={student._id} key={student._id}>
                                        {student.firstName}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>
                ) : (
                    // Class Invoice Fields
                    <div>
                        <label className="block text-gray-700 font-semibold">Class</label>
                        <select
                            name="classId"
                            value={invoice.classId}
                            onChange={(e) => setInvoice({ ...invoice, classId: e.target.value })}
                            className="border p-2 rounded w-full"
                        >
                            <option value="">Select Class</option>
                            {classes.map((classItem) => (
                                <option value={classItem._id} key={classItem._id}>
                                    {classItem.className}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Common Term and amount Selection */}
                <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-semibold">Term</label>
                    <select
                        name="term"
                        value={invoice.term}
                        onChange={(e) => setInvoice({ ...invoice, term: e.target.value })}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">Select Term</option>
                        {terms.map((term) => (
                            <option key={term} value={term}>
                                {term}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold">Fees Amount</label>
                    <input
                        type="number"
                        name="totalFees"
                        value={invoice.totalFees}
                        onChange={(e) => setInvoice({ ...invoice, totalFees: e.target.value })}
                        className="border p-2 rounded w-full"
                    />
                </div>

                {/* changing year */}

                <div>
                    <label className="block text-gray-700 font-semibold">Year</label>
                    <input
                        type="number"
                        name="year"
                        value={invoice.year}
                        onChange={(e) => setInvoice({ ...invoice, year: e.target.value })}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div className="flex justify-center space-x-4">
                    <button
                        type="submit"
                        className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ${loading ? 'opacity-50' : ''
                            }`}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    )
}

export default InvoiceCreation