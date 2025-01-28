import React from 'react';
import SearchInput from '../SearchInput';
import Conversations from '../Conversations';
import { FaHome } from "react-icons/fa";

function MessageSidebar() {
    const handleHomeNavigation = () => {
        // Add navigation logic here
        console.log('Navigating to home');
    };

    return (
        <div className='border-r border-slate-500 p-4 flex flex-col'>
            <SearchInput />
            {/* Divider */}
            <hr className='border-t border-gray-400 my-2' />
            <Conversations />
            {/* Home button */}
            <div className='mt-auto'>
                <button onClick={handleHomeNavigation} aria-label="Go to Home">
                    <FaHome className='w-6 text-white cursor-pointer hover:text-gray-300 active:text-gray-500' />
                </button>
            </div>
        </div>
    );
}

export default MessageSidebar;
