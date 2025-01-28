// src/components/Teachers.jsx
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../App';
import { useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { FaEdit, FaTrashAlt, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { css } from '@emotion/react';
import useTeachersStore from '../zustand/useTeachersStore';

function Teachers() {
  const formRef = useRef();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teacher, setTeacher] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'male',
    password: '',
    position: 'Teacher',
    role: 'teacher',
  });

  //parent api from zustand
  const { Loading, teachers, fetchTeachers } = useTeachersStore();

  const handleTeacherChange = (e) =>
    setTeacher({
      ...teacher,
      [e.target.name]: e.target.value,
    });
  //getting token
  const token = localStorage.getItem('token');

  const addTeacher = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    }
    const formdata = new FormData();
    formdata.append('firstName', teacher.firstName);
    formdata.append('lastName', teacher.lastName);
    formdata.append('email', teacher.email);
    formdata.append('phone', teacher.phone);
    formdata.append('gender', teacher.gender);
    formdata.append('position', teacher.position);
    formdata.append('password', teacher.password);
    formdata.append('role', teacher.role);
    try {
      setLoading(true)
      const response = await axios.post(`${URL}/api/admin/register-teacher`, formdata, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        setTeacher({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          gender: 'male',
          password: '',
          position: 'Teacher',
          role: 'teacher',
        });
        setShowForm(false);
        fetchTeachers(token)
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('an error occcured')
        console.error(error)
      }
    } finally {
      setLoading(false);
    }
  };


  //delete teacher function 
  async function DeleteTeacher(teacherId) {
    // Show a confirmation dialog before proceeding with deletion
    const confirmDelete = window.confirm("Are you sure you want to delete this teacher?");

    // If the user cancels, exit the function early
    if (!confirmDelete) return;
    try {
      setLoading(true)
      const response = await axios.delete(`${URL}/api/admin/delete-teacher/${teacherId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      if (response.status === 200) {
        toast.success("teacher deleted successfully")
        fetchTeachers(token)
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        return toast.error(error.response.data.message)
      } else {
        toast.error(`an error occured!:${error}`)
      }
    } finally {
      setLoading(false)
    }
  }
  //get teachers when component mounts
  useEffect(() => {
    fetchTeachers(token)
  }, [token,fetchTeachers]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
        Teacher Management
      </h2>
      {!showForm ? (
        <>
          <div>
            <button
              onClick={() => setShowForm(true)}
              className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              + New Teacher
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="py-3 text-left px-3">No.</th>
                  <th className="py-3 px-6 text-left">First Name</th>
                  <th className="py-3 px-6 text-left">Last Name</th>
                  <th className="py-3 px-6 text-left">Phone number</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              {loading || Loading ? (
                <tbody className="items-center justify-center text-center mt-6 mx-auto">
                  <tr>
                    <td className='text-center'></td>
                    <td className='text-center'></td>
                    <td className="text-center py-5">
                      <FadeLoader
                        color={'#36d7b7'}
                        css={override}
                        size={100}
                        className="mx-auto"
                      />
                      <p className="text-center">Loading...</p>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {teachers.length > 0 ? teachers.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 hover:bg-gray-100 transition duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                    >
                      <td className="py-3 px-6">{index + 1}</td>
                      <td className="py-3 px-6">{item.commonDetails?.firstName}</td>
                      <td className="py-3 px-6">{item.commonDetails?.lastName}</td>
                      <td className="py-3 px-6">{item.commonDetails?.phone}</td>
                      <td className="py-3 px-6 flex justify-center space-x-2">
                        <button className="text-blue-500 hover:text-blue-700">
                          <FaEye />
                        </button>
                        <button className="text-green-500 hover:text-green-700">
                          <FaEdit />
                        </button>
                        <button className="text-red-500 hover:text-red-700" type='button' onClick={() => DeleteTeacher(item._id)}>
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  )) : <tr className='mx-auto items-center justify-center text-center'>
                    <td className='text-center'></td>
                    <td className='text-center'></td>
                    <td className='text-center lg:py-9 py-5'>no teacher added yet</td>
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
        </>) : (
        <div className="p-4">
          <form
            onSubmit={addTeacher}
            className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto"
            encType="multipart/form-data"
            action="/register-teacher"
            method="post"
            ref={formRef}
          >
            <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">New Teacher</h1>
            {/* Form is split into two columns on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={teacher.firstName}
                  onChange={handleTeacherChange}
                  className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={teacher.lastName}
                  onChange={handleTeacherChange}
                  className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={teacher.email}
                  onChange={handleTeacherChange}
                  className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={teacher.phone}
                  onChange={handleTeacherChange}
                  className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={teacher.password}
                  onChange={handleTeacherChange}
                  className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Position</label>
                <select
                  value={teacher.position}
                  onChange={handleTeacherChange}
                  className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="position"
                  required
                >
                  <option value="headTeacher">Head Teacher</option>
                  <option value="deputy-headTeacher">Deputy Head Teacher</option>
                  <option value="Discipline-Master">Discipline Master</option>
                  <option value="Class-Teacher">Class Teacher</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Inter-Teacher">Internship Teacher</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Gender</label>
                <select
                  value={teacher.gender}
                  onChange={handleTeacherChange}
                  className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="gender"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-3 gap-10 items-center mx-auto">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
              >
                Save
              </button>
            </div>

          </form>
          <ToastContainer />
        </div>
      )}
    </div>
  );
}


// CSS override for the loading spinner
const override = css`
  display: block;
  margin: 0 auto;
`;


export default Teachers;
