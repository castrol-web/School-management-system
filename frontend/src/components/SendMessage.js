import React from 'react';
import MessageSidebar from './messages/MessageSidebar';
import MessageContainer from './messages/MessageContainer';

function SendMessage() {
    return (
        <div 
            className='flex h-full items-center justify-center' 
            style={{
                backgroundImage: "url(/bg.jpg)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            <div 
                className='flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding 
                backdrop-filter backdrop-blur-lg bg-opacity-0 shadow-lg'
            >
                <MessageSidebar />
                <MessageContainer />
            </div>
        </div>
    );
}

export default SendMessage;
