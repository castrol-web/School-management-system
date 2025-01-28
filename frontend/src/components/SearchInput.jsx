import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { URL } from "../App.js";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import useConversation from '../zustand/useConversation';

function SearchInput() {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [conversations, setConversations] = useState([]);
    const { setSelectedConversation } = useConversation();
    const navigate = useNavigate();
    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Unauthorized!, please login first')
                    navigate('/admin/login')
                }
                const response = await axios.get(`${URL}/api/messages/`, {
                    headers: {
                        'x-access-token': token
                    }
                })
                const data = response.data;
                if (data.error) {
                    throw new Error(data.error)
                }
                setConversations(data)
            } catch (error) {
                toast.error(error.message)
            } finally {
                setLoading(false);
            }
        }
        getConversations();
    }, [navigate]);
    //search algorithm
    function submit(e) {
        e.preventDefault();
        if(!search) return;
        if(search.length <3){
            toast.error('search term must be at least 3 characters long!')
        }
        const conversation = conversations.find((c) => c.firstName.toLowerCase().includes(search.toLowerCase()))
        if (conversation) {
            setSelectedConversation(conversation)
            setSearch('')
        }else{
            toast.error('No such user found')
        }
    }
    return (
        <div>
            <form className='flex items-center gap-2' onSubmit={submit}>
                <input type='text' placeholder='Search...' name='search' className='input input-bordered rounded-full' onChange={(e) => setSearch(e.target.value)} />
                <button type='submit' className='btn btn-circle bg-sky-500 text-white'>
                    {loading ? <p className='spinner loading-spinner'></p> : <CiSearch />}
                </button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default SearchInput