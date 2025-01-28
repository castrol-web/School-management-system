import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from "../App";
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AssignmentViewer = () => {
    const [assignments, setAssignments] = useState([]); // Changed to an array
    const [submissions, setSubmissions] = useState([]); // Store submissions for each assignment
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    if (!token) {
        navigate("/login");
    }

    const decoded = jwtDecode(token);
    const id = decoded._id;

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await axios.get(`${URL}/api/parent/assignments/${id}`, {
                    headers: {
                        'x-access-token': token
                    }
                });


                // If assignments are returned as an array, set them
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setAssignments(res.data); // Store all assignments
                    setSubmissions(new Array(res.data.length).fill('')); // Initialize submissions
                } else {
                    setAssignments([res.data]); // If a single assignment is returned, make it an array
                    setSubmissions(['']); // Initialize a single submission
                }
            } catch (error) {
                console.error('Error fetching assignments:', error);
                toast.error('Failed to fetch assignments');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [id, token]);

    const handleSubmit = async (assignmentId, submission, index) => {
        if (!submission) {
            toast.error('Please write your answer before submitting.');
            return;
        }

        try {
            // Ensure you are sending the correct assignment ID and submission content
            await axios.post(`/api/assignments/submit`, { assignmentId, submission }, {
                headers: {
                    'x-access-token': token
                }
            });

            // Update the submission state if the submission is successful
            const newSubmissions = [...submissions];
            newSubmissions[index] = submission;
            setSubmissions(newSubmissions);
            
            toast.success('Assignment submitted successfully!');
        } catch (error) {
            console.error('Error submitting assignment:', error);
            toast.error('Failed to submit assignment.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            {assignments.length > 0 ? (
                <div className="max-w-3xl mx-auto p-4 mt-20">
                    <h2 className="text-xl font-bold mb-4">Your Assignments</h2>
                    {assignments.map((assignment, index) => (
                        <div key={assignment._id} className="mb-6">
                            <h3 className="text-lg font-bold mb-2">{assignment.title}</h3>
                            <div dangerouslySetInnerHTML={{ __html: assignment.content }}></div>

                            <div className="mt-4">
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    placeholder="Write your answers here..."
                                    value={submissions[index] || ''}
                                    onChange={(e) => {
                                        const updatedSubmissions = [...submissions];
                                        updatedSubmissions[index] = e.target.value;
                                        setSubmissions(updatedSubmissions);
                                    }}
                                />
                            </div>

                            <button
                                onClick={() => handleSubmit(assignment._id, submissions[index], index)}
                                className="btn btn-primary mt-4"
                            >
                                Submit Assignment
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="items-center justify-center text-center mx-auto">
                    <p>You don't have pending assignments</p>
                </div>
            )}
        </>
    );
};

export default AssignmentViewer;
