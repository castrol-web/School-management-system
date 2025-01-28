import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';  // Quill's default CSS
import axios from 'axios';
import { URL } from '../App';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useClassesStore from '../zustand/useClassesStore';


const AssignmentCreator = () => {
    const { classes, fetchClasses } = useClassesStore()
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [classId, setClassId] = useState('');
    const [content, setContent] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [maxPoints, setMaxPoints] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token'); // getting token in local storage

    //fetch classes when component mounts
    useEffect(() => {
        fetchClasses(token)
    }, [fetchClasses,token])

    // Configuration for ReactQuill's toolbar
    const modules = {
        toolbar: [
            [{ 'font': [] }, { 'size': [] }],  // Font size
            [{ 'header': '1' }, { 'header': '2' }, 'bold', 'italic', 'underline', 'strike'],
            [{ 'align': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],  // Text color and background
            ['link', 'image', 'video'],  // Insert link, image, video
            ['blockquote', 'code-block'],
            [{ 'script': 'sub' }, { 'script': 'super' }], // Subscript and superscript
            ['clean']  // Clear formatting button
        ],
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);

        try {
            const response = await axios.post(`${URL}/api/teacher/create-assignment`, {
                title,
                description,
                content,
                dueDate,
                maxPoints,
                classId,
            }, {
                headers: { 'x-access-token': token },
            });
            if (response.status === 201) {
                toast.success('Assignment created successfully!');
                setClassId('')
                setContent('')
                setDescription('')
                setDueDate('')
                setMaxPoints('')
                setTitle('')
            }

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message)
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Create Assignment</h2>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Assignment Title"
                    className="input input-bordered w-full mb-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="textarea textarea-bordered w-full mb-2"
                    placeholder="Assignment Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>

            {/* Rich Text Editor */}
            <div className="mb-4">
                <ReactQuill
                    value={content}
                    onChange={setContent}
                    theme="snow"
                    modules={modules}  // Applying the custom toolbar
                />
            </div>

            {/* Date and Points */}
            <div className="mb-4">
                <input
                    type="datetime-local"
                    className="input input-bordered w-full mb-2"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Points"
                    className="input input-bordered w-full mb-2"
                    value={maxPoints}
                    onChange={(e) => setMaxPoints(e.target.value)}
                />
            </div>

            {/* select class options*/}
            <div className="flex items-center space-x-2 mb-4">
                <label className="label">Choose class to give this assignment</label>
                <select
                    name="classId"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="border p-2 rounded w-full"
                >
                    <option value="">Select class</option>
                    {classes.map((clas) => (
                        <option value={clas._id} key={clas._id}>
                            {clas.className}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={handleSubmit}
                className="btn btn-primary w-full"
                disabled={loading}
            >
                {loading ? 'Creating Assignment...' : 'Create Assignment'}
            </button>
            <ToastContainer />
        </div>
    );
};

export default AssignmentCreator;
