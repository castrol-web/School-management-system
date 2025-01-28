import React from 'react'

function Footer() {
    const date = new Date();
    return (
        <footer className="py-3 text-center fixed bottom-0 right-0 pr-3 bw-full mx-auto shadow-lg">
            <div>
                <p className='text-gray-500 text-xs'>copyright © {date.getFullYear()} V1.1.0</p>
            </div>
        </footer>
    )
}

export default Footer