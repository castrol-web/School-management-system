import React from 'react';
import Messages from './Messages';
import MessageInput from './MessageInput';
import { TiMessages } from 'react-icons/ti';
import useConversation from '../../zustand/useConversation.js';

function MessageContainer() {
    const {selectedConversation} = useConversation();
    return (
        <div className='md:min-w-[450px] flex flex-col'>
            {!selectedConversation?(
                <NoChatSelected />
            ) : (
                <>
                    {/* Header */}
                    <div className='bg-slate-500 px-4 py-2 mb-2'>
                        <span className='label-text'>To:</span>
                        <span className='text-gray-900 font-bold'>{selectedConversation.firstName}</span>
                    </div>
                    <Messages />
                    <MessageInput />
                </>
            )}
        </div>
    );
}



const NoChatSelected = () => {
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <div
                className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col 
                items-center gap-2'
                aria-label="No chat selected message"
            >
                <p>Welcome 👋 To Chats ❄</p>
                <p>Select a chat to start Messaging</p>
                <TiMessages className='text-3xl md:text-6xl text-center' aria-hidden="true" />
            </div>
        </div>
    );
};

export default MessageContainer;
