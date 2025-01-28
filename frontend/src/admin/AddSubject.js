import React, { useRef, useState, useEffect } from 'react';
import { URL } from '../App';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrashAlt, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FadeLoader } from 'react-spinners';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import useSubjectStore from '../zustand/useSubjectStore';

function AddSubject() {
    const formRef = useRef();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [subject, setSubject] = useState({
        name: '',
        code: '',
    });
    const handleSubjectChange = (e) => setSubject({
        ...subject,
        [e.target.name]: e.target.value
    });
    //distructuring subject store
    const { Loading, subjects, fetchSubjects } = useSubjectStore();
    //token
    const token = localStorage.getItem('token');
    //function to add a student
    const addSubject = async (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append("name", subject.name)
        formdata.append("code", subject.code)
        try {
            setLoading(true)
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/admin/login")
            }
            const response = await axios.post(`${URL}/api/admin/add-subject`, formdata, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }

            });
            if (response.status === 201) {
                toast.success(response.data.message);
                setSubject({
                    name: '',
                    code: '',
                })
                fetchSubjects(token)
                setShowForm(false);
            }

        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Unauthorized please login and try again")
                navigate("/admin/login")
            } else {
                toast.error("an error occured please try again!")
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };
    //get subjects when component mounts
    useEffect(() => {
        fetchSubjects(token)
    }, [fetchSubjects, token])

    //delete selected subject
    async function DeleteSubject(subjectId) {
        // Show a confirmation dialog before proceeding with deletion
        const confirmDelete = window.confirm("Are you sure you want to delete this subject?");

        // If the user cancels, exit the function early
        if (!confirmDelete) return;
        try {
            setLoading(true)
            const response = await axios.delete(`${URL}/api/admin/delete-subject/${subjectId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
            })
            if (response.status === 200) {
                toast.success(response.data.message)
                fetchSubjects(token)
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
            toast.error(`an error occured,${error}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
                Subjects Management
            </h2>
            {!showForm ? (
                <>
                    <div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                        >
                            + Add Subject
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="py-3 text-left px-3">No.</th>
                                    <th className="py-3 px-6 text-left">Name</th>
                                    <th className="py-3 px-6 text-left">Code</th>
                                    <th className="py-3 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            {loading || Loading ? (
                                <tbody className="items-center justify-center text-center mt-6 mx-auto">
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td className="text-center py-5">
                                            <FadeLoader
                                                color={'#36d7b7'}
                                                css={override}
                                                size={100}
                                                className="mx-auto text-center"
                                            />
                                            <p className="text-center">Loading...</p>
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {subjects.length > 0 ? subjects.map((subject, index) => (
                                        <tr
                                            key={index}
                                            className={`border-b border-gray-200 hover:bg-gray-100 transition duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                                }`}
                                        >
                                            <td className="py-3 px-6">{index + 1}</td>
                                            <td className="py-3 px-6">{subject.name}</td>
                                            <td className="py-3 px-6">{subject.code}</td>

                                            <td className="py-3 px-6 flex justify-center space-x-2">
                                                <button className="text-blue-500 hover:text-blue-700">
                                                    <FaEye />
                                                </button>
                                                <button className="text-green-500 hover:text-green-700">
                                                    <FaEdit />
                                                </button>
                                                <button type='button' className="text-red-500 hover:text-red-700" onClick={() => DeleteSubject(subject._id)} >
                                                    <FaTrashAlt />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : <tr className='mx-auto items-center justify-center text-center'>
                                        <td className='text-center'></td>
                                        <td className='text-center'></td>
                                        <td className='text-center lg:py-9 py-5'>no subjects added yet</td>
                                    </tr>}
                                </tbody>
                            )}
                        </table>

                        {/* Pagination Controls */}
                        <div className="flex items-center mt-4 justify-center text-center gap-5 mx-auto">
                            <button className="text-blue-500 hover:text-blue-700">
                                <FaChevronLeft />
                            </button>
                            <button className="text-blue-500 hover:text-blue-700">
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className='items-center mx-auto justify-center'>
                    <h2 className="text-xl text-center mb-3 text-slate-100">New subject</h2>
                    <form onSubmit={addSubject} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6 mx-auto" encType='multipart/form-data' action='/add-subject' method='post' ref={formRef}>
                        <div>
                            <label className="block text-gray-700">Subject Name</label>
                            <input
                                type="text"
                                name="name"
                                value={subject.name}
                                onChange={handleSubjectChange}
                                className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter subject name eg.. Mathematics etc"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Subject Code</label>
                            <input
                                type="text"
                                name="code"
                                value={subject.code}
                                onChange={handleSubjectChange}
                                className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter subject code eg. MATH,KISW,ENG etc"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            + Add Subject
                        </button>
                    </form>
                    <ToastContainer />
                </div>
            )}
        </div>)
}
// CSS override for the loading spinner
const override = css`
  display: block;
  margin: 0 auto;
`;
export default AddSubject;