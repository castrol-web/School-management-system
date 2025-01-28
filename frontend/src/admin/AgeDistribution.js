import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, Filler,LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement,Filler, LineElement, Title, Tooltip, Legend);

function AgeDistribution({ classData }) {
    const classNames = classData.map((cls) => cls.className);
    const ageData = classData.map((cls) => {
        // Calculate the average age for each class
        const ages = cls.ages || [];
        return ages.length > 0 ? ages.reduce((a, b) => a + b, 0) / ages.length : 0;
    });
    const data = {
        labels: classNames,
        datasets: [
            {
                label: 'Average Age of Students',
                data: ageData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true, // Enables the fill below the line
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allows custom height
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Average Age of Students by Class',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Average Age',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Classes',
                },
            },
        },
    };
    return (
        <div style={{ height: '400px', maxWidth: '100%' }}>
            <Line data={data} options={options} />
        </div>
    )
}

export default AgeDistribution