import React, { useEffect, useState } from 'react'
import Conversation from './Conversation';
import axios from "axios";
import { URL } from "../App.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { getRandomEmoji } from "../../src/utils/emojis.js"

function Conversations() {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);
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
    return (
        <div className='py-2 flex flex-col overflow-auto'>
            {conversations.map((conversation, index) => {
                return <Conversation
                    key={conversation._id}
                    conversation={conversation}
                    emoji={getRandomEmoji()}
                    // getting the last index
                    lastIndex={index === conversations.length - 1}
                />
            })}
            {loading ? <span className='loading loading-spinner mx-auto'></span> : null}
            <ToastContainer />
        </div>
    )
}

export default Conversations