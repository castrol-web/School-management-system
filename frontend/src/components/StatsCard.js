import React from 'react';
import {FaEquals } from 'react-icons/fa';

function StatsCard({ title, value, icon: Icon, trend, trendDirection }) {
    //arrows based on trend arrow
    function getDirection() {
        if (trendDirection === 'up') return <div className="text-green-500">▲</div>;
        if (trendDirection === 'down') return <div className="text-red-500">▼</div>;
        return <FaEquals className="text-gray-500" />;
    }
    return (
        <div className="bg-gray-800 text-white p-4 rounded-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <div><p className="font-semibold lg:text-lg text-sm">{title}</p></div>
                <Icon className="lg:text-2xl text-lg"/>
            </div>
            <div className="text-3xl font-bold mb-2">{value}</div>
            <div className={`text-sm ${trendDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {getDirection()} {trend}
            </div>
        </div>
    )
}

export default StatsCard