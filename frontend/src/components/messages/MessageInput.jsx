import axios from 'axios';
import React, { useState } from 'react';
import { BsFillSendFill } from "react-icons/bs";
import { URL } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useConversation from '../../zustand/useConversation';

function MessageInput() {
    const [loading, setLoading] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const { messages, setMessages, selectedConversation } = useConversation();
    //sending message function 
    const sendMessage = async (event) => {
        event.preventDefault()
        try {
            if (!inputMessage) return;
            const id = selectedConversation._id;
            setLoading(true);
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('message', inputMessage)
            //id of the receiver
            const response = await axios.post(`${URL}/api/messages/send/${id}`, formData, {
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 201) {
                const data = response.data;
                if (data.error) {
                    throw new Error(data.error)
                }
                setMessages([...messages, data])
                setInputMessage('')
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }
    return (
        <form className='px-4 my-3' onSubmit={sendMessage}>
            <div className='relative w-full'>
                {/* Input Field */}
                <input
                    name='message'
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    type='text'
                    placeholder='Send a message'
                    className='border text-sm rounded-lg block w-full pl-3 pr-12 bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                {/* Send Button */}
                {inputMessage ? <button
                    type='submit'
                    className='absolute inset-y-0 right-0 flex items-center justify-center px-3 text-white bg-blue-600 hover:bg-blue-700 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    {loading ? <span className='loading loading-spinner'></span> : <BsFillSendFill />}
                </button> : ""}

            </div>
            <ToastContainer />
        </form>
    );
}

export default MessageInput;
