import React, { useEffect, useState } from 'react'
import Message from './Message'
import useConversation from '../../zustand/useConversation';
import { URL } from '../../App';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MessageSkeleton from '../../skeletons/MessageSkeleton';
import { useRef } from 'react';

function Messages() {
  const [loading, setLoading] = useState(false);
  const { selectedConversation } = useConversation();
  const [messages, setMessages] = useState([])
  const token = localStorage.getItem('token');
  //checking lastmessage using reference
  const lastMessageRef = useRef();
  useEffect(() => {
    const getMessages = async () => {
      const id = selectedConversation?._id;
      try {
        setLoading(true)
        const response = await axios.get(`${URL}/api/messages/get-messages/${id}`, {
          headers: {
            'x-access-token': token
          }
        })
        if (response.status === 200) {
          const data = response.data;
          setMessages(data)
          if (data.error) {
            throw new Error(data.error)
          }
        }
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    if (selectedConversation?._id) getMessages()
  }, [selectedConversation?._id,token]);

  useEffect(() => {
    setTimeout(()=>{
      lastMessageRef.current?.scrollIntoView({ behaviour: "smooth" })
    },100)
  }, [messages])

  return (
    <div className='px-4 flex-1 overflow-auto'>
      {!loading && messages.length > 0 && messages.map((messages) => {
        return <div ref={lastMessageRef} key={messages._id}>
          <Message  message={messages} />
        </div>
      })}
      {/* if loading show the skeleton  */}
      {loading && [...Array(3)].map((_, index) => <MessageSkeleton key={index} />)}

      {!loading && messages.length === 0 && (
        <p className='text-center'>No conversation found,Send a message to start conversation</p>
      )}
      <ToastContainer />
    </div>
  )
}

export default Messages;