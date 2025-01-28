import { jwtDecode } from 'jwt-decode';
import React from 'react';
import extractTime from "../../utils/extractTime"

function Message({ message }) {
    //extract time the message was sent
    const formattedTime = extractTime(message.createdAt)
    //decoding the token to check if the user is logged in or not and grabbing the user id 
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const authUser = decoded._id;
    //checking if the message is from me of not
    const fromMe = message.senderId === authUser;
    const chatClassName = fromMe ? 'chat-end' : 'chat-start';
    // const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const bubbleBgColor = fromMe ? 'bg-blue-500' : "";
    return (
        <div className={`chat ${chatClassName}`}>
            <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                    <img alt='chat bubble' src='https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' />
                </div>
            </div>
            <div className={`${bubbleBgColor} chat-bubble text-white`}>{message.message}</div>
            <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
        </div>
    )
}

export default Message