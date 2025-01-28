import React from 'react';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

//Register Chartjs components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function ClassDistributionChart({ classData }) {
    // Prepare data for the chart
    const classNames = classData.map((cls) => cls.className);
    const totalStudents = classData.map((cls) => cls.total);
    const maleCounts = classData.map((cls) => cls.maleCount);
    const femaleCounts = classData.map((cls) => cls.femaleCount);
    const data = {
        labels: classNames,
        datasets: [
            {
                label: 'Total Students',
                data: totalStudents,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Male Students',
                data: maleCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Female Students',
                data: femaleCounts,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Class Distribution of Students by Gender',
            },
        },
    };
    return (
        <Bar data={data} options={options}/>
    )
}

export default ClassDistributionChart